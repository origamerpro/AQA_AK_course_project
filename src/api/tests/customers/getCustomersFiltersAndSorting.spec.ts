import { test, expect } from 'fixtures/api-services.fixture';
import { STATUS_CODES } from 'data/statusCodes';
import { validateResponse } from 'utils/validations/responseValidation';
import { TAGS } from 'data/testTags.data';
import { COUNTRIES } from 'data/customers/countries.data';
import { generateCustomerData } from 'data/customers/generateCustomer.data';
import { ICustomerFilterParams } from 'types/customer.types';

test.describe('[API][Customers] GET /api/customers filters and sorting', () => {
  let token = '';
  const createdCustomerIds: string[] = [];

  test.beforeAll(async ({ signInApiService, customersController }) => {
    token = await signInApiService.loginAsLocalUser();
  });

  test.afterAll(async ({ customersController }) => {
    await Promise.all(
      createdCustomerIds.map((id) =>
        customersController.delete(id, token).catch(() => {}),
      ),
    );
  });

  test(
    'CUST-SMK-002: Поиск только по country',
    {
      tag: [TAGS.API, TAGS.CUSTOMERS, TAGS.SMOKE, TAGS.REGRESSION],
    },
    async ({ customersController }) => {
      // 1. Подготовка тестовых данных
      const testCountry = COUNTRIES.CANADA;
      const testCustomer = generateCustomerData({ country: testCountry });
      const createResponse = await customersController.create(
        testCustomer,
        token,
      );
      createdCustomerIds.push(createResponse.body.Customer._id);

      console.log(createResponse);
      console.log(createdCustomerIds);

      // 2. Выполнение запроса с фильтром по стране
      const params: ICustomerFilterParams = {
        country: [testCountry],
        sortField: 'createdOn',
        sortOrder: 'desc',
      };

      // 3. Используем customersController вместо customersApiService
      const response = await customersController.getFilteredCustomers(
        token,
        params,
      );

      console.log(response.body.Customers);

      // Проверки
      validateResponse(response, STATUS_CODES.OK, true, null);

      expect(response.body.Customers.length).toBeGreaterThan(0);
      expect(
        response.body.Customers.every((c) => c.country === testCountry),
      ).toBeTruthy();

      expect(response.body.country).toEqual([testCountry]);

      expect(
        response.body.Customers.some(
          (c) => c._id === createResponse.body.Customer._id,
        ),
      ).toBeTruthy();
    },
  );
});
