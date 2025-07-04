import { test as base } from 'fixtures/mock.fixture';

import { HomePage } from 'ui/pages/home.page';
import { SignInPage } from 'ui/pages/signIn.page';
import { OrdersPage } from 'ui/pages/orders/orders.page';
import { ConfirmationModal } from 'ui/pages/modals/orders/confirmationModal.page';
import { OrderDetailsPage } from 'ui/pages/orders/orderDetails.page';
import { EditCustomerModalPage } from 'ui/pages/modals/orders/editCustomerModal.page';

interface ISalesPortalPages {
  homePage: HomePage;
  signInPage: SignInPage;
  ordersPage: OrdersPage;
  orderDetailsPage: OrderDetailsPage;
  confirmationModal: ConfirmationModal;
  editCustomerModalPage: EditCustomerModalPage;
}

export const test = base.extend<ISalesPortalPages>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },

  signInPage: async ({ page }, use) => {
    await use(new SignInPage(page));
  },

  ordersPage: async ({ page }, use) => {
    await use(new OrdersPage(page));
  },

  orderDetailsPage: async ({ page }, use) => {
    await use(new OrderDetailsPage(page));
  },

  confirmationModal: async ({ page }, use) => {
    await use(new ConfirmationModal(page));
  },

  editCustomerModalPage: async ({ page }, use) => {
    await use(new EditCustomerModalPage(page));
  },
});

export { expect } from '@playwright/test';
