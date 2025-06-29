import { SalesPortalPage } from 'ui/pages/salesPortal.page';

export class OrderDetailsReceivedProductsSection extends SalesPortalPage {
  // Локаторы раздела "Received Products" для заказа в статусе "Draft"
  readonly productsContainer = this.page.locator('#products-section');
  readonly title = this.productsContainer.getByRole('heading', {
    name: 'Requested Products',
  });
  readonly editProductsPencilButton = this.productsContainer.locator(
    '#edit-products-pencil',
  );

  readonly productsAccordionSection = this.productsContainer.locator(
    '#products-accordion-section',
  );
  readonly allProductAccordionHeaders =
    this.productsAccordionSection.locator('.accordion-header');
  readonly productAccordionHeaderButtonByName = (productName: string) =>
    this.productsAccordionSection.locator('button.accordion-button', {
      hasText: productName,
    });
  productDetailsPanelByName(productName: string) {
    const productHeader = this.productsAccordionSection.locator(
      `div.accordion-header:has(button:has-text("${productName}"))`,
    );
    return productHeader.locator('+ .accordion-collapse .accordion-body');
  }
  readonly allReceivedStatusSpans = this.productsAccordionSection.locator(
    'span.received-label',
  );
  receivedStatusSpanTextByProductName(productName: string) {
    const productHeader = this.productsAccordionSection.locator(
      `div.accordion-header:has(button:has-text("${productName}"))`,
    );
    return productHeader.locator('span.received-label');
  }

  // Локаторы раздела "Received Products" для заказа в статусе "In Process"
  readonly receiveButton = this.productsContainer.locator(
    '#start-receiving-products',
  );

  // Локаторы раздела "Received Products" после нажатия кнопки "Receive"
  readonly cancelReceivingButton =
    this.productsContainer.locator('#cancel-receiving');
  readonly saveReceivedProductsButton = this.productsContainer.locator(
    '#save-received-products',
  );

  readonly selectAllCheckbox = this.productsContainer.locator('#selectAll');
  productReceivedCheckboxByName(productName: string) {
    const productHeader = this.productsAccordionSection.locator(
      `div.accordion-header:has(button:has-text("${productName}"))`,
    );
    return productHeader.locator(
      'div.received-label input.form-check-input[type="checkbox"][name="product"]',
    );
  }
  readonly allReceivedCheckboxesLabels = this.productsAccordionSection.locator(
    'div.received-label label.form-check-label',
  );
  receivedCheckboxLabelTextByProductName(productName: string) {
    const productHeader = this.productsAccordionSection.locator(
      `div.accordion-header:has(button:has-text("${productName}"))`,
    );
    return productHeader.locator(
      'div.received-label label.form-check-label[for^="check"]',
    );
  }

  uniqueElement = this.title;

  // Методы для взаимодействия с элементами раздела "Received Products" для заказа в статусе "Draft"
  async getTitle() {
    return await this.title.innerText();
  }

  async clickEditProductsPencilButton() {
    await this.editProductsPencilButton.click();
  }

  async getProductsAccordionCount() {
    return await this.allProductAccordionHeaders.count();
  }

  async clickProductAccordionHeaderButton(productName: string) {
    await this.productAccordionHeaderButtonByName(productName).click();
  }

  async isProductAccordionExpanded(productName: string) {
    const button = this.productAccordionHeaderButtonByName(productName);
    console.log('Value of button:', button);

    console.log(
      'Value of aria-expanded:',
      await button.getAttribute('aria-expanded'),
    );
    return (await button.getAttribute('aria-expanded')) === 'true';
  }

  async isProductAccordionCollapsed(productName: string) {
    const button = this.productAccordionHeaderButtonByName(productName);
    return (await button.getAttribute('aria-expanded')) === 'false';
  }

  async getProductDetailsAsObject(productName: string) {
    const detailsPanel = this.productDetailsPanelByName(productName);
    const detailElements = await detailsPanel.locator('div.c-details').all();

    const productDetails: Record<string, string> = {};
    for (const detailElement of detailElements) {
      const keyLocator = detailElement.locator('span.s-span').first();
      const valueLocator = detailElement.locator('span.s-span').nth(1);

      const keyText = await keyLocator.innerText();
      const valueText = await valueLocator.innerText();

      if (keyText && valueText) {
        productDetails[keyText] = valueText;
      }
    }
    return productDetails;
  }

  async getAllProductReceivedStatusTexts() {
    return await this.allReceivedStatusSpans.allInnerTexts();
  }

  async getProductReceivedStatusText(productName: string) {
    return await this.receivedStatusSpanTextByProductName(
      productName,
    ).innerText();
  }

  // Методы для взаимодействия с элементами раздела "Received Products" для заказа в статусе "In Process"
  async clickReceiveButton() {
    await this.receiveButton.click();
  }

  // Методы для взаимодействия с элементами раздела "Received Products" после нажатия кнопки "Receive"
  async clickCancelReceivingButton() {
    await this.cancelReceivingButton.click();
  }

  async clickSaveReceivedProductsButton() {
    await this.saveReceivedProductsButton.click();
  }

  async clickSelectAllCheckbox() {
    await this.selectAllCheckbox.click();
  }

  async setProductReceivedCheckbox(productName: string, checkState: boolean) {
    const checkbox = this.productReceivedCheckboxByName(productName);
    await (checkState ? checkbox.check() : checkbox.uncheck());
  }

  async isProductReceivedCheckboxChecked(productName: string) {
    return await this.productReceivedCheckboxByName(productName).isChecked();
  }

  async getProductReceivedLabelText(productName: string) {
    return await this.receivedCheckboxLabelTextByProductName(
      productName,
    ).innerText();
  }

  async isSelectAllCheckboxChecked() {
    return await this.selectAllCheckbox.isChecked();
  }
}
