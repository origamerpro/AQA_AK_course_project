import { test as base } from '@playwright/test'
import { SignInController } from 'api/controllers/signIn.controller'
import { CustomersController } from "api/controllers/customers.controller";
import { ProductsController } from 'api/controllers/products.controller'

interface ISalesPortalControllers {
  customersController: CustomersController;
  productsController: ProductsController
  signInController: SignInController
}

export const test = base.extend<ISalesPortalControllers>({
  signInController: async ({ request }, use) => {
    await use(new SignInController(request))
  },
    customersController: async ({ request }, use) => {
        await use(new CustomersController(request));
    },
  productsController: async ({ request }, use) => {
    await use(new ProductsController(request))
  },
})

export { expect } from '@playwright/test'
