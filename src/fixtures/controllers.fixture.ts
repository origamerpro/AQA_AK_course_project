import { test as base } from '@playwright/test';
import { SignInController } from 'api/controllers/signIn.controller';
import { CustomersController } from 'api/controllers/customers.controller';
import { ProductsController } from 'api/controllers/products.controller';
import { OrdersAPIController } from 'api/controllers/orders.controller';

interface ISalesPortalControllers {
  customersController: CustomersController;
  productsController: ProductsController;
  signInController: SignInController;
  ordersController: OrdersAPIController;
}

export const test = base.extend<ISalesPortalControllers>({
  signInController: async ({ request }, use) => {
    await use(new SignInController(request));
  },
  customersController: async ({ request }, use) => {
    await use(new CustomersController(request));
  },
  productsController: async ({ request }, use) => {
    await use(new ProductsController(request));
  },

  ordersController: async ({ request }, use) => {
    await use(new OrdersAPIController(request));
  },
});

export { expect } from '@playwright/test';
