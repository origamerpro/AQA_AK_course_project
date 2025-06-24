import { Page, test } from '@playwright/test';
import { ModuleName } from 'types/home.types';
import { HomePage } from 'ui/pages/home.page';
import { logStep } from 'utils/reporter.utils';

export class HomeUIService {
  homePage: HomePage;
  constructor(private page: Page) {
    this.homePage = new HomePage(page);
  }

  async openModule(moduleName: ModuleName) {
    return await test.step(`Open ${moduleName} module on Home Page`, async () => {
      await this.homePage.clickModuleButton(moduleName);

      await (this as any)[`${moduleName.toLowerCase()}Page`].waitForOpened();
    });
  }

  @logStep('Open Sales Portal on Home Page as logged in user')
  async openAsLoggedInUser() {
    await this.homePage.openPortal();
    await this.homePage.waitForOpened();
  }
}
