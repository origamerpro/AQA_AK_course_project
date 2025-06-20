import { APIRequestContext } from '@playwright/test';
import { CustomersApiService } from 'api/services/customers.api-service';
import { ProductsApiService } from 'api/services/product.api-service';
import { OrdersAPIService } from 'api/services/orders.api-service';

export class DataDisposalUtils {
  private ordersApiService: OrdersAPIService;
  private customersApiService: CustomersApiService;
  private productsApiService: ProductsApiService;

  constructor(context: APIRequestContext) {
    this.ordersApiService = new OrdersAPIService(context);
    this.productsApiService = new ProductsApiService(context);
    this.customersApiService = new CustomersApiService(context);
  }

  async clearOrders(orderId: string, token: string) {
    if (!orderId) {
      return;
    }
    try {
      await this.ordersApiService.deleteOrder(orderId, token);
    } catch (error) {
      console.error(` The order ${orderId} was not deleted}`, error);
    }
  }

  async clearProducts(productsIds: string[], token: string) {
    if (!productsIds || productsIds.length === 0) {
      return;
    }
    for (const productId of productsIds) {
      try {
        await this.productsApiService.delete(productId, token);
      } catch (error) {
        console.error(` The product ${productId} was not deleted}`, error);
      }
    }
  }

  async clearCustomers(customerId: string, token: string) {
    if (!customerId) {
      return;
    }
    try {
      await this.customersApiService.deleteCustomer(customerId, token);
    } catch (error) {
      console.error(` The customer ${customerId} was not deleted}`, error);
    }
  }
}
