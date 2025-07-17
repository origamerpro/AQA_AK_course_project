import { PageHolder } from 'ui/pages/pageHolder.page';
import { logStep } from 'utils/reporter.utils';

export class OrderHistoryTab extends PageHolder {
  readonly tabPane = this.page.locator('#history');
  readonly title = this.page.getByRole('heading', {
    name: 'Order History',
  });
  readonly historyHeader = this.page.locator('.his-header.py-3.fs-5');
  readonly historyHeaderAction =
    this.historyHeader.locator('span:nth-child(2)');
  readonly historyHeaderPerformedBy =
    this.historyHeader.locator('span:nth-child(3)');
  readonly historyHeaderDateTime =
    this.historyHeader.locator('span:nth-child(4)');
  readonly historyDetailsbody = this.page.locator('#history-body');
  readonly allorderAccordions = this.historyDetailsbody.locator('.accordion');
  readonly allorderAccordionsHeaders =
    this.historyDetailsbody.locator('.accordion-header');
  readonly historyAccordionButton = this.historyDetailsbody.locator(
    'button.accordion-button',
  );
  readonly historyAccordionOrderStatus = this.allorderAccordionsHeaders.locator(
    '.his-col:nth-child(2)',
  );
  readonly historyAccordionPerformedBy = this.allorderAccordionsHeaders.locator(
    '.his-col:nth-child(3)',
  );
  readonly historyAccordionOrderDateTime =
    this.allorderAccordionsHeaders.locator('.his-col:nth-child(4)');
  readonly historyOrderdetailspanel = this.historyDetailsbody.locator(
    '.accordion-collapse .mb-3',
  );
  readonly historyOrderdetailspanelStrings =
    this.historyOrderdetailspanel.locator('.d-flex');
  readonly historyOrderdetailspanelPreviousText =
    this.historyOrderdetailspanelStrings.locator('.fw-bold:nth-child(3)');
  readonly historyOrderdetailspanelUpdatedText =
    this.historyOrderdetailspanelStrings.locator('.fw-bold:nth-child(4)');
  readonly historyOrderdetailspanelActionDetails =
    this.historyOrderdetailspanelStrings.locator('.his-nested-row');
  readonly historyOrderdetailspanelActionDetailsPrevious =
    this.historyOrderdetailspanelActionDetails.locator('+ .his-col');
  readonly historyOrderdetailspanelActionDetailsUpdated =
    this.historyOrderdetailspanelActionDetailsPrevious.locator('+ .his-col');

  readonly uniqueElement = this.page.locator('#history-tab');

  @logStep('Get Order History title')
  async getOrderHistoryTitle() {
    return await this.title.textContent();
  }
  @logStep('Get Order History Details Header')
  async getOrderHistoryDetailsHeader() {
    return await this.historyHeader.textContent();
  }
}
