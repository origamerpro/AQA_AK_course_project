import { SalesPortalPage } from '../../salesPortal.page';
import { logStep } from '../../../../utils/reporter.utils';

export class OrderCustomerDetailsComponentPage extends SalesPortalPage {
  readonly uniqueElement = this.page.locator('#customer-section');

  readonly title = this.uniqueElement.getByRole('heading', { name: 'Customer Details' });
  readonly editCustomerButton = this.uniqueElement.locator('#edit-customer-pencil');
  readonly customerEmail = this.uniqueElement.locator(
    '.c-details:has(span:has-text("Email")) > span.s-span:last-of-type',
  );
  readonly customerName = this.uniqueElement.locator(
    '.c-details:has(span:has-text("Name")) > span.s-span:last-of-type',
  );
  readonly customerCountry = this.uniqueElement.locator(
    '.c-details:has(span:has-text("Country")) > span.s-span:last-of-type',
  );
  readonly customerCity = this.uniqueElement.locator(
    '.c-details:has(span:has-text("City")) > span.s-span:last-of-type',
  );
  readonly customerStreet = this.uniqueElement.locator(
    '.c-details:has(span:has-text("Street")) > span.s-span:last-of-type',
  );
  readonly customerHouse = this.uniqueElement.locator(
    '.c-details:has(span:has-text("House")) > span.s-span:last-of-type',
  );
  readonly customerFlat = this.uniqueElement.locator(
    '.c-details:has(span:has-text("Flat")) > span.s-span:last-of-type',
  );
  readonly customerPhone = this.uniqueElement.locator(
    '.c-details:has(span:has-text("Phone")) > span.s-span:last-of-type',
  );
  readonly customerCreatedOn = this.uniqueElement.locator(
    '.c-details:has(span:has-text("Created On")) > span.s-span:last-of-type',
  );
  readonly customerNotes = this.uniqueElement.locator(
    '.c-details:has(span:has-text("Notes")) > span.s-span:last-of-type',
  );

  @logStep('Get Customer Details Title')
  async getCustomerDetailsTitle() {
    return await this.title.textContent();
  }

  @logStep('Click On "Edit Customer" button')
  async clickEditCustomerButton() {
    await this.editCustomerButton.click();
  }

  @logStep('Get Customer Email')
  async getCustomerEmail() {
    return await this.customerEmail.textContent();
  }

  @logStep('Get Customer Name')
  async getCustomerName() {
    return await this.customerName.textContent();
  }

  @logStep('Get Customer Country')
  async getCustomerCountry() {
    return await this.customerCountry.textContent();
  }

  @logStep('Get Customer City')
  async getCustomerCity() {
    return await this.customerCity.textContent();
  }

  @logStep('Get Customer Street')
  async getCustomerStreet() {
    return await this.customerStreet.textContent();
  }

  @logStep('Get Customer House')
  async getCustomerHouse() {
    return await this.customerHouse.textContent();
  }

  @logStep('Get Customer Flat')
  async getCustomerFlat() {
    return await this.customerFlat.textContent();
  }

  @logStep('Get Customer Phone')
  async getCustomerPhone() {
    return await this.customerPhone.textContent();
  }

  @logStep('Get Customer Created On')
  async getCustomerCreatedOn() {
    return await this.customerCreatedOn.textContent();
  }

  @logStep('Get Customer Notes')
  async getCustomerNotes() {
    return await this.customerNotes.textContent();
  }

  @logStep('Get All Info Of Customer Details')
  async getAllCustomerDetails() {
    const [Email, Name, Country, City, Street, House, Flat, Phone, CreatedOn, Notes] = await Promise.all([
      this.getCustomerEmail(),
      this.getCustomerName(),
      this.getCustomerCountry(),
      this.getCustomerCity(),
      this.getCustomerStreet(),
      this.getCustomerHouse(),
      this.getCustomerFlat(),
      this.getCustomerPhone(),
      this.getCustomerCreatedOn(),
      this.getCustomerNotes(),
    ]);
    return {
      Email,
      Name,
      Country,
      City,
      Street,
      House,
      Flat,
      Phone,
      CreatedOn,
      Notes,
    };
  }
}