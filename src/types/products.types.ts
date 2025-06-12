import { MANUFACTURERS } from 'data/products/manufacturers.data'
import { productsSortField, IResponseFields, sortDirection } from './api.types'

export interface IProduct {
  name: string
  price: number
  manufacturer: MANUFACTURERS
  amount: number
  notes?: string
}

export interface IProductFromResponse extends IProduct {
  _id: string
  createdOn: string
}

export interface IProductResponse extends IResponseFields {
  Product: IProductFromResponse
}

export interface IProductsResponse extends IResponseFields {
  Products: IProductFromResponse[]
  sorting: {
    sortField: productsSortField
    sortOrder: sortDirection
  }
}
