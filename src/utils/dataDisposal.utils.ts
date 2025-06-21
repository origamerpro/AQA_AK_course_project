/* eslint-disable prettier/prettier */
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

  async clearOrders(orderIds: string[], token: string) {
    if (!orderIds || orderIds.length === 0) {
      return;
    }
    for (const orderId of orderIds) {
      try {
        await this.ordersApiService.deleteOrder(orderId, token);
      } catch (error) {
        console.error(` The product ${orderId} was not deleted}`, error);
      }
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

  async clearCustomers(customerIds: string[], token: string) {
    if (!customerIds || customerIds.length === 0) {
      return;
    }
    for (const customerId of customerIds) {
      try {
        await this.customersApiService.deleteCustomer(customerId, token);
      } catch (error) {
        console.error(` The product ${customerId} was not deleted}`, error);
      }
    }
  }
}
