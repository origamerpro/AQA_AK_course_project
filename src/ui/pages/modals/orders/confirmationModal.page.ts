import { BaseModal } from '../baseModal.page';
import { logStep } from 'utils/reporter.utils';
export class ConfirmationModal extends BaseModal {
  readonly modalTitle = this.page.locator('.modal-header h5');
  readonly confirmButton = this.page.locator('.modal-footer .btn-danger');
  readonly modalContent = this.page.locator('.modal-body-text > p');

  uniqueElement = this.modalTitle;

  @logStep('Get modal title')
  async getModalTitle() {
    return await this.uniqueElement.innerText();
  }

  @logStep('Click on the confirm button')
  async clickConfirmButton() {
    await this.confirmButton.click();
  }

  @logStep('Get modal content')
  async getModalContent() {
    return await this.modalContent.innerText();
  }
}
