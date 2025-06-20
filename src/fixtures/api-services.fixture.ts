import { test as base } from 'fixtures/controllers.fixture';
import { SignInApiService } from 'api/services/signIn.api-service';
import { ProductsApiService } from 'api/services/product.api-service';
import { CustomersApiService } from 'api/services/customers.api-service';
import { OrdersAPIService } from 'api/services/orders.api-service';
import { DataDisposalUtils } from 'utils/dataDisposal.utils';

interface IApiServices {
  customersApiService: CustomersApiService;
  signInApiService: SignInApiService;
  productsApiService: ProductsApiService;
  ordersApiService: OrdersAPIService;
  dataDisposalUtils: DataDisposalUtils;
}

export const test = base.extend<IApiServices>({
  signInApiService: async ({ request }, use) => {
    await use(new SignInApiService(request));
  },
  productsApiService: async ({ request }, use) => {
    await use(new ProductsApiService(request));
  },

  customersApiService: async ({ request }, use) => {
    await use(new CustomersApiService(request));
  },

  ordersApiService: async ({ request }, use) => {
    await use(new OrdersAPIService(request));
  },

  dataDisposalUtils: async ({ request }, use) => {
    await use(new DataDisposalUtils(request));
  },
});

export { expect } from '@playwright/test';
