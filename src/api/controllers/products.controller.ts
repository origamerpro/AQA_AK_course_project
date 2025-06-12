import { RequestApi } from 'api/apiClients/request'
import { apiConfig } from 'config/api-config'
import { IRequestOptions } from 'types/api.types'
import {
  IProduct,
  IProductResponse,
  IProductsResponse,
} from 'types/products.types'
import { logStep } from 'utils/reporter.utils'
import { APIRequestContext } from '@playwright/test'
import { convertRequestParams } from 'utils/requestParams.utils'

export class ProductsController {
  private request: RequestApi

  constructor(context: APIRequestContext) {
    this.request = new RequestApi(context)
  }

  @logStep('POST/product via API')
  async create(productData: IProduct, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.BASE_URL,
      url: apiConfig.ENDPOINTS.PRODUCTS,
      method: 'post',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      data: productData,
    }
    return await this.request.send<IProductResponse>(options)
  }

  @logStep('GET/product via API')
  async getById(productId: string, token: string) {
    const options: IRequestOptions = {
      url: `${apiConfig.ENDPOINTS.PRODUCTS}/${productId}`,
      baseURL: apiConfig.BASE_URL,
      method: 'get',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
    return await this.request.send<IProductResponse>(options)
  }

  @logStep('GET ALL/products via API')
  async getAll(token: string, params?: Record<string, string>) {
    const options: IRequestOptions = {
      baseURL: apiConfig.BASE_URL,
      url:
        apiConfig.ENDPOINTS.PRODUCTS +
        (params ? convertRequestParams(params) : ''),
      method: 'get',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
    return await this.request.send<IProductsResponse>(options)
  }

  @logStep('UPDATE/product via API')
  async update(data: { id: string; token: string; productData: IProduct }) {
    const options: IRequestOptions = {
      baseURL: apiConfig.BASE_URL,
      url: apiConfig.ENDPOINTS.PRODUCT_BY_ID(data.id),
      method: 'put',
      headers: {
        'content-type': 'application/json',
        Authorization: data.token,
      },
      data: data.productData,
    }
    return await this.request.send<IProductResponse>(options)
  }

  @logStep('DELETE/product via API')
  async delete(id: string, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.BASE_URL,
      url: apiConfig.ENDPOINTS.PRODUCT_BY_ID(id),
      method: 'delete',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    console.log(options)
    return await this.request.send<null>(options)
  }
}
