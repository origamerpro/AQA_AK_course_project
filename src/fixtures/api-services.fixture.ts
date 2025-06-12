import { test as base } from "fixtures/controllers.fixture";
import { SignInApiService } from "api/services/signIn.api-service";
import { CustomersApiService } from "api/services/customers.api-service";

interface IApiServices {
    customersApiService: CustomersApiService;
    signInApiService: SignInApiService;
}

export const test = base.extend<IApiServices>({
    signInApiService: async ({ request }, use) => {
        await use(new SignInApiService(request));
    },

    customersApiService: async ({ request }, use) => {
        await use(new CustomersApiService(request));
    },
});

export { expect } from "@playwright/test";