import { MANUFACTURERS } from 'data/products/manufacturers.data';
import { productsSortField, IResponseFields, sortDirection } from './api.types';

export interface IProduct {
  name: string;
  price: number;
  manufacturer: MANUFACTURERS;
  amount: number;
  notes?: string;
}

export interface IProductFromResponse extends IProduct {
  _id: string;
  createdOn: string;
}

export interface IProductResponse extends IResponseFields {
  Product: IProductFromResponse;
}

export interface IProductsAllResponse extends IResponseFields {
  Products: IProductFromResponse[];
}

export interface IProductsFilteredResponse extends IResponseFields {
  Products: IProductFromResponse[];
  total: number;
  page: number;
  limit: number;
  search: string;
  manufacturer: MANUFACTURERS[];
  sorting: {
    sortField: productsSortField;
    sortOrder: sortDirection;
  };
}

export interface IProductFilterParams {
  search?: string[];
  manufacturer?: MANUFACTURERS[];
  sortField?: productsSortField;
  sortOrder?: sortDirection;
  page?: number;
  limit?: number;
}
