import { PageHolder } from 'ui/pages/pageHolder.page';

export abstract class OrderTab extends PageHolder {
  readonly tabContainer = this.page.locator('#order-details-tabs-content');
  readonly title = this.tabContainer.locator('h4');
}
