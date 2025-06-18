import { logStep } from 'utils/reporter.utils';
import { validateResponse } from 'utils/validations/responseValidation';
import { STATUS_CODES } from 'data/statusCodes';
import { OrdersAPIController } from '../controllers/orders.controller';
import { APIRequestContext } from '@playwright/test';
import {
  IDelivery,
  IOrderData,
  IOrderRequestParams,
  IOrderFilteredResponse,
  IOrderFromResponse,
} from 'types/orders.types';
import { ORDER_STATUS } from 'data/orders/statuses.data';
import { CustomersApiService } from './customers.api-service';
import { ProductsApiService } from './product.api-service';
import { SignInApiService } from './signIn.api-service';
import { generateDeliveryData } from 'data/orders/generateDeliveryData.data';
import { ICustomerFromResponse } from 'types/customer.types';
import { IProductFromResponse } from 'types/products.types';

export class OrdersAPIService {
  private controller: OrdersAPIController;
  private ordersApiService: OrdersAPIService;
  private customersApiService: CustomersApiService;
  private productsApiService: ProductsApiService;
  private signInApiService: SignInApiService;

  constructor(context: APIRequestContext) {
    this.controller = new OrdersAPIController(context);
    this.ordersApiService = new OrdersAPIService(context);
    this.customersApiService = new CustomersApiService(context);
    this.productsApiService = new ProductsApiService(context);
    this.signInApiService = new SignInApiService(context);
  }

  @logStep('Create order via API')
  async create(data: IOrderData, token: string): Promise<IOrderFromResponse> {
    const response = await this.controller.create(data, token);
    validateResponse(response, STATUS_CODES.CREATED, true, null);
    return response.body.Order;
  }

  @logStep('Get filtered and sorted list of orders via API')
  async getFilteredOrders(
    token: string,
    params?: IOrderRequestParams,
  ): Promise<IOrderFilteredResponse> {
    const response = await this.controller.getFilteredOrders(token, params);
    validateResponse(response, STATUS_CODES.OK, true, null);
    return response.body;
  }

  @logStep('Get order by ID via API')
  async getOrderByID(id: string, token: string) {
    const response = await this.controller.getByID(id, token);
    validateResponse(response, STATUS_CODES.OK, true, null);
    return response.body.Order;
  }

  @logStep('Update order via API')
  async updateOrder(
    id: string,
    data: IOrderData,
    token: string,
  ): Promise<IOrderFromResponse> {
    const response = await this.controller.updateOrder(id, data, token);
    validateResponse(response, STATUS_CODES.OK, true, null);
    return response.body.Order;
  }

  @logStep('Delete order via API')
  async deleteOrder(id: string, token: string) {
    const response = await this.controller.delete(id, token);
    validateResponse(response, STATUS_CODES.DELETED, null, null);
  }

  @logStep('Assign manager to order via API')
  async assignManager(orderId: string, managerId: string, token: string) {
    const response = await this.controller.assignManager(
      orderId,
      managerId,
      token,
    );
    validateResponse(response, STATUS_CODES.OK, true, null);
    return response.body.Order;
  }

  @logStep('Unassign manager from order via API')
  async unassignManager(orderId: string, token: string) {
    const response = await this.controller.unassignManager(orderId, token);
    validateResponse(response, STATUS_CODES.OK, true, null);
    return response.body.Order;
  }

  @logStep('Add order comment via API')
  async addComment(id: string, text: string, token: string) {
    const response = await this.controller.addComment(id, text, token);
    validateResponse(response, STATUS_CODES.OK, true, null);
    return response.body.Order;
  }

  @logStep('Delete order comment via API')
  async deleteComment(order_id: string, comment_id: string, token: string) {
    const response = await this.controller.deleteComment(
      order_id,
      comment_id,
      token,
    );
    validateResponse(response, STATUS_CODES.OK, null, null);
  }

  @logStep('Update order delivery via API')
  async updateDelivery(id: string, delivery: IDelivery, token: string) {
    const response = await this.controller.updateDelivery(id, delivery, token);
    validateResponse(response, STATUS_CODES.OK, true, null);
    return response.body.Order;
  }

  @logStep('Mark products as received in an order via API')
  async receiveProducts(id: string, productIds: string[], token: string) {
    const response = await this.controller.receiveProducts(
      id,
      productIds,
      token,
    );
    validateResponse(response, STATUS_CODES.OK, true, null);
    return response.body.Order;
  }

  @logStep('Update order status via API')
  async updateStatus(id: string, status: ORDER_STATUS, token: string) {
    const response = await this.controller.updateStatus(id, status, token);
    validateResponse(response, STATUS_CODES.OK, true, null);
    return response.body.Order;
  }

  @logStep('Create draft order via API')
  async createDraftOrder(count: number = 1) {
    const token = await this.signInApiService.loginAsLocalUser();

    const customer: ICustomerFromResponse =
      await this.customersApiService.createCustomer(token);

    const products: IProductFromResponse[] =
      await this.productsApiService.populate(count, token);
    const orderData: IOrderData = {
      customer: customer._id,
      products: products.map((p) => p._id),
    };

    const order = await this.ordersApiService.create(orderData, token);
    return { order, token };
  }

  @logStep('Create in process order via API')
  async createInProcessOrder(count: number = 1) {
    const { order: draftOrder, token } = await this.createDraftOrder(count);

    const deliveryData = generateDeliveryData();
    const orderWithDelivery = await this.ordersApiService.updateDelivery(
      draftOrder._id,
      deliveryData,
      token,
    );

    const inProcessOrder = await this.ordersApiService.updateStatus(
      orderWithDelivery._id,
      ORDER_STATUS.IN_PROCESS,
      token,
    );

    return { order: inProcessOrder, token };
  }

  @logStep('Create partially received order via API')
  async createPartiallyReceivedOrder(
    receivedProductsCount: number = 1,
    countInOrder: number = 3,
  ) {
    const { order: inProcessOrder, token } =
      await this.createInProcessOrder(countInOrder);

    const receivedProductsId = inProcessOrder.products
      .slice(0, receivedProductsCount)
      .map((p) => p._id);

    const updatedOrder = await this.ordersApiService.receiveProducts(
      inProcessOrder._id,
      receivedProductsId,
      token,
    );

    return { order: updatedOrder, token };
  }

  @logStep('Create received order via API')
  async createReceivedOrder(count: number = 3) {
    const { order: inProcessOrder, token } =
      await this.createInProcessOrder(count);

    const allProductIds = inProcessOrder.products.map((p) => p._id);

    const updatedOrder = await this.ordersApiService.receiveProducts(
      inProcessOrder._id,
      allProductIds,
      token,
    );

    return { order: updatedOrder, token };
  }

  @logStep('Create canceled order via API')
  async createCanceledOrder(count: number = 1) {
    const { order: draftOrder, token } = await this.createDraftOrder(count);

    const updatedOrder = await this.ordersApiService.updateStatus(
      draftOrder._id,
      ORDER_STATUS.CANCELED,
      token,
    );

    return { order: updatedOrder, token };
  }

  @logStep('Create cancelled and reopened order via API')
  async createOrderCancelAndReopen(
    numProducts: number = 1,
  ): Promise<{ order: IOrderFromResponse; token: string }> {
    const { order: draftOrder, token } =
      await this.createDraftOrder(numProducts);

    const canceledOrder = await this.ordersApiService.updateStatus(
      draftOrder._id,
      ORDER_STATUS.CANCELED,
      token,
    );

    const reopenedOrder = await this.ordersApiService.updateStatus(
      canceledOrder._id,
      ORDER_STATUS.DRAFT,
      token,
    );

    return { order: reopenedOrder, token };
  }
}
