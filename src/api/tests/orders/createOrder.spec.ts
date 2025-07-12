import { test } from 'fixtures/api-services.fixture';
import { STATUS_CODES } from "data/statusCodes";
import { TAGS } from "data/testTags.data";
import { validateResponse } from "utils/validations/responseValidation";

test.describe('[API] [Orders] Create a new order', () => {
  let token = '';
  const createdOrderIds: string[] = [];
  const createdProductIds: string[] = [];
  const createdCustomerIds: string[] = [];
  let productsId: string[] = [];

  test.beforeEach(async ({ signInApiService, customersApiService, productsApiService }) => {
    token = await signInApiService.loginAsLocalUser();
  });

  test.afterAll(async ({ dataDisposalUtils }) => {
    await dataDisposalUtils.clearOrders(createdOrderIds);
    await dataDisposalUtils.clearCustomers(createdCustomerIds);
    await dataDisposalUtils.clearProducts(createdProductIds);
  });

  test.describe('Positive', () => {
    test('201 Created - Create order with one product',
      { tag: [TAGS.API, TAGS.ORDERS, TAGS.SMOKE] },
      async ({ ordersController, customersApiService, productsApiService }) => {
      const customer = await customersApiService.createCustomer(token);
      const product = await productsApiService.create(token);

      createdCustomerIds.push(customer._id);
      createdProductIds.push(product._id);

      const data = {
        customer: customer._id,
        products: [product._id],
      };

      const response = await ordersController.create(data, token);
      validateResponse(response, STATUS_CODES.CREATED, true, null);
      createdOrderIds.push(response.body.Order._id);
    });

    test('201 Created - Create order with five product',
      { tag: [TAGS.API, TAGS.ORDERS, TAGS.SMOKE] },
      async ({ ordersController, productsApiService, customersApiService }) => {
      const customer = await customersApiService.createCustomer(token);
      const products = await productsApiService.populate(5, token);

      productsId = products.map(product => product._id);
      createdCustomerIds.push(customer._id);
      createdProductIds.push(...products.map(p => p._id));

      const data = {
        customer: customer._id,
        products: productsId,
      };

      const response = await ordersController.create(data, token);
      validateResponse(response, STATUS_CODES.CREATED, true, null);
      createdOrderIds.push(response.body.Order._id);
    });
  });

  test.describe('Negative', () => {
    test('400 Bad Request - Create order with 5+ products',
      { tag: [TAGS.API, TAGS.ORDERS, TAGS.REGRESSION] },
      async ({ ordersController, productsApiService, customersApiService }) => {
      const customer = await customersApiService.createCustomer(token);
      const products = await productsApiService.populate(6, token);

      productsId = products.map(product => product._id);
      createdCustomerIds.push(customer._id);
      createdProductIds.push(...products.map(p => p._id));

      const data = {
        customer: customer._id,
        products: productsId,
      };

      const response = await ordersController.create(data, token);
      validateResponse(response, STATUS_CODES.BAD_REQUEST, false, "Incorrect request body");
    });

    test('400 Bad Request - Create order without products',
      { tag: [TAGS.API, TAGS.ORDERS, TAGS.REGRESSION] },
      async ({ ordersController, productsApiService, customersApiService }) => {
        const customer = await customersApiService.createCustomer(token);

        productsId = [];
        createdCustomerIds.push(customer._id);

        const data = {
          customer: customer._id,
          products: productsId,
        };

        const response = await ordersController.create(data, token);
        validateResponse(response, STATUS_CODES.BAD_REQUEST, false, "Incorrect request body");
      });

    test('401 Unauthorized - Create order without token',
      { tag: [TAGS.API, TAGS.ORDERS, TAGS.REGRESSION] },
      async ({ ordersController, customersApiService, productsApiService }) => {
        const customer = await customersApiService.createCustomer(token);
        const product = await productsApiService.create(token);

        createdCustomerIds.push(customer._id);
        createdProductIds.push(product._id);

        const data = {
          customer: customer._id,
          products: [product._id],
        };

        const response = await ordersController.create(data, '');
        validateResponse(response, STATUS_CODES.UNAUTHORIZED, false, 'Not authorized');
      });

    test('401 Unauthorized - Create order with invalid token',
      { tag: [TAGS.API, TAGS.ORDERS, TAGS.REGRESSION] },
      async ({ ordersController, customersApiService, productsApiService }) => {
        const customer = await customersApiService.createCustomer(token);
        const product = await productsApiService.create(token);

        createdCustomerIds.push(customer._id);
        createdProductIds.push(product._id);

        const data = {
          customer: customer._id,
          products: [product._id],
        };

        const response = await ordersController.create(data, 'Invalid token');
        validateResponse(response, STATUS_CODES.UNAUTHORIZED, false, 'Invalid access token');
      });

    test('404 Not Found - Create order with not exist customer',
      { tag: [TAGS.API, TAGS.ORDERS, TAGS.REGRESSION] },
      async ({ ordersController, customersApiService, productsApiService }) => {
        const customer = await customersApiService.createCustomer(token);
        const product = await productsApiService.create(token);

        await customersApiService.deleteCustomer(customer._id, token);

        createdProductIds.push(product._id);

        const data = {
          customer: customer._id,
          products: [product._id],
        };

        const response = await ordersController.create(data, token);
        validateResponse(response, STATUS_CODES.NOT_FOUND, false, `Customer with id '${customer._id}' wasn't found`);
      });

    test('404 Not Found - Create order without customer',
      { tag: [TAGS.API, TAGS.ORDERS, TAGS.REGRESSION] },
      async ({ ordersController, productsApiService, customersApiService }) => {
        const product = await productsApiService.create(token);

        createdProductIds.push(product._id);

        const data = {
          customer: '',
          products: [product._id],
        };

        const response = await ordersController.create(data, token);
        validateResponse(response, STATUS_CODES.NOT_FOUND, false, "Missing customer");
      });

    test('404 Not Found - Create order with not exist product',
      { tag: [TAGS.API, TAGS.ORDERS, TAGS.REGRESSION] },
      async ({ ordersController, customersApiService, productsApiService }) => {
        const customer = await customersApiService.createCustomer(token);
        const product = await productsApiService.create(token);

        await  productsApiService.delete(product._id, token);

        createdCustomerIds.push(customer._id);

        const data = {
          customer: customer._id,
          products: [product._id],
        };

        const response = await ordersController.create(data, token);
        validateResponse(response, STATUS_CODES.NOT_FOUND, false, `Product with id '${product._id}' wasn't found`);
      });
  });
});