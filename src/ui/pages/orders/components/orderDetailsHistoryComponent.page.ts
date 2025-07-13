import { PageHolder } from 'ui/pages/pageHolder.page';
import { logStep } from 'utils/reporter.utils';

export class OrderHistoryTab extends PageHolder {
    readonly tabPane = this.page.locator('#history')
    readonly title = this.page.getByRole('heading', {
    name: 'Order History',
  });
    readonly historyHeader = this.page.locator('.his-header.py-3.fs-5')
    readonly spanAction = this.historyHeader.locator('span:nth-child(2)')
    readonly spanPerformedBy = this.historyHeader.locator('span:nth-child(3)')
    readonly spanDateTime = this.historyHeader.locator('span:nth-child(4)')
    readonly historyDetails = this.page.locator('#history-body')
    readonly recievedHistoryDetails = this.historyDetails.locator('div:nth-child(1)')
    readonly processingHistoryDetails = this.historyDetails.locator('div:nth-child(2)')
    readonly deliveryHistoryDetails = this.historyDetails.locator('div:nth-child(3)')
    readonly createdHistoryDetails = this.historyDetails.locator('div:nth-child(4)')

    readonly uniqueElement = this.historyDetails.locator('#history-tab');
}