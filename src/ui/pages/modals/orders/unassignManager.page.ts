import { logStep } from 'utils/reporter.utils';
import { BaseModal } from '../baseModal.page';
import { Page } from '@playwright/test';

export class UnassignManagerModal extends BaseModal {
  constructor(page: Page) {
    super(page);
  }

  readonly modalTitle = this.page.getByRole('heading', {
    name: ' Unassign Manager',
    exact: true,
  });
  readonly modalContent = this.page.locator('.modal-content');
  readonly yesUnassignButton = this.page.getByRole('button', {
    name: 'Yes, Unassign',
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

  @logStep('Click Yes, Unassign button')
  async clickYesUnassignButton() {
    await this.yesUnassignButton.click();
  }
}
