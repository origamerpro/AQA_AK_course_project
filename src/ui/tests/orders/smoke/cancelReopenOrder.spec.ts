import { ORDER_STATUS } from 'data/orders/statuses.data';
import { TAGS } from 'data/testTags.data';
import {
  expect,
  orderCanceledStatus,
  orderDraftStatus,
  orderDraftWithDeliveryStatus,
  orderInProcessStatus,
  test,
} from 'fixtures/ordersCustom.fixture';

test.describe('[UI] [Orders] Order Status Changes', () => {
  test.beforeEach(async ({ signInApiService, homeUIService }) => {
    await signInApiService.loginAsLocalUser();
    await homeUIService.openAsLoggedInUser();
  });

  test.describe('Cancel/Reopen order', () => {
    orderInProcessStatus(
      'Should cancel in-process order',
      { tag: [TAGS.ORDERS, TAGS.SMOKE] },
      async ({
        orderInProcessStatus,
        ordersPage,
        orderDetailsPage,
        confirmationModal,
        homeUIService,
      }) => {
        // Создаем заказ через API
        const order = await orderInProcessStatus();
        await homeUIService.openModule('Orders');
        await orderDetailsPage.waitForOpened();
        // Ищем и открываем заказ
        await ordersPage.clickDetailsButton(order.id);
        await orderDetailsPage.waitForOpened();

        // Отменяем заказ
        await orderDetailsPage.topPanel.clickCancelOrderButton();
        await orderDetailsPage.waitForSpinner();
        await confirmationModal.clickConfirmButton();
        await orderDetailsPage.waitForSpinner();

        // Проверяем результат
        const updatedStatus = await orderDetailsPage.topPanel.getOrderStatus();
        await expect(updatedStatus).toBe(ORDER_STATUS.CANCELED);
        await expect(orderDetailsPage.topPanel.reopenOrderButton).toBeVisible();
      },
    );

    orderDraftStatus(
      'Should cancel draft order',
      { tag: [TAGS.ORDERS, TAGS.SMOKE] },
      async ({
        orderDraftStatus,
        ordersPage,
        orderDetailsPage,
        confirmationModal,
        homeUIService,
      }) => {
        // Создаем заказ через API
        const order = await orderDraftStatus();
        await homeUIService.openModule('Orders');
        await orderDetailsPage.waitForOpened();
        // Ищем и открываем заказ
        await ordersPage.clickDetailsButton(order.id);
        await orderDetailsPage.waitForOpened();

        // Отменяем заказ
        await orderDetailsPage.topPanel.clickCancelOrderButton();
        await orderDetailsPage.waitForSpinner();
        await confirmationModal.clickConfirmButton();
        await orderDetailsPage.waitForSpinner();

        // Проверяем результат
        const updatedStatus = await orderDetailsPage.topPanel.getOrderStatus();
        await expect(updatedStatus).toBe(ORDER_STATUS.CANCELED);
        await expect(orderDetailsPage.topPanel.reopenOrderButton).toBeVisible();
      },
    );

    orderDraftWithDeliveryStatus(
      'Should cancel draft with delivery order',
      { tag: [TAGS.ORDERS, TAGS.SMOKE] },
      async ({
        orderDraftWithDeliveryStatus,
        ordersPage,
        orderDetailsPage,
        confirmationModal,
        homeUIService,
      }) => {
        // Создаем заказ через API
        const order = await orderDraftWithDeliveryStatus();
        await homeUIService.openModule('Orders');
        await orderDetailsPage.waitForOpened();
        // Ищем и открываем заказ
        await ordersPage.clickDetailsButton(order.id);
        await orderDetailsPage.waitForOpened();

        // Отменяем заказ
        await orderDetailsPage.topPanel.clickCancelOrderButton();
        await orderDetailsPage.waitForSpinner();
        await confirmationModal.clickConfirmButton();
        await orderDetailsPage.waitForSpinner();

        // Проверяем результат
        const updatedStatus = await orderDetailsPage.topPanel.getOrderStatus();
        await expect(updatedStatus).toBe(ORDER_STATUS.CANCELED);
        await expect(orderDetailsPage.topPanel.reopenOrderButton).toBeVisible();
      },
    );

    orderCanceledStatus(
      'Should reopen canceled order',
      { tag: [TAGS.ORDERS, TAGS.SMOKE] },
      async ({
        orderCanceledStatus,
        ordersPage,
        orderDetailsPage,
        confirmationModal,
        homeUIService,
      }) => {
        // Создаем заказ через API
        const order = await orderCanceledStatus();
        await homeUIService.openModule('Orders');
        await orderDetailsPage.waitForOpened();
        // Ищем и открываем заказ
        await ordersPage.clickDetailsButton(order.id);
        await orderDetailsPage.waitForOpened();

        // Отменяем заказ
        await orderDetailsPage.topPanel.clickReopenOrderButton();
        await orderDetailsPage.waitForSpinner();
        await confirmationModal.clickConfirmButton();
        await orderDetailsPage.waitForSpinner();

        // Проверяем результат
        const updatedStatus = await orderDetailsPage.topPanel.getOrderStatus();
        await expect(updatedStatus).toBe(ORDER_STATUS.DRAFT);
        await expect(orderDetailsPage.topPanel.cancelOrderButton).toBeVisible();
      },
    );
  });
});
