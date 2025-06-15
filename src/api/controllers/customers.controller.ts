import { APIRequestContext, test } from '@playwright/test';
import { RequestApi } from 'api/apiClients/request';
import { apiConfig } from 'config/api-config';
import { create } from 'domain';
import { update } from 'lodash';
import {
  customersSortField,
  IRequestOptions,
  sortDirection,
} from 'types/api.types';
import {
  ICustomer,
  ICustomerFilterParams,
  ICustomerResponse,
  ICustomersAllResponse,
  ICustomersFilteredResponse,
} from 'types/customer.types';
import { logStep } from 'utils/reporter.utils';
import { convertRequestParams } from 'utils/requestParams.utils';

export class CustomersController {
  private request: RequestApi;

  constructor(context: APIRequestContext) {
    this.request = new RequestApi(context);
  }

  @logStep('GET /customers with pagination via API')
  async getCustomersWithPagination(
    token: string,
    page?: number,
    limit?: number,
    sortField: customersSortField = 'createdOn',
    sortOrder: sortDirection = 'desc',
  ) {
    const params: Record<string, string> = {};

    // Добавляем параметры только если они переданы
    if (page !== undefined) {
      params.page = page.toString();
    }

    if (limit !== undefined) {
      params.limit = limit.toString();
    }

    // Сортировка всегда добавляется (есть значения по умолчанию)
    params.sortField = sortField;
    params.sortOrder = sortOrder;

    const options: IRequestOptions = {
      baseURL: apiConfig.BASE_URL,
      url: `${apiConfig.ENDPOINTS.CUSTOMERS}?${new URLSearchParams(params)}`,
      method: 'get',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    return await this.request.send<ICustomersFilteredResponse>(options);
  }

  @logStep('POST /customers via API')
  async create(body: ICustomer, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.BASE_URL,
      url: apiConfig.ENDPOINTS.CUSTOMERS,
      method: 'post',
      data: body,
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    return await this.request.send<ICustomerResponse>(options);
  }

  @logStep('GET /customers filtered and sorted list of customers via API')
  async getFilteredCustomers(token: string, params?: ICustomerFilterParams) {
    const options: IRequestOptions = {
      baseURL: apiConfig.BASE_URL,
      url:
        apiConfig.ENDPOINTS.CUSTOMERS +
        (params ? convertRequestParams(params) : ''),
      method: 'get',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    return await this.request.send<ICustomersFilteredResponse>(options);
  }

  @logStep('GET /customers/all via API')
  async getAllCustomers(token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.BASE_URL,
      url: apiConfig.ENDPOINTS.ALL_CUSTOMERS,
      method: 'get',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    return await this.request.send<ICustomersAllResponse>(options);
  }

  @logStep('GET /customers/{id} via API')
  async getById(id: string, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.BASE_URL,
      url: apiConfig.ENDPOINTS.CUSTOMER_BY_ID(id),
      method: 'get',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    return await this.request.send<ICustomerResponse>(options);
  }

  @logStep('PUT /customers/{id} via API')
  async update(id: string, body: Partial<ICustomer>, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.BASE_URL,
      url: apiConfig.ENDPOINTS.CUSTOMER_BY_ID(id),
      method: 'put',
      data: body,
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    return await this.request.send<ICustomerResponse>(options);
  }

  @logStep('DELETE /customers/{id} via API')
  async delete(id: string, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.BASE_URL,
      url: apiConfig.ENDPOINTS.CUSTOMER_BY_ID(id),
      method: 'delete',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return await this.request.send<null>(options);
  }
}
