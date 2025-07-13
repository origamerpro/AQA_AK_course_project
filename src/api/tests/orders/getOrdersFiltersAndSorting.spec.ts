import { test, expect } from 'fixtures/api-services.fixture';
import { STATUS_CODES } from 'data/statusCodes';
import { TAGS } from 'data/testTags.data';
import { orderSchema } from 'data/schemas/order.schema';
import { validateSchema } from 'utils/validations/schemaValidation';
import { validateResponse } from 'utils/validations/responseValidation';
import { ORDER_STATUS } from 'data/orders/statuses.data';
import { ERROR_MESSAGES } from 'data/errorMessages';
import {
  orderCanceledStatus,
  orderDraftStatus,
  orderInProcessStatus,
  orderPartiallyReceivedStatus,
  orderReceivedStatus,
} from '../../../fixtures/ordersCustom.fixture';
import { allCustomersResponseSchema } from 'data/schemas/customer.schema';
import { OrdersAPIController } from 'api/controllers/orders.controller';

test.describe('[API] [Orders] GET /api/orders filters and sorting', () => {
  let token = '';
  let ordersAPIController: OrdersAPIController;
  const createdOrderIds: string[] = [];
  const createdCustomerIds: string[] = [];
  const createdProductIds: string[] = [];
  const createdManagerId: string = '6842ba161c508c5d5e5159cb';

  test.beforeEach(async ({ ordersApiService, signInApiService, request }) => {
    ordersAPIController = new OrdersAPIController(request);
    token = await signInApiService.loginAsLocalUser();

    const draftOrder = await ordersApiService.createDraftOrder(
      1,
      token,
    );
    const partiallyReceivedOrder = await ordersApiService.createPartiallyReceivedOrder(
      1,
      3,
      token,
    );
    const inProcessOrder = await ordersApiService.createInProcessOrder(
      1,
      token,
    );
    const receivedOrder = await ordersApiService.createReceivedOrder(
      1,
      token,
    );
    const canceledOrder = await ordersApiService.createCanceledOrder(
      1,
      token,
    );

    createdOrderIds.push(draftOrder._id, partiallyReceivedOrder._id, inProcessOrder._id, receivedOrder._id, canceledOrder._id);
    createdCustomerIds.push(draftOrder.customer._id, partiallyReceivedOrder.customer._id, inProcessOrder.customer._id, receivedOrder.customer._id, canceledOrder.customer._id);
    draftOrder.products.map((p) => createdProductIds.push(p._id));
    partiallyReceivedOrder.products.map((p) => createdProductIds.push(p._id));
    inProcessOrder.products.map((p) => createdProductIds.push(p._id));
    receivedOrder.products.map((p) => createdProductIds.push(p._id));
    canceledOrder.products.map((p) => createdProductIds.push(p._id));
  });

  test.afterEach(async ({ dataDisposalUtils }) => {

    await dataDisposalUtils.clearOrders(createdOrderIds);
    await dataDisposalUtils.clearProducts(createdProductIds);
    await dataDisposalUtils.clearCustomers(createdCustomerIds);
    createdOrderIds.length = 0;
    createdCustomerIds.length = 0;
    createdProductIds.length = 0;
    console.log(createdOrderIds, createdCustomerIds, createdProductIds);
  });

    test.describe('Whitout Search', () => {
        test.describe('Positive', () => {
            test(
    'Get all orders - 200 OK',
    { tag: [TAGS.API, TAGS.ORDERS] },
    async () => {
      console.log(createdOrderIds.length);
      const response = await ordersAPIController.getFilteredOrders(token);
      validateResponse(response, STATUS_CODES.OK, true, null);
    },
  );  
    });
        test.describe('Negative', () => {
    });
    });
  
    test.describe('With Search', () => {
      
        test.describe('Positive', () => {  
    });
        test.describe('Negative', () => {
    });
    });
});