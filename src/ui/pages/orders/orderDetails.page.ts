import { SalesPortalPage } from 'ui/pages/salesPortal.page';
import { OrderDetailsPanelComponent } from './components/orderDetailsPanelComponent.page';
import { OrderDetailsReceivedProductsSection } from './components/orderDetailsReceivedProducts.page';
import { OrderCommentsTab } from './components/orderDetailsCommentsComponent.page';
import { EditOrderModal } from '../modals/orders/editOrderModal.page';

export class OrderDetailsPage extends SalesPortalPage {
  topPanel = new OrderDetailsPanelComponent(this.page);
  receivedProductsSection = new OrderDetailsReceivedProductsSection(this.page);
  commentsSection = new OrderCommentsTab(this.page);
  editOrderModal = new EditOrderModal(this.page);
}
