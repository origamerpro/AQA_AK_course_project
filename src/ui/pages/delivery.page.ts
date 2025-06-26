import { logStep } from 'utils/reporter.utils';
import { SalesPortalPage } from './salesPortal.page';
import { IAddress, IDelivery } from 'types/orders.types';

export class deliveryPage extends SalesPortalPage {
  readonly deliveryType = this.page.locator('#inputType');
  readonly deliveryDate = this.page.locator('#date-input');
  readonly location = this.page.locator('#inputLocation');
  readonly country = this.page.locator('#inputCountry');
  readonly city = this.page.locator('#inputCity');
  readonly street = this.page.locator('#inputStreet');
  readonly house = this.page.locator('#inputHouse');
  readonly flat = this.page.locator('#inputFlat');
  readonly saveButton = this.page.locator('#save-delivery');
  readonly cancelButton = this.page.locator('#back-to-order-details-page');

  uniqueElement = this.deliveryType;

  @logStep('Select delivery type')
  async selectDeliveryType(type: string) {
    await this.deliveryType.selectOption(type);
  }

  @logStep('Set delivery date')
  async setDeliveryDate(date: string) {
    await this.deliveryDate.fill(date);
  }

  @logStep('Fill address form')
  async fillAddress(address: IAddress) {
    if (address.location && (await this.location.isVisible())) {
      await this.location.fill(address.location);
    }

    await this.country.fill(address.country);
    await this.city.fill(address.city);
    await this.street.fill(address.street);
    await this.house.fill(address.house);
    await this.flat.fill(address.flat);
  }

  @logStep('Click Save Delivery button')
  async saveDelivery() {
    await this.saveButton.click();
    await this.waitForSpinner();
  }

  @logStep('Click Cancel and return to order details')
  async cancel() {
    await this.cancelButton.click();
    await this.waitForSpinner();
  }

  @logStep('Complete and submit delivery form')
  async completeDeliveryForm(data: IDelivery) {
    await this.waitForOpened();
    await this.selectDeliveryType(data.condition);
    await this.setDeliveryDate(data.finalDate);
    await this.fillAddress(data.address);
  }
}
