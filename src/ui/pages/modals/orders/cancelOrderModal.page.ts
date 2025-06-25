import { logStep } from 'utils/reporter.utils';
import { BaseModal } from '../baseModal.page';
import { Page } from '@playwright/test';

export class CancelOrderModal extends BaseModal {
  constructor(page: Page) {
    super(page);
  }

  readonly modalTitle = this.page.getByRole('heading', {
    name: ' Cancel Order',
    exact: true,
  });
  readonly modalContent = this.page.locator('.modal-body-text > p');
  readonly yesCancelButton = this.page.getByRole('button', {
    name: 'Yes, Cancel',
    exact: true,
  });

  uniqueElement = this.modalTitle;

  @logStep('Get modal title')
  async getModalTitle() {
    return await this.modalTitle.innerText();
  }

  @logStep('Get modal content')
  async getModalContent() {
    return await this.modalContent.innerText();
  }

  @logStep('Click on the Yes, Cancel button')
  async clickYesCancelButton() {
    await this.yesCancelButton.click();
  }
}
