import { APIRequestContext } from '@playwright/test';
import { CustomersApiService } from 'api/services/customers.api-service';
import { ProductsApiService } from 'api/services/product.api-service';
import { OrdersAPIService } from 'api/services/orders.api-service';
import { SignInApiService } from 'api/services/signIn.api-service';

export class DataDisposalUtils {
  private ordersApiService: OrdersAPIService;
  private customersApiService: CustomersApiService;
  private productsApiService: ProductsApiService;
  private signInApiService: SignInApiService;

  constructor(context: APIRequestContext) {
    this.ordersApiService = new OrdersAPIService(context);
    this.productsApiService = new ProductsApiService(context);
    this.customersApiService = new CustomersApiService(context);
    this.signInApiService = new SignInApiService(context);
  }

  private token = '';

  private async prepareToken(): Promise<string> {
    if (!this.token) {
      this.token = await this.signInApiService.loginAsLocalUser();
    }
    return this.token;
  }

  private async getToken(token?: string): Promise<string> {
    return token ?? (await this.prepareToken());
  }

  async clearOrders(orderIds: string[] | string) {
    orderIds = Array.isArray(orderIds) ? orderIds : [orderIds];
    if (!orderIds.length) return;
    const authToken = await this.getToken();

    for (const orderId of orderIds) {
      try {
        await this.ordersApiService.deleteOrder(orderId, authToken);
      } catch (error) {
        console.error(` The product ${orderId} was not deleted}`, error);
      }
    }
  }

  async clearProducts(productsIds: string[]) {
    productsIds = Array.isArray(productsIds) ? productsIds : [productsIds];
    if (!productsIds.length) return;
    const authToken = await this.getToken();

    for (const productId of productsIds) {
      try {
        await this.productsApiService.delete(productId, authToken);
      } catch (error) {
        console.error(` The product ${productId} was not deleted}`, error);
      }
    }
  }

  async clearCustomers(customerIds: string[]) {
    customerIds = Array.isArray(customerIds) ? customerIds : [customerIds];
    if (!customerIds.length) return;
    const authToken = await this.getToken();

    for (const customerId of customerIds) {
      try {
        await this.customersApiService.deleteCustomer(customerId, authToken);
      } catch (error) {
        console.error(` The product ${customerId} was not deleted}`, error);
      }
    }
  }

  async tearDown(
    orderIds: string[],
    productsIds: string[],
    customersIds: string[],
  ) {
    await this.clearOrders(orderIds);
    await this.clearProducts(productsIds);
    await this.clearCustomers(customersIds);
  }
}
