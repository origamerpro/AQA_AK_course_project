import { expect } from '@playwright/test';
import { SalesPortalPage } from 'ui/pages/salesPortal.page';
import { logStep } from 'utils/reporter.utils';

export abstract class Modal extends SalesPortalPage {
  @logStep('Wait for Modal to be closed')
  async waitForClosed() {
    await expect(this.uniqueElement).not.toBeVisible();
  }
}
