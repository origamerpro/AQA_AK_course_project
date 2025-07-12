import { test } from 'fixtures/api-services.fixture';
import { STATUS_CODES } from "data/statusCodes";
import { TAGS } from "data/testTags.data";
import { validateResponse } from "utils/validations/responseValidation";

test.describe('[API] [Orders] Get order by id', () => {
  let token = '';
  const createdOrderIds: string[] = [];
  const createdProductIds: string[] = [];
  const createdCustomerIds: string[] = [];

  test.beforeEach(async ({ signInApiService }) => {
    token = await signInApiService.loginAsLocalUser();
  });

  test.afterAll(async ({ dataDisposalUtils }) => {
    await dataDisposalUtils.clearOrders(createdOrderIds);
    await dataDisposalUtils.clearCustomers(createdCustomerIds);
    await dataDisposalUtils.clearProducts(createdProductIds);
  });

  test.describe('Positive', () => {
    test('200 OK - Get order by id',
      { tag: [TAGS.API, TAGS.ORDERS, TAGS.SMOKE] },
      async ({ ordersController, customersApiService, productsApiService }) => {
        const customer = await customersApiService.createCustomer(token);
        const product = await productsApiService.create(token);
        const data = {
          customer: customer._id,
          products: [product._id],
        };
        const order = await ordersController.create(data, token);

        createdCustomerIds.push(customer._id);
        createdProductIds.push(product._id);
        createdOrderIds.push(order.body.Order._id);

        const response = await ordersController.getByID(order.body.Order._id, token)
        validateResponse(response, STATUS_CODES.OK, true, null);
      });
  });

    test.describe('Negative', () => {
      test('404 Not Found - Get order by invalid id',
        { tag: [TAGS.API, TAGS.ORDERS, TAGS.REGRESSION] },
        async ({ ordersController, customersApiService, productsApiService }) => {
          const customer = await customersApiService.createCustomer(token);
          const product = await productsApiService.create(token);
          const data = {
            customer: customer._id,
            products: [product._id],
          };
          const order = await ordersController.create(data, token);
          await ordersController.delete(order.body.Order._id, token);
          const orderId = order.body.Order._id;

          createdCustomerIds.push(customer._id);
          createdProductIds.push(product._id);

          const response = await ordersController.getByID(orderId, token)
          validateResponse(response, STATUS_CODES.NOT_FOUND, false, `Order with id '${orderId}' wasn't found`);
        });

      test('401 Unauthorized - Get order by id without token',
        { tag: [TAGS.API, TAGS.ORDERS, TAGS.REGRESSION] },
        async ({ ordersController, customersApiService, productsApiService }) => {
          const customer = await customersApiService.createCustomer(token);
          const product = await productsApiService.create(token);
          const data = {
            customer: customer._id,
            products: [product._id],
          };
          const order = await ordersController.create(data, token);
          const orderId = order.body.Order._id;

          createdCustomerIds.push(customer._id);
          createdProductIds.push(product._id);
          createdOrderIds.push(orderId);

          const response = await ordersController.getByID(orderId, '');
          validateResponse(response, STATUS_CODES.UNAUTHORIZED, false, 'Not authorized');
        });

      test('401 Unauthorized - Get order by id with invalid token',
        { tag: [TAGS.API, TAGS.ORDERS, TAGS.REGRESSION] },
        async ({ ordersController, customersApiService, productsApiService }) => {
          const customer = await customersApiService.createCustomer(token);
          const product = await productsApiService.create(token);
          const data = {
            customer: customer._id,
            products: [product._id],
          };
          const order = await ordersController.create(data, token);
          const orderId = order.body.Order._id;

          createdCustomerIds.push(customer._id);
          createdProductIds.push(product._id);
          createdOrderIds.push(orderId);

          const response = await ordersController.getByID(orderId, 'Invalid token');
          validateResponse(response, STATUS_CODES.UNAUTHORIZED, false, 'Invalid access token');
        });
    });
});