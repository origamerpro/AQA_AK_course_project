import { test, expect } from "fixtures/api-services.fixture";
import { apiConfig } from "config/api-config";
import { USER_LOGIN, USER_PASSWORD } from "config/environment";
import { STATUS_CODES } from "data/statusCodes";
import { generateCustomerData } from "data/customers/generateCustomer.data";
import { TAGS } from "data/testTags.data";
import { ICustomerFilterParams } from "types/customer.types";
import { COUNTRIES } from "data/customers/countries.data";

// Тест используется только для проверки реализации контроллеров и сервисов Customers. Удалить после тестирования

test.describe("[API] [Customers] Smoke Test", () => {
    test('Get all customers without filters',
        { tag: [TAGS.SMOKE, TAGS.REGRESSION] },
        async ({ customersApiService, request }) => {
            const loginResponse = await request.post(apiConfig.BASE_URL + apiConfig.ENDPOINTS.LOGIN, {
                data: {
                    username: USER_LOGIN,
                    password: USER_PASSWORD,
                },
                headers: {
                    "content-type": "application/json",
                },
            });
            const headers = loginResponse.headers();
            const token = headers["authorization"];
            expect.soft(loginResponse.status()).toBe(STATUS_CODES.OK);
            expect.soft(token).toBeTruthy();

            const customersResponse = await customersApiService.getAllCustomers(token);
            console.log(customersResponse);
        }
    );
    test('Get customer with filters',
        { tag: [TAGS.SMOKE] },
        async ({ customersApiService, request }) => {
            const loginResponse = await request.post(apiConfig.BASE_URL + apiConfig.ENDPOINTS.LOGIN, {
                data: {
                    username: USER_LOGIN,
                    password: USER_PASSWORD,
                },
                headers: {
                    "content-type": "application/json",
                },
            });
            const headers = loginResponse.headers();
            const token = headers["authorization"];
            expect.soft(loginResponse.status()).toBe(STATUS_CODES.OK);
            expect.soft(token).toBeTruthy();

            const params: ICustomerFilterParams = {
                search: "john doe",
                country: ["USA", "Canada"] as COUNTRIES[],
                sortField: "name",
                sortOrder: "asc",
            };
            const customersResponse = await customersApiService.getFilteredCustomers(token, params);
            console.log(customersResponse);
        }
    );
});