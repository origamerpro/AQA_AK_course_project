import { Locator, test } from '@playwright/test';
import { SalesPortalPage } from './salesPortal.page';
import { ModuleName } from 'types/home.types';

export class HomePage extends SalesPortalPage {
  title = this.page.getByRole('heading', {
    name: 'Welcome to Sales Management Portal',
  });
  customersButton = this.page.getByRole('link', { name: 'View Customers' });
  productsButton = this.page.getByRole('link', { name: 'View Products' });
  ordersButton = this.page.getByRole('link', { name: 'View Orders' });

  uniqueElement = this.title;

  async clickModuleButton(moduleName: ModuleName) {
    const moduleButtons: Record<ModuleName, Locator> = {
      Customers: this.customersButton,
      Products: this.productsButton,
      Orders: this.ordersButton,
    };
    return await test.step(`Click on the ${moduleName} module button`, async () => {
      await moduleButtons[moduleName].click();
    });
  }
}
