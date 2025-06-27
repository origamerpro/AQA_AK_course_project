import { BaseModal } from '../baseModal.page';
import { logStep } from 'utils/reporter.utils';

export class CreateOrderModal extends BaseModal {
  readonly modalTitle = this.page.locator('h5.modal-title');
  readonly customersList = this.page.locator('#inputCustomerOrder');
  readonly productsList = this.page.locator('select[name="Product"]');
  readonly createButton = this.page.locator('#create-order-btn');
  readonly addProductButton = this.page.locator('#add-product-btn');
  readonly cancelButton = this.page.locator('#cancel-order-modal-btn');
  readonly totalPrice = this.page.locator('#total-price-order-modal');
  readonly deleteProductButtons = this.page.locator('.del-btn-modal');

  uniqueElement = this.modalTitle;

  @logStep('Get modal title')
  async getModalTitle() {
    return await this.uniqueElement.innerText();
  }

  @logStep('Select customer for order')
  async selectCustomer(customerName: string) {
    await this.customersList.selectOption({ value: customerName });
  }

  @logStep('Select product in order')
  async selectProduct(productName: string, productIndex: number = 0) {
    // Выбираем продукт по индексу (по умолчанию первый)
    await this.productsList
      .nth(productIndex)
      .selectOption({ value: productName });
  }

  @logStep('Select product in specific position')
  async selectProductAtPosition(productName: string, position: number) {
    // position начинается с 1 для лучшей читаемости в тестах
    await this.productsList
      .nth(position - 1)
      .selectOption({ label: productName });
  }

  @logStep('Click Create button')
  async clickCreate() {
    await this.createButton.click();
  }

  @logStep('Click Add Product button')
  async clickAddProduct() {
    await this.addProductButton.click();
  }

  @logStep('Click Cancel button')
  async clickCancel() {
    await this.cancelButton.click();
  }

  @logStep('Get total price')
  async getTotalPrice(): Promise<number> {
    const priceText = await this.totalPrice.innerText();
    return parseFloat(priceText.replace(/[^\d.]/g, ''));
  }

  @logStep('Delete product by index')
  async removeProduct(index: number = 0) {
    await this.deleteProductButtons.nth(index).click();
  }
}
