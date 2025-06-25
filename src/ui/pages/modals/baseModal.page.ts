import { expect, Locator, Page } from '@playwright/test';
import { SalesPortalPage } from 'ui/pages/salesPortal.page';
import { logStep } from 'utils/reporter.utils';

export abstract class BaseModal extends SalesPortalPage {
  constructor(page: Page) {
    super(page);
  }
  abstract readonly uniqueElement: Locator;
  readonly closeButton = this.page.getByRole('button', {
    name: 'Close',
  });

  readonly cancelButton = this.page.getByRole('button', {
    name: 'Cancel',
    exact: true,
  });

  @logStep('Wait for Modal to be closed')
  async waitForClosed() {
    await expect(this.uniqueElement).not.toBeVisible();
  }

  @logStep('Click on the Close button')
  async clickCloseButton() {
    await this.closeButton.click();
  }

  @logStep('Click on the Cancel button')
  async clickCancelButton() {
    await this.cancelButton.click();
  }
}
