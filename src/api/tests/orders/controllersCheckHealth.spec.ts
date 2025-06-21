import { OrdersAPIController } from 'api/controllers/orders.controller';
import { generateDeliveryData } from 'data/orders/generateDeliveryData.data';
import { ORDER_STATUS } from 'data/orders/statuses.data';
import { TAGS } from 'data/testTags.data';
import { expect, test } from 'fixtures/api-services.fixture';
import { STATUS_CODES } from 'data/statusCodes';

test.describe('[API] Orders Controller Health Checks', () => {
  let token: string;
  let ordersAPIController: OrdersAPIController;

  let createdOrderId: string = '';
  let createdCustomerId: string = '';
  let createdProductIds: string[] = [];

  const createdManagerId: string = '680d4d7dd006ba3d475ff67b';

  test.beforeEach(
    async ({
      customersApiService,
      productsApiService,
      request,
      signInApiService,
    }) => {
      ordersAPIController = new OrdersAPIController(request);
      token = await signInApiService.loginAsLocalUser();

      const customerResponse = await customersApiService.createCustomer(token);
      createdCustomerId = customerResponse._id;

      const productsResponse = await productsApiService.populate(1, token);
      createdProductIds = productsResponse.map((p) => p._id);

      const orderData = {
        customer: createdCustomerId,
        products: createdProductIds,
      };

      const createOrderResponse = await ordersAPIController.create(
        orderData,
        token,
      );

      expect(createOrderResponse.status).toBe(STATUS_CODES.CREATED);
      expect(createOrderResponse.body.IsSuccess).toBeTruthy();
      expect(createOrderResponse.body.Order).toBeDefined();
      createdOrderId = createOrderResponse.body.Order._id;
    },
  );

  test.afterEach(async ({ dataDisposalUtils }) => {
    await dataDisposalUtils.clearOrders(createdOrderId);
    await dataDisposalUtils.clearProducts(createdProductIds);
    await dataDisposalUtils.clearCustomers(createdCustomerId);
    createdOrderId = '';
    createdCustomerId = '';
    createdProductIds.length = 0;
  });

  test(
    'Should get 200 OK from GET /filtered and sorted list of orders via API',
    { tag: [TAGS.API, TAGS.ORDERS] },
    async () => {
      const response = await ordersAPIController.getFilteredOrders(token);
      expect(response.status).toBe(STATUS_CODES.OK);
      expect(response.body.IsSuccess).toBe(true);
      expect(Array.isArray(response.body.Orders)).toBe(true);
    },
  );

  test(
    'Should get 200 OK from GET /order by ID via API',
    { tag: [TAGS.API, TAGS.ORDERS] },
    async () => {
      const response = await ordersAPIController.getByID(createdOrderId, token);
      expect(response.status).toBe(STATUS_CODES.OK);
      expect(response.body.IsSuccess).toBe(true);
      expect(response.body.Order).toBeDefined();
      expect(response.body.Order._id).toBe(createdOrderId);
    },
  );

  test(
    'Should get 200 OK from PUT /order by ID via API',
    { tag: [TAGS.API, TAGS.ORDERS] },
    async () => {
      const updatedData = {
        customer: createdCustomerId,
        products: createdProductIds,
        status: ORDER_STATUS.DRAFT,
      };
      const response = await ordersAPIController.updateOrder(
        createdOrderId,
        updatedData,
        token,
      );
      expect(response.status).toBe(STATUS_CODES.OK);
      expect(response.body.IsSuccess).toBe(true);
      expect(response.body.Order).toBeDefined();
      expect(response.body.Order._id).toBe(createdOrderId);
    },
  );

  test(
    'Should get 200 OK from PUT /assign manager to order',
    { tag: [TAGS.API, TAGS.ORDERS] },
    async () => {
      const response = await ordersAPIController.assignManager(
        createdOrderId,
        createdManagerId,
        token,
      );
      expect(response.status).toBe(STATUS_CODES.OK);
      expect(response.body.IsSuccess).toBe(true);
      expect(response.body.Order).toBeDefined();
      expect(response.body.Order._id).toBe(createdOrderId);
      expect(response.body.Order.assignedManager?._id).toBe(createdManagerId);
    },
  );

  test(
    'Should get 200 OK from PUT /unassign manager from order',
    { tag: [TAGS.API, TAGS.ORDERS] },
    async () => {
      const response = await ordersAPIController.unassignManager(
        createdOrderId,
        token,
      );
      expect(response.status).toBe(STATUS_CODES.OK);
      expect(response.body.IsSuccess).toBe(true);
      expect(response.body.Order).toBeDefined();
      expect(response.body.Order._id).toBe(createdOrderId);
      expect(response.body.Order.assignedManager).toBeNull();
    },
  );

  test(
    'Should get 200 OK from POST /order comment via API',
    { tag: [TAGS.API, TAGS.ORDERS] },
    async () => {
      const commentText = 'Комментарий Health Check';
      const response = await ordersAPIController.addComment(
        createdOrderId,
        commentText,
        token,
      );
      expect(response.status).toBe(STATUS_CODES.OK);
      expect(response.body.IsSuccess).toBe(true);
      expect(response.body.Order).toBeDefined();
      expect(response.body.Order.comments).toBeDefined();
      expect(response.body.Order.comments.length).toBeGreaterThan(0);
    },
  );

  test(
    'Should get 200 OK from PUT /order delivery via API',
    { tag: [TAGS.API, TAGS.ORDERS] },
    async () => {
      const deliveryData = generateDeliveryData();
      const response = await ordersAPIController.updateDelivery(
        createdOrderId,
        deliveryData,
        token,
      );
      expect(response.status).toBe(STATUS_CODES.OK);
      expect(response.body.IsSuccess).toBe(true);
      expect(response.body.Order).toBeDefined();
      expect(response.body.Order._id).toBe(createdOrderId);
      expect(response.body.Order.delivery).toBeDefined();
      expect(response.body.Order.delivery?.finalDate).toBe(
        `${deliveryData.finalDate}T00:00:00.000Z`,
      );
    },
  );

  test(
    'Should get 200 OK from PUT /order receive via API',
    { tag: [TAGS.API, TAGS.ORDERS] },
    async () => {
      const productsToReceive = [createdProductIds[0]];
      await ordersAPIController.updateDelivery(
        createdOrderId,
        generateDeliveryData(),
        token,
      );
      await ordersAPIController.updateStatus(
        createdOrderId,
        ORDER_STATUS.IN_PROCESS,
        token,
      );
      const response = await ordersAPIController.receiveProducts(
        createdOrderId,
        productsToReceive,
        token,
      );
      expect(response.status).toBe(STATUS_CODES.OK);
      expect(response.body.IsSuccess).toBe(true);
      expect(response.body.Order).toBeDefined();
      expect(response.body.Order._id).toBe(createdOrderId);
    },
  );

  test(
    'Should get 200 OK from PUT /order status via API',
    { tag: [TAGS.API, TAGS.ORDERS] },
    async () => {
      const newStatus = ORDER_STATUS.IN_PROCESS;
      await ordersAPIController.updateDelivery(
        createdOrderId,
        generateDeliveryData(),
        token,
      );
      const response = await ordersAPIController.updateStatus(
        createdOrderId,
        newStatus,
        token,
      );
      expect(response.status).toBe(STATUS_CODES.OK);
      expect(response.body.IsSuccess).toBe(true);
      expect(response.body.Order).toBeDefined();
      expect(response.body.Order._id).toBe(createdOrderId);
      expect(response.body.Order.status).toBe(newStatus);
    },
  );

  test(
    'Should get 204 from DELETE /order comment via API',
    { tag: [TAGS.API, TAGS.ORDERS] },
    async () => {
      const commentResponse = await ordersAPIController.addComment(
        createdOrderId,
        'New comment for health check',
        token,
      );
      expect(commentResponse.status).toBe(STATUS_CODES.OK);
      const tempCommentId =
        commentResponse.body.Order.comments[
          commentResponse.body.Order.comments.length - 1
        ]._id;
      expect(tempCommentId).toBeDefined();

      const response = await ordersAPIController.deleteComment(
        createdOrderId,
        tempCommentId,
        token,
      );
      expect(response.status).toBe(STATUS_CODES.DELETED);
    },
  );

  test(
    'Should get 204 from DELETE /order via API',
    { tag: [TAGS.API, TAGS.ORDERS] },
    async () => {
      const response = await ordersAPIController.delete(createdOrderId, token);

      createdOrderId = '';
      console.log(`Deleted order id: ${createdOrderId}`);
      expect(response.status).toBe(STATUS_CODES.DELETED);
    },
  );

  test.skip(
    'Should delete orders via API (clean if needed)',
    { tag: [TAGS.API, TAGS.ORDERS] },
    async () => {
      const id = ['68572d641c508c5d5e5d3221'];
      id.forEach(async (id) => {
        const response = await ordersAPIController.delete(id, token);
        expect(response.status).toBe(STATUS_CODES.DELETED);
      });
    },
  );
});
