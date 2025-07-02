import { SalesPortalPage } from 'ui/pages/salesPortal.page';
import { OrderDetailsPanelComponent } from './components/orderDetailsPanelComponent.page';
import { OrderDetailsReceivedProductsSection } from './components/orderDetailsReceivedProducts.page';
import { OrderCommentsTab } from './components/orderDetailsCommentsComponent.page';
import { OrderCustomerDetailsComponentPage} from './components/orderCustomerDetailsComponent.page';

export class OrderDetailsPage extends SalesPortalPage {
  topPanel = new OrderDetailsPanelComponent(this.page);
  receivedProductsSection = new OrderDetailsReceivedProductsSection(this.page);
  commentsSection = new OrderCommentsTab(this.page);
  customerDetailsSection = new OrderCustomerDetailsComponentPage(this.page);
}
