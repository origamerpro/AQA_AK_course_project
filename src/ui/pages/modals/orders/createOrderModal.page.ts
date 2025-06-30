import { logStep } from 'utils/reporter.utils';
import { ManagmentOrderModal } from '../baseModalManagmentOrder.page';

export class CreateOrderModal extends ManagmentOrderModal {
  readonly customersList = this.page.locator('#inputCustomerOrder');
  readonly createButton = this.page.locator('#create-order-btn');

  uniqueElement = this.modalTitle;

  @logStep('Select customer for order')
  async selectCustomer(customerName: string) {
    await this.customersList.selectOption({ value: customerName });
  }
  @logStep('Click Create button')
  async clickCreate() {
    await this.createButton.click();
  }
}
