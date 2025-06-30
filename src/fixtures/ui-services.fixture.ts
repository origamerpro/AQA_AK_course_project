import { HomeUIService } from 'ui/services/home.ui-service';
import { SignInUIService } from 'ui/services/signIn.ui-service';
import { OrderDetailsService } from 'ui/services/orderDetails.ui-service';
import { test as base } from 'fixtures/pages.fixture';

interface IUIServices {
  homeUIService: HomeUIService;
  signInUIService: SignInUIService;
  orderDetailsService: OrderDetailsService;
}

export const test = base.extend<IUIServices>({
  homeUIService: async ({ page }, use) => {
    await use(new HomeUIService(page));
  },
  signInUIService: async ({ page }, use) => {
    await use(new SignInUIService(page));
  },
  orderDetailsService: async ({ page }, use) => {
    await use(new OrderDetailsService(page));
  },
});

export { expect } from '@playwright/test';
