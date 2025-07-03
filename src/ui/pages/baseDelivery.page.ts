import { expect } from '@playwright/test';
import { logStep } from 'utils/reporter.utils';
import { SalesPortalPage } from './salesPortal.page';
import { IAddress, IDelivery } from 'types/orders.types';
import { DELIVERY, LOCATION } from 'data/orders/delivery.data';

export abstract class BaseDeliveryPage extends SalesPortalPage {
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
  readonly titleLocator = this.page.locator('#title h2.fw-bold');
  readonly datepicker = this.page.locator('.datepicker-days');

  getDayCell(day: number) {
    return this.datepicker
      .locator(`td.day:not(.disabled):has-text("${day}")`)
      .first();
  }

  uniqueElement = this.deliveryType;
  abstract expectedTitle: string;

  async verifyPageTitle() {
    await expect(this.titleLocator).toHaveText(this.expectedTitle);
  }

  @logStep('Select delivery type')
  async selectDeliveryType(type: string) {
    await this.deliveryType.selectOption(type);
  }

  @logStep('Set delivery date')
  async setDeliveryDate(date: string) {
    const targetDate = new Date(date);
    const day = targetDate.getDate();

    await this.deliveryDate.click();
    await this.datepicker.waitFor({ state: 'visible' });

    const dayCell = this.getDayCell(day);

    if ((await dayCell.count()) === 0) {
      throw new Error(`Дата ${date} недоступна для выбора`);
    }

    await dayCell.click();
  }

  @logStep('Fill address form')
  async fillAddress(address: IAddress, deliveryType: DELIVERY) {
    if (deliveryType === DELIVERY.DELIVERY) {
      if (address.location === LOCATION.OTHER) {
        if (await this.location.isVisible()) {
          await this.location.selectOption({ label: address.location });
        }
        await this.country.selectOption({ label: address.country });
      } else if (address.location === LOCATION.HOME) {
        await this.country.fill(address.country);
      }
    } else if (deliveryType === DELIVERY.PICKUP) {
      await this.country.selectOption({ label: address.country });
    }

    await this.city.fill(address.city);
    await this.street.fill(address.street);
    await this.house.fill(address.house.toString());
    await this.flat.fill(address.flat.toString());
  }

  @logStep('Click Save Delivery button')
  async saveDelivery() {
    await this.saveButton.click();
    await this.waitForSpinner();
  }

  @logStep('Click Cancel button')
  async cancel() {
    await this.cancelButton.click();
    await this.waitForSpinner();
  }

  @logStep('Complete and submit delivery form')
  async completeDeliveryForm(data: IDelivery) {
    await this.waitForOpened();
    await this.selectDeliveryType(data.condition);
    await this.setDeliveryDate(data.finalDate);
    await this.fillAddress(data.address, data.condition);
  }
}
