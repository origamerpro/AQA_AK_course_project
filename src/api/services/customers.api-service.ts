import { test, APIRequestContext } from "@playwright/test";
import { CustomersController } from "api/controllers/customers.controller";
import { generateCustomerData } from "data/customers/generateCustomer.data";
import { STATUS_CODES } from "data/statusCodes";
import { ICustomer, ICustomerFilterParams, ICustomersAllResponse, ICustomersFilteredResponse } from "types/customer.types";
import { logStep } from "utils/reporter.utils";
import { validateResponse } from "utils/validations/responseValidation";

export class CustomersApiService {

    controller: CustomersController;

    constructor(request: APIRequestContext) {
        this.controller = new CustomersController(request);
    }

    @logStep("Create a new customer via API")
    async createCustomer(token: string, customData?: ICustomer) {
        const body = generateCustomerData(customData);
        const response = await this.controller.create(body, token);
        validateResponse(response, STATUS_CODES.CREATED, true, null);
        return response.body.Customer;
    }

    @logStep("Get filtered and sorted list of customers via API")
    async getFilteredCustomers(token: string, params?: ICustomerFilterParams) {
        const response = await this.controller.getFilteredCustomers(token, params);
        validateResponse(response, STATUS_CODES.OK, true, null);
        return response.body;
    }

    @logStep("Get all customers via API")
    async getAllCustomers(token: string) {
        const response = await this.controller.getAllCustomers(token);
        validateResponse(response, STATUS_CODES.OK, true, null);
        return response.body as ICustomersAllResponse;
    }

    @logStep("Get customer by ID via API")
    async getCustomerById(id: string, token: string) {
        const response = await this.controller.getById(id, token);
        validateResponse(response, STATUS_CODES.OK, true, null);
        return response.body.Customer;
    }

    @logStep("Update customer by ID via API")
    async updateCustomer(id: string, updates: Partial<ICustomer>, token: string) {
        const response = await this.controller.update(id, updates, token);
        validateResponse(response, STATUS_CODES.OK, true, null);
        return response.body.Customer;
    }

    @logStep("Delete customer by ID via API")
    async deleteCustomer(id: string, token: string) {
        const response = await this.controller.delete(id, token);
        validateResponse(response, STATUS_CODES.DELETED, true, null);
    }

    @logStep("Delete non-existent customer by ID via API")
    async deleteNonExistentCustomer(token: string) {
        const fakeID = "6840b36c1c508c5d5e50fd1d";
        const response = await this.controller.delete(fakeID, token);
        validateResponse(response, STATUS_CODES.NOT_FOUND, true, `Customer with id '${fakeID}' wasn't found`);
    }
}