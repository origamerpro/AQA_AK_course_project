import { expect, test } from 'fixtures/ordersCustom.fixture';
import {
  MOCK_MANAGER_OLGA,
  MOCK_ORDERS_LIST_API_RESPONSE,
} from 'data/orders/mockOrders.data';
import { TAGS } from 'data/testTags.data';
import { ORDER_STATUS } from 'data/orders/statuses.data';
import { STATUS_CODES } from 'data/statusCodes';

test.describe('[UI] [Orders] [Orders List]', () => {
  test.beforeEach(async ({ homeUIService, ordersPage, mock }) => {
    await homeUIService.openAsLoggedInUser();
    await mock.orders(MOCK_ORDERS_LIST_API_RESPONSE);
    await homeUIService.openModule('Orders');
    await ordersPage.waitForOpened();
  });

  test(
    'Should display correct number of orders in the table',
    { tag: [TAGS.SMOKE, TAGS.UI] },
    async ({ ordersPage }) => {
      await expect(ordersPage.allTableRows).toHaveCount(
        MOCK_ORDERS_LIST_API_RESPONSE.Orders.length,
      );
    },
  );
});

test.describe('[UI] [Orders] [Modals] [Create Order Modal]', () => {
  test.beforeEach(async ({ homeUIService, ordersPage, mock }) => {
    await homeUIService.openAsLoggedInUser();
    await mock.orders(MOCK_ORDERS_LIST_API_RESPONSE, STATUS_CODES.OK);
    await homeUIService.openModule('Orders');
    await ordersPage.waitForOpened();
  });

  test(
    'Should open "Create New Order" modal and display its basic UI',
    { tag: [TAGS.SMOKE, TAGS.UI] },
    async ({ ordersPage, createOrderModal }) => {
      await ordersPage.clickCreateOrderButton();

      await expect(createOrderModal.modalTitle).toBeVisible();
      const title = await createOrderModal.getModalTitle();
      expect(title).toBe(' Create Order');
      await expect(createOrderModal.customersList).toBeVisible();
      await expect(createOrderModal.productsList).toBeVisible();
      await expect(createOrderModal.createButton).toBeVisible();
      await expect(createOrderModal.cancelButton).toBeVisible();
    },
  );
});

test.describe('[UI] [Orders] [Modals] [Reopen Order Modal]', () => {
  let targetOrderId: string;
  test.beforeEach(
    async ({
      homeUIService,
      ordersPage,
      orderDetailsPage,
      orderCanceledStatus,
    }) => {
      const PRODUCTS_TO_CREATE_COUNT = 1;
      const { id } = await orderCanceledStatus(PRODUCTS_TO_CREATE_COUNT);
      targetOrderId = id;
      await homeUIService.openAsLoggedInUser();
      await homeUIService.openModule('Orders');
      await ordersPage.waitForOpened();
      await ordersPage.clickDetailsButton(targetOrderId);
      await orderDetailsPage.topPanel.waitForOpened();
    },
  );

  test(
    'Should open "Reopen Order" modal and display its basic UI',
    { tag: [TAGS.UI] },
    async ({ confirmationModal, orderDetailsPage }) => {
      await orderDetailsPage.topPanel.clickReopenOrderButton();

      await expect(confirmationModal.modalTitle).toBeVisible();
      await expect(confirmationModal.getModalTitle()).resolves.toBe(
        'Reopen Order',
      );
      await expect(confirmationModal.getModalContent()).resolves.toContain(
        'Are you sure you want to reopen the order?',
      );
      await expect(confirmationModal.confirmButton).toBeVisible();
      await confirmationModal.clickConfirmButton();

      await confirmationModal.modalContainer.waitFor({ state: 'hidden' });
      await expect(confirmationModal.modalTitle).not.toBeVisible();

      const updatedOrderStatus =
        await orderDetailsPage.topPanel.getOrderDetailsPanelTitle();
      await expect(updatedOrderStatus).toBe('Order Details');
      const orderDetailsPageStatus =
        await orderDetailsPage.topPanel.getOrderStatus();
      await expect(orderDetailsPageStatus).toBe(ORDER_STATUS.DRAFT);
    },
  );
});

test.describe('[UI] [Orders] [Modals] [Assign Manager Modal]', () => {
  let targetOrderId: string;
  test.beforeEach(
    async ({
      homeUIService,
      ordersPage,
      orderDetailsPage,
      orderDraftStatus,
    }) => {
      const PRODUCTS_TO_CREATE_COUNT = 1;
      const { id } = await orderDraftStatus(PRODUCTS_TO_CREATE_COUNT);
      targetOrderId = id;

      await homeUIService.openAsLoggedInUser();
      await homeUIService.openModule('Orders');
      await ordersPage.waitForOpened();

      await ordersPage.clickDetailsButton(targetOrderId);
      await orderDetailsPage.topPanel.waitForOpened();
    },
  );

  test(
    'Should open "Assign Manager" modal and display its basic UI',
    { tag: [TAGS.UI] },
    async ({ orderDetailsPage, selectManagerModal }) => {
      await orderDetailsPage.topPanel.clickAssignManagerButton();

      await expect(selectManagerModal.modalTitle).toBeVisible();
      await expect(selectManagerModal.getModalTitle()).resolves.toBe(
        'Assign Manager',
      );
      await expect(selectManagerModal.managerSearchInput).toBeVisible();

      await selectManagerModal.fillManagerSearchInput(
        MOCK_MANAGER_OLGA.firstName,
      );

      await expect(
        selectManagerModal.getManagerListItem(
          `${MOCK_MANAGER_OLGA.firstName} ${MOCK_MANAGER_OLGA.lastName}`,
        ),
      ).toBeVisible();

      await selectManagerModal.clickManagerListItem(
        `${MOCK_MANAGER_OLGA.firstName} ${MOCK_MANAGER_OLGA.lastName}`,
      );

      await selectManagerModal.clickSaveButton();

      await expect(selectManagerModal.modalTitle).not.toBeVisible();

      const updatedOrderStatusTitle =
        await orderDetailsPage.topPanel.getOrderDetailsPanelTitle();
      await expect(updatedOrderStatusTitle).toBe(`Order Details`);
      const assignedManagerName =
        await orderDetailsPage.topPanel.getAssignedManagerName();
      await expect(assignedManagerName).toBe(
        `${MOCK_MANAGER_OLGA.firstName} ${MOCK_MANAGER_OLGA.lastName}`,
      );
    },
  );
});
test.describe('[UI] [Orders] [Modals] [Remove Manager Modal]', () => {
  let targetOrderId: string;
  test.beforeEach(
    async ({
      homeUIService,
      ordersPage,
      orderDetailsPage,
      orderManagerAssignedStatus,
    }) => {
      const PRODUCTS_TO_CREATE_COUNT = 1;
      const { id } = await orderManagerAssignedStatus(PRODUCTS_TO_CREATE_COUNT);
      targetOrderId = id;

      await homeUIService.openAsLoggedInUser();
      await homeUIService.openModule('Orders');
      await ordersPage.waitForOpened();

      await ordersPage.clickDetailsButton(targetOrderId);
      await orderDetailsPage.topPanel.waitForOpened();
    },
  );

  test(
    'Should open "Remove Manager" modal and display its basic UI',
    { tag: [TAGS.UI] },
    async ({ confirmationModal, orderDetailsPage }) => {
      await orderDetailsPage.topPanel.clickRemoveAssignedManagerButton();

      await expect(confirmationModal.modalTitle).toBeVisible();
      const modalTitle = await confirmationModal.getModalTitle();
      await expect(modalTitle).toBe('Unassign Manager');
      const modalContent = await confirmationModal.getModalContent();
      await expect(modalContent).toContain(
        'Are you sure you want to unassign manager from order?',
      );
      await expect(confirmationModal.confirmButton).toBeVisible();

      await confirmationModal.clickConfirmButton();

      await confirmationModal.modalContainer.waitFor({ state: 'hidden' });
      await expect(confirmationModal.modalTitle).not.toBeVisible();

      const updatedOrderStatusTitle =
        await orderDetailsPage.topPanel.getOrderDetailsPanelTitle();
      await expect(updatedOrderStatusTitle).toBe(`Order Details`);
      await expect(orderDetailsPage.topPanel.assignManagerButton).toBeVisible();
    },
  );
});
