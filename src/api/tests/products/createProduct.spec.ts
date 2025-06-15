import { generateProductData } from 'data/products/generateProduct.data';
import {
  negativeTestCases,
  positiveTestCases,
} from 'data/products/productTestCases.data';
import { STATUS_CODES } from 'data/statusCodes';
import { TAGS } from 'data/testTags.data';
import { test } from 'fixtures/api-services.fixture';
import { validateResponse } from 'utils/validations/responseValidation';

test.describe('[API] [Products] Create Product, Positive', () => {
  let token = '';
  let productId = '';

  test.beforeEach(async ({ signInApiService }) => {
    token = await signInApiService.loginAsLocalUser();
  });

  test.afterEach(async ({ productsApiService }) => {
    await productsApiService.delete(productId, token);
  });

  positiveTestCases.forEach(({ name, data }) => {
    test(
      `Should create product: ${name}`,
      { tag: [TAGS.API, TAGS.PRODUCTS, TAGS.SMOKE, TAGS.REGRESSION] },
      async ({ productsController }) => {
        const response = await productsController.create(data, token);
        validateResponse(response, STATUS_CODES.CREATED, true, null);
        productId = response.body.Product._id;
      },
    );
  });
});

test.describe('[API] [Products] Create Product, Negative', () => {
  let token = '';

  test.beforeEach(async ({ signInApiService }) => {
    token = await signInApiService.loginAsLocalUser();
  });

  negativeTestCases.forEach(
    ({
      name,
      data,
      token: testCaseToken,
      expectedError,
      expectedStatusCode,
    }) => {
      test(
        `Should NOT create product: ${name}`,
        { tag: [TAGS.API, TAGS.PRODUCTS, TAGS.REGRESSION] },
        async ({ productsController }) => {
          const usedToken = testCaseToken ?? token;
          const statusCode = expectedStatusCode ?? STATUS_CODES.BAD_REQUEST;

          const response = await productsController.create(data, usedToken);
          validateResponse(response, statusCode, false, expectedError);
        },
      );
    },
  );
});

test.describe('[API] [Products] Create Product, Duplicate name', () => {
  let token = '';
  test.beforeEach(async ({ signInApiService }) => {
    token = await signInApiService.loginAsLocalUser();
  });
  test(
    'Should NOT create product: Duplicate name',
    { tag: [TAGS.API, TAGS.PRODUCTS, TAGS.REGRESSION] },
    async ({ productsController, productsApiService }) => {
      const firstProduct = await productsApiService.create(
        token,
        generateProductData(),
      );
      const duplicateProductData = {
        ...generateProductData(),
        name: firstProduct.name,
      };

      const duplicateResponse = await productsController.create(
        duplicateProductData,
        token,
      );

      validateResponse(
        duplicateResponse,
        STATUS_CODES.CONFLICT,
        false,
        `Product with name '${firstProduct.name}' already exists`,
      );

      await productsApiService.delete(firstProduct._id, token);
    },
  );
});
