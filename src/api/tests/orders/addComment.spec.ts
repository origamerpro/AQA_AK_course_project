import { expect, test } from 'fixtures/api-services.fixture';
import { TAGS } from 'data/testTags.data';
import { validateResponse } from 'utils/validations/responseValidation';
import {
  negativeTestCasesForAddComment,
  negativeTestCasesForAddCommentWithoutToken,
  positiveTestCasesForAddComment,
} from 'data/orders/addCommentCases.data';
import { generateCommentData } from 'data/orders/generateCommentData.data';
import { STATUS_CODES } from 'data/statusCodes';
import { validateSchema } from 'utils/validations/schemaValidation';
import { addCommentResponseSchema } from 'data/schemas/order.schema';
import { generateUniqueId } from 'utils/generateUniqueID.utils';

test.describe('[API] [Orders] Add a comment', () => {
  let token = '';

  test.beforeEach(async ({ signInApiService }) => {
    token = await signInApiService.loginAsLocalUser();
  });

  test.describe('Positive', () => {
    let createdOrderId: string = '';
    let createdCustomerId: string = '';
    const createdProductIds: string[] = [];

    test.afterEach(async ({ dataDisposalUtils }) => {
      await dataDisposalUtils.clearOrders(createdOrderId, token);
      await dataDisposalUtils.clearProducts(createdProductIds, token);
      await dataDisposalUtils.clearCustomers(createdCustomerId, token);
      createdOrderId = '';
      createdCustomerId = '';
      createdProductIds.length = 0;
    });

    positiveTestCasesForAddComment.forEach(
      ({ name, comment, expectedStatusCode, isSuccess, errorMessage }) => {
        test(
          `Should add comment: ${name}`,
          { tag: [TAGS.API, TAGS.ORDERS, TAGS.SMOKE, TAGS.REGRESSION] },
          async ({ ordersController, ordersApiService }) => {
            const draftOrder = await ordersApiService.createDraftOrder(
              1,
              token,
            );

            createdOrderId = draftOrder._id;
            createdCustomerId = draftOrder.customer._id;
            draftOrder.products.map((p) => createdProductIds.push(p._id));

            const response = await ordersController.addComment(
              draftOrder._id,
              comment,
              token,
            );

            validateResponse(
              response,
              expectedStatusCode,
              isSuccess,
              errorMessage,
            );
            await validateSchema(addCommentResponseSchema, response.body.Order);
            const currentComment = response.body.Order.comments[0].text;
            expect.soft(comment).toEqual(currentComment);
          },
        );
      },
    );

    test(
      'Should add second comment',
      { tag: [TAGS.API, TAGS.ORDERS, TAGS.SMOKE, TAGS.REGRESSION] },
      async ({ ordersController, ordersApiService }) => {
        const draftOrder = await ordersApiService.createDraftOrder(1, token);

        createdOrderId = draftOrder._id;
        createdCustomerId = draftOrder.customer._id;
        draftOrder.products.map((p) => createdProductIds.push(p._id));

        const comment1 = generateCommentData();
        const response1 = await ordersController.addComment(
          draftOrder._id,
          comment1,
          token,
        );
        validateResponse(response1, STATUS_CODES.OK, true, null);

        const comment2 = generateCommentData();
        const response2 = await ordersController.addComment(
          draftOrder._id,
          comment2,
          token,
        );
        validateResponse(response2, STATUS_CODES.OK, true, null);
        await validateSchema(addCommentResponseSchema, response2.body.Order);
        const currentComment2 = response2.body.Order.comments[1].text;
        expect.soft(comment2).toEqual(currentComment2);
      },
    );
  });

  test.describe('Negative', () => {
    negativeTestCasesForAddComment.forEach(
      ({ name, comment, expectedStatusCode, isSuccess, errorMessage }) => {
        test(
          `Should NOT add comment: ${name}`,
          { tag: [TAGS.API, TAGS.ORDERS, TAGS.REGRESSION] },
          async ({ ordersController, ordersApiService }) => {
            const draftOrder = await ordersApiService.createDraftOrder(
              1,
              token,
            );

            const response = await ordersController.addComment(
              draftOrder._id,
              comment,
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

    negativeTestCasesForAddCommentWithoutToken.forEach(
      ({
        name,
        comment,
        invalidToken,
        expectedStatusCode,
        isSuccess,
        errorMessage,
      }) => {
        test(
          `Should NOT add comment: ${name}`,
          { tag: [TAGS.API, TAGS.ORDERS, TAGS.REGRESSION] },
          async ({ ordersController, ordersApiService }) => {
            const draftOrder = await ordersApiService.createDraftOrder(
              1,
              token,
            );

            const response = await ordersController.addComment(
              draftOrder._id,
              comment,
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
      'Should NOT add comment: For non-existent order',
      { tag: [TAGS.API, TAGS.ORDERS, TAGS.REGRESSION] },
      async ({ ordersController }) => {
        const id = generateUniqueId();
        const comment = generateCommentData();

        const response = await ordersController.addComment(id, comment, token);

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
