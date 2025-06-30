import { BaseModal } from '../baseModal.page';
import { logStep } from 'utils/reporter.utils';

export class EditCustomerModalPage extends BaseModal {
  readonly modalTitle = this.page.locator('.modal-header h5');
  readonly customersList = this.page.locator('select[name="Customer"]');
  readonly saveButton = this.page.locator('#update-customer-btn');
  readonly cancelButton = this.page.locator('#cancel-edit-customer-modal-btn');
  readonly closeButton = this.page.locator('.btn-close.hover-danger');

  uniqueElement = this.modalTitle;

  @logStep('Get modal title')
  async getModalTitle() {
    return await this.uniqueElement.innerText();
  }

  @logStep('Select another customer for order')
  async selectCustomer(customerName: string) {
    await this.customersList.selectOption({ value: customerName });
  }

  @logStep('Click on the confirm button')
  async clickSaveButton() {
    await this.saveButton.click();
  }

  @logStep('Click on the cancel button')
  async clickCancelButton() {
    await this.cancelButton.click();
  }

  @logStep('Click on the close button')
  async clickCloseButton() {
    await this.closeButton.click();
  }
}
