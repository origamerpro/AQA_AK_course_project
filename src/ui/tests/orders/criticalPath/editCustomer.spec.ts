import { expect, test } from 'fixtures/ordersCustom.fixture';
import { TAGS } from 'data/testTags.data';
import { OrderSetupService, OrderSetupStatus } from 'ui/services/order.ui-services';

test.describe('[UI] [Orders] [Customer]', () => {
  test.describe('[Positive]', () => {
    let targetOrderId: string;
    let initialCustomerNameInOrder: string | null;
    let token: string;

    test.beforeEach(async ({ homeUIService, ordersPage, orderDetailsPage, orderDraftStatus, page }) => {
      const PRODUCTS_TO_CREATE_COUNT = 1;
      const { id } = await orderDraftStatus(PRODUCTS_TO_CREATE_COUNT);
      targetOrderId = id;

      await homeUIService.openAsLoggedInUser();
      token = (await page.context().cookies()).find((c) => c.name === 'Authorization')!.value;
      await homeUIService.openModule('Orders');
      await ordersPage.waitForOpened();

      await ordersPage.clickDetailsButton(targetOrderId);
      await orderDetailsPage.topPanel.waitForOpened();

      initialCustomerNameInOrder = await orderDetailsPage.customerDetailsSection.getCustomerName();
      await expect(initialCustomerNameInOrder).toBeTruthy();
    });

    test(
      'Should open edit customer modal and show current customer in the list as default',
      { tag: [TAGS.UI] },
      async ({ orderDetailsPage, editCustomerModalPage }) => {
        await expect(orderDetailsPage.customerDetailsSection.editCustomerButton).toBeVisible();
        await expect(orderDetailsPage.customerDetailsSection.editCustomerButton).toBeEnabled();

        await orderDetailsPage.customerDetailsSection.clickEditCustomerButton();

        await expect(editCustomerModalPage.uniqueElement).toBeVisible();
        const modalTitle = await editCustomerModalPage.getModalTitle();
        await expect(modalTitle).toBe('Edit Customer');
        await expect(editCustomerModalPage.customersList).toBeVisible();
        await expect(editCustomerModalPage.saveButton).toBeVisible();
        await expect(editCustomerModalPage.cancelButton).toBeVisible();
        await expect(editCustomerModalPage.closeButton).toBeVisible();

        const selectedCustomerInModal = await editCustomerModalPage.customersList.inputValue();
        await expect(selectedCustomerInModal).toBe(initialCustomerNameInOrder);

        await editCustomerModalPage.clickCloseButton();
        await editCustomerModalPage.waitForClosed;
      },
    );

    test('Should change customer and save changes', { tag: [TAGS.UI] }, async ({ orderDetailsPage, editCustomerModalPage, customersApiService }) => {
      const CUSTOMER_TO_CHANGE_TO_NAME = (await customersApiService.createCustomer(token)).name;
      await orderDetailsPage.customerDetailsSection.clickEditCustomerButton();
      await expect(editCustomerModalPage.uniqueElement).toBeVisible();

      await editCustomerModalPage.selectCustomer(CUSTOMER_TO_CHANGE_TO_NAME);

      await editCustomerModalPage.clickSaveButton();

      await editCustomerModalPage.waitForClosed();

      const updatedCustomerName = await orderDetailsPage.customerDetailsSection.getCustomerName();
      await expect(updatedCustomerName).toBe(CUSTOMER_TO_CHANGE_TO_NAME);
    });

    test(
      'Should change customer and cancel changes without saving',
      { tag: [TAGS.UI] },
      async ({ orderDetailsPage, editCustomerModalPage, customersApiService }) => {
        const CUSTOMER_TO_CHANGE_TO_NAME = (await customersApiService.createCustomer(token)).name;
        await orderDetailsPage.customerDetailsSection.clickEditCustomerButton();
        await expect(editCustomerModalPage.uniqueElement).toBeVisible();

        await editCustomerModalPage.selectCustomer(CUSTOMER_TO_CHANGE_TO_NAME);

        await editCustomerModalPage.clickCancelButton();

        await editCustomerModalPage.waitForClosed();

        const originalCustomerName = await orderDetailsPage.customerDetailsSection.getCustomerName();
        await expect(originalCustomerName).toBe(initialCustomerNameInOrder);
      },
    );
  });

  test.describe('[Negative]', () => {
    let targetOrderId: string;

    test.beforeEach(async ({ homeUIService, ordersPage, orderDetailsPage, orderCanceledStatus }) => {
      const PRODUCTS_TO_CREATE_COUNT = 1;

      const { id } = await orderCanceledStatus(PRODUCTS_TO_CREATE_COUNT);
      targetOrderId = id;

      await homeUIService.openAsLoggedInUser();
      await homeUIService.openModule('Orders');
      await ordersPage.waitForOpened();

      await ordersPage.clickDetailsButton(targetOrderId);
      await orderDetailsPage.topPanel.waitForOpened();
    });

    test('Should not open edit customer modal for canceled order', { tag: [TAGS.UI] }, async ({ orderDetailsPage }) => {
      const editButton = orderDetailsPage.customerDetailsSection.editCustomerButton;

      await expect(editButton).not.toBeVisible();
    });

    test('Should not open edit customer modal for In progress order', { tag: [TAGS.UI] }, async ({ orderDetailsPage }) => {
      const editButton = orderDetailsPage.customerDetailsSection.editCustomerButton;

      await expect(editButton).not.toBeVisible();
    });
  });

  test.describe('[UI] [Orders] Тесты с динамическим созданием заказов', () => {
    //targetOrderId: string;
    let orderSetupService: OrderSetupService;

    test.beforeEach(
      async ({
        page,
        orderInProcessStatus,
        orderDraftStatus,
        orderDraftWithDeliveryStatus,
        orderCanceledStatus,
        orderPartiallyReceivedStatus,
        orderReceivedStatus,
      }) => {
        const allOrderFixtures = {
          orderInProcessStatus,
          orderDraftStatus,
          orderDraftWithDeliveryStatus,
          orderCanceledStatus,
          orderPartiallyReceivedStatus,
          orderReceivedStatus,
        };

        orderSetupService = new OrderSetupService(page, allOrderFixtures);
        const targetOrderId = await orderSetupService.createOrderAndNavigateToDetails(OrderSetupStatus.CANCELED);
        console.log('targetOrderId', targetOrderId);
      },
    );

    test('Should not open edit customer modal for CANCELED order', { tag: [TAGS.UI] }, async ({ orderDetailsPage }) => {
      await orderSetupService.createOrderAndNavigateToDetails(OrderSetupStatus.CANCELED);

      const editButton = orderDetailsPage.customerDetailsSection.editCustomerButton;

      await expect(editButton).not.toBeVisible();
    });

    test('Should not open edit customer modal for PARTIALLY_RECEIVED order', { tag: [TAGS.UI] }, async ({ orderDetailsPage }) => {
      await orderSetupService.createOrderAndNavigateToDetails(OrderSetupStatus.PARTIALLY_RECEIVED, 2, 1);

      const editButton = orderDetailsPage.customerDetailsSection.editCustomerButton;

      await expect(editButton).not.toBeVisible();
    });

    test('Should not open edit customer modal for RECEIVED order', { tag: [TAGS.UI] }, async ({ orderDetailsPage }) => {
      await orderSetupService.createOrderAndNavigateToDetails(OrderSetupStatus.RECEIVED);

      const editButton = orderDetailsPage.customerDetailsSection.editCustomerButton;

      await expect(editButton).not.toBeVisible();
    });
  });
});
