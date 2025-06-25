import { logStep } from 'utils/reporter.utils';
import { BaseModal } from '../baseModal.page';
import { Page } from '@playwright/test';

export class ProcessOrderModal extends BaseModal {
  constructor(page: Page) {
    super(page);
  }

  readonly modalTitle = this.page.getByRole('heading', {
    name: 'Process Order',
    exact: true,
  });
  readonly modalContent = this.page.locator('.modal-body-text > p');
  readonly yesProcessButton = this.page.getByRole('button', {
    name: 'Yes, Process',
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

  @logStep('Click on the Yes, Process button')
  async clickYesProcessButton() {
    await this.yesProcessButton.click();
  }
}
