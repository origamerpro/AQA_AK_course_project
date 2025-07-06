import { Locator, expect } from '@playwright/test';
import { logStep } from 'utils/reporter.utils';
import { BasePage } from './base.page';
import { SALES_PORTAL_URL } from 'config/environment';

export abstract class PageHolder extends BasePage {
  readonly spinner = this.page.locator('.spinner-border');
  readonly notification = this.page.locator('.toast-body');

  abstract uniqueElement: Locator;

  @logStep('Wait for Page to be opened')
  async waitForOpened() {
    await expect(this.uniqueElement).toBeVisible();
    await this.waitForSpinner();
  }

  @logStep('Wait for Spinner to be hidden')
  async waitForSpinner() {
    await expect(this.spinner).toHaveCount(0);
  }

  @logStep('Wait for Notification to appear')
  async waitForNotification(text: string) {
    await expect(this.notification.last()).toHaveText(text);
  }

  getNotificationByText(text: string) {
    return this.page.locator('.toast-body', { hasText: text }).last();
  }

  @logStep('Open Sales Portal')
  async openPortal() {
    await this.page.goto(SALES_PORTAL_URL);
  }
}
