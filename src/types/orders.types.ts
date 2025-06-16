import {
  IResponseFields,
  ordersSortField,
  sortDirection,
} from 'types/api.types';
import { ICustomerFromResponse } from 'types/customer.types';
import { IProductFromResponse } from 'types/products.types';
import { COUNTRIES } from 'data/customers/countries.data';
import { ORDER_STATUS } from 'data/orders/statuses';
import { DELIVERY, DELIVERY_LOCATION } from 'data/orders/delivery';
import { ORDER_HISTORY } from 'data/orders/history';

export interface IOrderRequestParams {
  search?: string;
  status?: ORDER_STATUS[];
  sortField?: ordersSortField;
  sortOrder?: sortDirection;
}

export interface IHistory {
  readonly action: ORDER_HISTORY;
  readonly status: string;
  readonly customer: string;
  readonly products: IProductFromResponse[];
  readonly delivery: IDelivery | null;
  readonly total_price: number;
  readonly changedOn: string;
}

export interface ICommentFromResponse {
  readonly _id: string;
  readonly text: string;
  readonly createdOn: string;
}

export interface IAddCommentRequest {
  comment: string;
}

export interface IOrderData {
  customer: string;
  products: string[];
}

export interface IOrderDataWithId extends IOrderData {
  _id: string;
}

export interface IOrderStatus {
  _id: string;
  status: ORDER_STATUS.CANCELED | ORDER_STATUS.IN_PROCESS;
}

export interface IOrder {
  readonly status: ORDER_STATUS;
  readonly customer: ICustomerFromResponse;
  readonly products: IProductFromOrder[];
  readonly delivery: IDelivery | null;
  readonly total_price: number;
  readonly createdOn: string;
  readonly history: IHistory[];
  readonly comments: ICommentFromResponse[];
}

export interface IOrderFromResponse extends IOrder {
  readonly _id: string;
}

export interface IOrderResponse extends IResponseFields {
  Order: IOrderFromResponse;
}

export interface IOrdersResponse extends IResponseFields {
  Orders: IOrderFromResponse[];
}

export interface IOrderFilteredResponse extends IResponseFields {
  Orders: IOrderFromResponse[];
  total: number;
  page: number;
  limit: number;
  search: string;
  status: ORDER_STATUS[];
  sorting: {
    sortField: ordersSortField;
    sortOrder: sortDirection;
  };
}

export interface IOrderFilterParams {
  search?: string;
  status?: ORDER_STATUS[];
  sortField?: ordersSortField;
  sortOrder?: sortDirection;
}

export interface IProductFromOrder extends IProductFromResponse {
  received: boolean;
}

export interface IDelivery {
  finalDate: string;
  condition: DELIVERY;
  location?: DELIVERY_LOCATION;
  address?: {
    country: COUNTRIES;
    city: string;
    street: string;
    house: number;
    flat: number;
  };
}
