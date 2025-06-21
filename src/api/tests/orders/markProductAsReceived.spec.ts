import { test, expect } from 'fixtures/api-services.fixture';
import { STATUS_CODES } from 'data/statusCodes';
import { TAGS } from 'data/testTags.data';
import { orderSchema } from 'data/schemas/order.schema';
import { validateSchema } from 'utils/validations/schemaValidation';
import { validateResponse } from 'utils/validations/responseValidation';
import { ORDER_STATUS } from 'data/orders/statuses.data';
import { ERROR_MESSAGES } from 'data/errorMessages';
import { ObjectId } from 'bson';

test.describe('[API][Orders] Products Receipt', () => {
  let token = '';
  let fullReceiptOrderId = '';
  let partialReceiptOrderId = '';
  let draftOrderId = '';
  let canceledOrderId = '';
  let fullReceiptProductIds: string[] = [];
  let partialReceiptProductIds: string[] = [];
  let draftOrderProductIds: string[] = [];
  let canceledOrderProductIds: string[] = [];
  let customerIds: string[] = [];
  let productIds: string[] = [];

  test.beforeAll(async ({ signInApiService, ordersApiService }) => {
    token = await signInApiService.loginAsLocalUser();

    const [fullReceiptOrder, partialReceiptOrder, draftOrder, canceledOrder] =
      await Promise.all([
        ordersApiService.createInProcessOrder(1, token),
        ordersApiService.createInProcessOrder(2, token),
        ordersApiService.createDraftOrder(1, token),
        ordersApiService.createCanceledOrder(1, token),
      ]);

    fullReceiptOrderId = fullReceiptOrder._id;
    partialReceiptOrderId = partialReceiptOrder._id;
    draftOrderId = draftOrder._id;
    canceledOrderId = canceledOrder._id;

    fullReceiptProductIds = fullReceiptOrder.products.map((p) => p._id);
    partialReceiptProductIds = partialReceiptOrder.products.map((p) => p._id);
    draftOrderProductIds = draftOrder.products.map((p) => p._id);
    canceledOrderProductIds = canceledOrder.products.map((p) => p._id);

    const [
      fullOrderDetails,
      partialOrderDetails,
      draftOrderDetails,
      canceledOrderDetails,
    ] = await Promise.all([
      ordersApiService.getOrderByID(fullReceiptOrderId, token),
      ordersApiService.getOrderByID(partialReceiptOrderId, token),
      ordersApiService.getOrderByID(draftOrderId, token),
      ordersApiService.getOrderByID(canceledOrderId, token),
    ]);

    customerIds = [
      fullOrderDetails.customer._id,
      partialOrderDetails.customer._id,
      draftOrderDetails.customer._id,
      canceledOrderDetails.customer._id,
    ];

    productIds = [
      ...fullReceiptProductIds,
      ...partialReceiptProductIds,
      ...draftOrderProductIds,
      ...canceledOrderProductIds,
    ];
  });

  test.afterAll(
    async ({ ordersApiService, customersApiService, productsApiService }) => {
      const deletePromises = [
        fullReceiptOrderId,
        partialReceiptOrderId,
        draftOrderId,
        canceledOrderId,
      ]
        .filter(Boolean)
        .map((id) => ordersApiService.deleteOrder(id, token));

      await Promise.all(deletePromises);

      const customerDeletePromises = customerIds.map((id) =>
        customersApiService.deleteCustomer(id, token),
      );
      await Promise.all(customerDeletePromises);

      const productDeletePromises = productIds.map((id) =>
        productsApiService.delete(id, token),
      );
      await Promise.all(productDeletePromises);
    },
  );

  test.describe('Positive cases', () => {
    test(
      'Should successfully mark all products as received - 200 OK',
      { tag: [TAGS.API, TAGS.ORDERS, TAGS.SMOKE] },
      async ({ ordersController }) => {
        const response = await ordersController.receiveProducts(
          fullReceiptOrderId,
          fullReceiptProductIds,
          token,
        );

        validateResponse(response, STATUS_CODES.OK, true, null);

        const updatedOrder = response.body.Order;
        validateSchema(orderSchema, updatedOrder);

        expect(updatedOrder._id).toBe(fullReceiptOrderId);
        expect(updatedOrder.status).toBe(ORDER_STATUS.RECEIVED);

        updatedOrder.products.forEach((product) => {
          expect(product).toEqual(
            expect.objectContaining({
              _id: expect.any(String),
              received: true,
            }),
          );
        });

        const receiveEntry = updatedOrder.history?.find(
          (entry) => entry.action === 'All products received',
        );
        expect(receiveEntry).toBeDefined();
      },
    );

    test(
      'Should successfully mark one product as received - Partial Receipt',
      { tag: [TAGS.API, TAGS.ORDERS, TAGS.REGRESSION] },
      async ({ ordersController }) => {
        const partialResponse = await ordersController.receiveProducts(
          partialReceiptOrderId,
          [partialReceiptProductIds[0]],
          token,
        );

        validateResponse(partialResponse, STATUS_CODES.OK, true, null);

        const partiallyUpdatedOrder = partialResponse.body.Order;
        validateSchema(orderSchema, partiallyUpdatedOrder);

        expect(partiallyUpdatedOrder._id).toBe(partialReceiptOrderId);
        expect(partiallyUpdatedOrder.status).toBe(
          ORDER_STATUS.PARTIALLY_RECEIVED,
        );

        const receivedProduct = partiallyUpdatedOrder.products.find(
          (p) => p._id === partialReceiptProductIds[0],
        );
        expect(receivedProduct?.received).toBe(true);

        const notReceivedProduct = partiallyUpdatedOrder.products.find(
          (p) => p._id === partialReceiptProductIds[1],
        );
        expect(notReceivedProduct?.received).toBe(false);

        const partialHistoryEntry = partiallyUpdatedOrder.history.find(
          (entry) => entry.action === 'Received',
        );
        expect(partialHistoryEntry).toBeDefined();
        expect(partialHistoryEntry?.status).toBe(
          ORDER_STATUS.PARTIALLY_RECEIVED,
        );
      },
    );

    test(
      'Should successfully mark all products as received from Partially Received status - 200 OK',
      { tag: [TAGS.API, TAGS.ORDERS, TAGS.SMOKE] },
      async ({ ordersController }) => {
        await ordersController.receiveProducts(
          partialReceiptOrderId,
          [partialReceiptProductIds[0]],
          token,
        );

        const fullResponse = await ordersController.receiveProducts(
          partialReceiptOrderId,
          partialReceiptProductIds,
          token,
        );

        validateResponse(fullResponse, STATUS_CODES.OK, true, null);

        const fullyUpdatedOrder = fullResponse.body.Order;
        validateSchema(orderSchema, fullyUpdatedOrder);

        expect(fullyUpdatedOrder._id).toBe(partialReceiptOrderId);
        expect(fullyUpdatedOrder.status).toBe(ORDER_STATUS.RECEIVED);

        fullyUpdatedOrder.products.forEach((product) => {
          expect(product.received).toBe(true);
        });

        const fullHistoryEntry = fullyUpdatedOrder.history.find(
          (entry) => entry.action === 'All products received',
        );
        expect(fullHistoryEntry).toBeDefined();
        expect(fullHistoryEntry?.status).toBe(ORDER_STATUS.RECEIVED);
      },
    );
  });

  test.describe('Negative cases', () => {
    test(
      'Should return error when trying to receive products for Draft order - 400 Bad Request',
      { tag: [TAGS.API, TAGS.ORDERS] },
      async ({ ordersController }) => {
        const response = await ordersController.receiveProducts(
          draftOrderId,
          draftOrderProductIds,
          token,
        );

        validateResponse(
          response,
          STATUS_CODES.BAD_REQUEST,
          false,
          ERROR_MESSAGES.INVALID_ORDER_STATUS,
        );
      },
    );

    test.skip(
      'Should return error when trying to receive products for Canceled order - 400 Bad Request',
      { tag: [TAGS.API, TAGS.ORDERS] },
      async ({ ordersController }) => {
        const response = await ordersController.receiveProducts(
          canceledOrderId,
          canceledOrderProductIds,
          token,
        );

        validateResponse(
          response,
          STATUS_CODES.BAD_REQUEST,
          false,
          ERROR_MESSAGES.INVALID_ORDER_STATUS,
        );
      },
    );

    test(
      'Should return error when trying to receive already received products - 400 Bad Request',
      { tag: [TAGS.API, TAGS.ORDERS] },
      async ({ ordersController }) => {
        const orderResponse = await ordersController.receiveProducts(
          fullReceiptOrderId,
          fullReceiptProductIds,
          token,
        );

        expect(orderResponse.body.Order.status).toBe(ORDER_STATUS.RECEIVED);

        const response = await ordersController.receiveProducts(
          fullReceiptOrderId,
          fullReceiptProductIds,
          token,
        );

        validateResponse(
          response,
          STATUS_CODES.BAD_REQUEST,
          false,
          ERROR_MESSAGES.INVALID_ORDER_STATUS,
        );
      },
    );

    test(
      'Should return error when order does not exist - 404 Not Found',
      { tag: [TAGS.API, TAGS.ORDERS] },
      async ({ ordersController }) => {
        const nonExistentOrderId = new ObjectId().toHexString();
        const anyProductIds = [new ObjectId().toHexString()];

        const response = await ordersController.receiveProducts(
          nonExistentOrderId,
          anyProductIds,
          token,
        );

        validateResponse(
          response,
          STATUS_CODES.NOT_FOUND,
          false,
          ERROR_MESSAGES.ORDER_NOT_FOUND,
        );
      },
    );

    test(
      'Should return error when products do not exist in order - 400 Bad Request',
      { tag: [TAGS.API, TAGS.ORDERS] },
      async ({ ordersController, ordersApiService }) => {
        const orderBefore = await ordersApiService.getOrderByID(
          partialReceiptOrderId,
          token,
        );
        expect(orderBefore.status).toBe(ORDER_STATUS.IN_PROCESS);

        const nonExistentProductId = new ObjectId().toHexString();
        const response = await ordersController.receiveProducts(
          partialReceiptOrderId,
          [nonExistentProductId],
          token,
        );

        validateResponse(
          response,
          STATUS_CODES.BAD_REQUEST,
          false,
          ERROR_MESSAGES.PRODUCT_IS_NOT_REQUESTED_IN_ORDER(
            nonExistentProductId,
          ),
        );
      },
    );

    test(
      'Should return 401 when using empty token',
      { tag: [TAGS.API, TAGS.ORDERS, TAGS.REGRESSION] },
      async ({ ordersController }) => {
        const response = await ordersController.receiveProducts(
          partialReceiptOrderId,
          [partialReceiptProductIds[0]],
          '',
        );

        validateResponse(
          response,
          STATUS_CODES.UNAUTHORIZED,
          false,
          'Not authorized',
        );
      },
    );

    test(
      'Should return 401 when using invalid token',
      { tag: [TAGS.API, TAGS.ORDERS, TAGS.REGRESSION] },
      async ({ ordersController }) => {
        const response = await ordersController.receiveProducts(
          partialReceiptOrderId,
          [partialReceiptProductIds[0]],
          'Invalid access token',
        );

        validateResponse(
          response,
          STATUS_CODES.UNAUTHORIZED,
          false,
          'Invalid access token',
        );
      },
    );
  });
});
