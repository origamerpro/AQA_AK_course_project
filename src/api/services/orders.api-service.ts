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

export class OrdersAPIService {
  private controller: OrdersAPIController;

  constructor(context: APIRequestContext) {
    this.controller = new OrdersAPIController(context);
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
}
