import { OrderDetailsPage } from 'ui/pages/orders/orderDetails.page';
import { OrdersPage } from 'ui/pages/orders/orders.page';
import { logStep } from 'utils/reporter.utils';
import { BaseUIService } from './base.ui-service';
import { HomeUIService } from './home.ui-service';
import { ICreateOrderData, ICustomOrder as OrderCreationFixtures } from 'fixtures/ordersCustom.fixture';
import { Page } from '@playwright/test';

export enum OrderSetupStatus {
  IN_PROCESS = 'IN_PROCESS',
  DRAFT = 'DRAFT',
  DRAFT_WITH_DELIVERY = 'DRAFT_WITH_DELIVERY',
  CANCELED = 'CANCELED',
  PARTIALLY_RECEIVED = 'PARTIALLY_RECEIVED',
  RECEIVED = 'RECEIVED',
}

export class OrderSetupService extends BaseUIService {
  readonly homeUIService = new HomeUIService(this.page);
  readonly ordersPage = new OrdersPage(this.page);
  readonly orderDetailsPage = new OrderDetailsPage(this.page);
  private orderFixtures: OrderCreationFixtures;

  constructor(page: Page, orderFixtures: OrderCreationFixtures) {
    super(page);
    this.orderFixtures = orderFixtures;
  }
  // Хранилище функций-фикстур

  @logStep('Create order and navigate to details')
  async createOrderAndNavigateToDetails(status: OrderSetupStatus, productsCount: number = 1, receivedCount?: number): Promise<string> {
    let orderCreationFn: (count?: number, receivedCount?: number) => Promise<ICreateOrderData>;

    switch (status) {
      case OrderSetupStatus.IN_PROCESS:
        orderCreationFn = this.orderFixtures.orderInProcessStatus;
        break;
      case OrderSetupStatus.DRAFT:
        orderCreationFn = this.orderFixtures.orderDraftStatus;
        break;
      case OrderSetupStatus.DRAFT_WITH_DELIVERY:
        orderCreationFn = this.orderFixtures.orderDraftWithDeliveryStatus;
        break;
      case OrderSetupStatus.CANCELED:
        orderCreationFn = this.orderFixtures.orderCanceledStatus;
        break;
      case OrderSetupStatus.PARTIALLY_RECEIVED:
        orderCreationFn = (count, recCount) => this.orderFixtures.orderPartiallyReceivedStatus(count, recCount);
        break;
      case OrderSetupStatus.RECEIVED:
        orderCreationFn = this.orderFixtures.orderReceivedStatus;
        break;

      default:
        throw new Error(`Unknown status: ${status}`);
    }

    const { id } = await orderCreationFn(productsCount, receivedCount);
    const targetOrderId = id;

    await this.homeUIService.openAsLoggedInUser();
    await this.homeUIService.openModule('Orders');
    await this.ordersPage.waitForOpened();

    await this.ordersPage.clickDetailsButton(targetOrderId);
    await this.orderDetailsPage.topPanel.waitForOpened();

    return targetOrderId;
  }
}
