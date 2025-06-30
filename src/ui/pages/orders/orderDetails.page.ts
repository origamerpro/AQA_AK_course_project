import { SalesPortalPage } from 'ui/pages/salesPortal.page';
import { OrderDetailsPanelComponent } from './components/orderDetailsPanelComponent.page';
import { OrderDetailsReceivedProductsSection } from './components/orderDetailsReceivedProducts.page';

export class OrderDetailsPage extends SalesPortalPage {
  topPanel = new OrderDetailsPanelComponent(this.page);
  receivedProductsSection = new OrderDetailsReceivedProductsSection(this.page);
}
