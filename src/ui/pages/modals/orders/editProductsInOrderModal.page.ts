import { logStep } from 'utils/reporter.utils';
import { ManagmentOrderModal } from '../baseModalManagmentOrder.page';

export class EditOrderModal extends ManagmentOrderModal {
  readonly saveButton = this.page.locator('#update-products-btn');
  readonly saveButtonDisabled = this.saveButton.locator(':disabled');

  uniqueElement = this.modalTitle;

  @logStep('Click Save button')
  async clickSave() {
    await this.saveButton.click();
  }

  @logStep('Check if Save button is enabled')
  async isSaveEnabled(): Promise<boolean> {
    return await this.saveButton.isEnabled();
  }

  @logStep('Check if Save button is disabled')
  async isSaveDisabled(): Promise<boolean> {
    return await this.saveButtonDisabled.isVisible();
  }
}
