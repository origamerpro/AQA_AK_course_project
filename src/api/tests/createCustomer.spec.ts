import { test } from "fixtures/api-services.fixture";
import { STATUS_CODES } from "data/statusCodes";
import { generateCustomerData } from "data/customers/generateCustomer.data";
import { TAGS } from "data/testTags.data";
import { validateResponse } from "utils/validations/responseValidation";

import { positiveTestCases, negativeTestCases } from "data/customers/customerTestCases.data";

test.describe("[API] [Customers] Positive Tests", () => {

    let token = "";
    let id = "";

    test.beforeEach(async ({ signInApiService }) => {
        token = await signInApiService.loginAsLocalUser();
    });

    test.afterEach(async ({ customersApiService }) => {
        await customersApiService.deleteCustomer(id, token);
    });

    positiveTestCases.forEach(({ name, data }) => {
        test(`Should create customer: ${name}`,
            { tag: [TAGS.API, TAGS.PRODUCTS, TAGS.SMOKE, TAGS.REGRESSION] },
            async ({ customersController }) => {

                const response = await customersController.create(data, token);
                validateResponse(response, STATUS_CODES.CREATED, true, null);

                id = response.body.Customer._id;
            })
    });
});

test.describe("[API] [Customers] Negative Tests", () => {

    let token = "";
    let id = "";

    test.beforeEach(async ({ signInApiService }) => {
        token = await signInApiService.loginAsLocalUser();
    });

    negativeTestCases.forEach(({ name, data, override, expectedError }) => {
        test(`Should NOT create customer: ${name}`,
            { tag: [TAGS.API, TAGS.PRODUCTS, TAGS.REGRESSION] },
            async ({ customersController }) => {

                let tokenToSend = token;
                let expectedStatusCode = STATUS_CODES.BAD_REQUEST;

                switch (name) {
                    case "Invalid auth token":
                        tokenToSend = "invalid_token";
                        expectedStatusCode = STATUS_CODES.UNAUTHORIZED;
                        break;
                    case "Missing auth token":
                        tokenToSend = "";
                        expectedStatusCode = STATUS_CODES.UNAUTHORIZED;
                        break;
                }

                if (override) {
                    data = override(data);
                }

                const response = await customersController.create(data, tokenToSend);
                validateResponse(response, expectedStatusCode, false, expectedError);
            })
    });

    test("Should NOT create customer: Duplicate email", async ({ customersController, customersApiService }) => {

        const customer1Data = generateCustomerData();
        const createResponse1 = await customersApiService.createCustomer(token, customer1Data);

        const customer2Data = { ...generateCustomerData(), email: customer1Data.email };
        const createResponse2 = await customersController.create(customer2Data, token);

        validateResponse(createResponse2, STATUS_CODES.CONFLICT, false, `Customer with email '${customer2Data.email}' already exists`);

        id = createResponse1._id;
        await customersApiService.deleteCustomer(id, token);
    });
});