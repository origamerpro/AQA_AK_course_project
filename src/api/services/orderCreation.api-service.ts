import { APIRequestContext } from '@playwright/test';
import { generateCustomerData } from 'data/customers/generateCustomer.data';
import { ORDER_STATUS } from 'data/orders/statuses.data';
import { generateProductData } from 'data/products/generateProduct.data';
import { ICustomerFromResponse } from 'types/customer.types';
import { OrdersAPIService } from './orders.api-service';
import { SignInApiService } from './signIn.api-service';
import { CustomersApiService } from './customers.api-service';
import { ProductsApiService } from './product.api-service';
import { IProductFromResponse } from 'types/products.types';
import { IOrderData } from 'types/orders.types';
import { generateDeliveryData } from 'data/orders/generateDeliveryData.data';

export class OrdersCreationService {
  private ordersApiService: OrdersAPIService;
  private customersApiService: CustomersApiService;
  private productsApiService: ProductsApiService;
  private signInApiService: SignInApiService;

  constructor(context: APIRequestContext) {
    this.ordersApiService = new OrdersAPIService(context);
    this.customersApiService = new CustomersApiService(context);
    this.productsApiService = new ProductsApiService(context);
    this.signInApiService = new SignInApiService(context);
  }

  private async getCustomerAndProducts(numProducts: number = 1): Promise<{
    token: string;
    customer: ICustomerFromResponse;
    products: IProductFromResponse[];
  }> {
    const token = await this.signInApiService.loginAsLocalUser();

    const customerData = generateCustomerData();
    const customer = await this.customersApiService.createCustomer(
      token,
      customerData,
    );

    const createdProducts: IProductFromResponse[] = [];
    for (let i = 0; i < numProducts; i++) {
      const productData = generateProductData();
      const product = await this.productsApiService.create(token, productData);
      createdProducts.push({
        _id: product._id,
        name: product.name,
        amount: product.amount,
        price: product.price,
        manufacturer: product.manufacturer,
        notes: product.notes,
        createdOn: product.createdOn,
      });
    }
    return { token, customer, products: createdProducts };
  }

  async createDraftOrder(numProducts: number = 1) {
    const { token, customer, products } =
      await this.getCustomerAndProducts(numProducts);

    const orderData: IOrderData = {
      customer: customer._id,
      products: products.map((p) => p._id),
    };

    const order = await this.ordersApiService.create(orderData, token);
    return { order, token };
  }

  async createInProcessOrder(numProducts: number = 1) {
    const { order: draftOrder, token } =
      await this.createDraftOrder(numProducts);

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

  async createPartiallyReceivedOrder(
    receivedProductsCount: number = 1,
    numProductsInOrder: number = 3,
  ) {
    const { order: inProcessOrder, token } =
      await this.createInProcessOrder(numProductsInOrder);

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

  async createReceivedOrder(numProductsInOrder: number = 3) {
    const { order: inProcessOrder, token } =
      await this.createInProcessOrder(numProductsInOrder);

    const allProductIds = inProcessOrder.products.map((p) => p._id);

    const updatedOrder = await this.ordersApiService.receiveProducts(
      inProcessOrder._id,
      allProductIds,
      token,
    );

    return { order: updatedOrder, token };
  }

  async createCanceledOrder(numProducts: number = 1) {
    const { order: draftOrder, token } =
      await this.createDraftOrder(numProducts);

    const updatedOrder = await this.ordersApiService.updateStatus(
      draftOrder._id,
      ORDER_STATUS.CANCELED,
      token,
    );

    return { order: updatedOrder, token };
  }
}
