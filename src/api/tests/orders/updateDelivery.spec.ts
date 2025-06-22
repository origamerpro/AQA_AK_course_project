import { generateDeliveryData } from 'data/orders/generateDeliveryData.data';
import {
  negativeTestCasesForDelivery,
  negativeTestCasesForDeliveryWithoutToken,
  positiveTestCasesForDelivery,
} from 'data/orders/updateDeliveryCases.data';
import { deliverySchema } from 'data/schemas/order.schema';
import { STATUS_CODES } from 'data/statusCodes';
import { TAGS } from 'data/testTags.data';
import { test } from 'fixtures/api-services.fixture';
import { IOrderFromResponse } from 'types/orders.types';
import { generateUniqueId } from 'utils/generateUniqueID.utils';
import { validateResponse } from 'utils/validations/responseValidation';
import { validateSchema } from 'utils/validations/schemaValidation';

test.describe('[API] [Orders] Update delivery', () => {
  let token = '';
  const createdOrderIds: string[] = [];
  const createdCustomerIds: string[] = [];
  const createdProductIds: string[] = [];

  let draftOrder: IOrderFromResponse | null = null;

  test.beforeEach(async ({ signInApiService, ordersApiService }) => {
    token = await signInApiService.loginAsLocalUser();
    draftOrder = await ordersApiService.createDraftOrder(1, token);

    createdOrderIds.push(draftOrder._id);
    createdCustomerIds.push(draftOrder.customer._id);
    draftOrder.products.forEach((p) => createdProductIds.push(p._id));
  });

  test.afterEach(async ({ dataDisposalUtils }) => {
    await dataDisposalUtils.clearOrders(createdOrderIds);
    await dataDisposalUtils.clearProducts(createdProductIds);
    await dataDisposalUtils.clearCustomers(createdCustomerIds);
    createdOrderIds.length = 0;
    createdCustomerIds.length = 0;
    createdProductIds.length = 0;
  });

  test.describe('Positive', () => {
    positiveTestCasesForDelivery.forEach(
      ({ name, data, expectedStatusCode, isSuccess, errorMessage }) => {
        test(
          `Should update delivery: ${name}`,
          { tag: [TAGS.API, TAGS.ORDERS, TAGS.SMOKE, TAGS.REGRESSION] },
          async ({ ordersController }) => {
            const response = await ordersController.updateDelivery(
              draftOrder!._id,
              data,
              token,
            );

            validateResponse(
              response,
              expectedStatusCode,
              isSuccess,
              errorMessage,
            );
            await validateSchema(deliverySchema, response.body.Order.delivery!);
          },
        );
      },
    );
  });

  test.describe('Negative', () => {
    negativeTestCasesForDelivery.forEach(
      ({ name, data, expectedStatusCode, isSuccess, errorMessage }) => {
        test(
          `Should NOT update delivery: ${name}`,
          { tag: [TAGS.API, TAGS.ORDERS, TAGS.REGRESSION] },
          async ({ ordersController }) => {
            const response = await ordersController.updateDelivery(
              draftOrder!._id,
              data,
              token,
            );
            validateResponse(
              response,
              expectedStatusCode,
              isSuccess,
              errorMessage,
            );
          },
        );
      },
    );

    negativeTestCasesForDeliveryWithoutToken.forEach(
      ({
        name,
        data,
        invalidToken,
        expectedStatusCode,
        isSuccess,
        errorMessage,
      }) => {
        test(
          `Should NOT update delivery: ${name}`,
          { tag: [TAGS.API, TAGS.ORDERS, TAGS.REGRESSION] },
          async ({ ordersController }) => {
            const response = await ordersController.updateDelivery(
              draftOrder!._id,
              data,
              invalidToken,
            );
            validateResponse(
              response,
              expectedStatusCode,
              isSuccess,
              errorMessage,
            );
          },
        );
      },
    );

    test(
      'Should NOT update delivery: For non-existent order check',
      { tag: [TAGS.API, TAGS.ORDERS, TAGS.REGRESSION] },
      async ({ ordersController }) => {
        const id = generateUniqueId();
        const delivery = generateDeliveryData();

        const response = await ordersController.updateDelivery(
          id,
          delivery,
          token,
        );

        validateResponse(
          response,
          STATUS_CODES.NOT_FOUND,
          false,
          `Order with id '${id}' wasn't found`,
        );
      },
    );
  });
});
