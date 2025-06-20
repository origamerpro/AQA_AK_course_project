import { COUNTRIES } from 'data/customers/countries.data';
import {
  baseSchemaPart,
  customersMetaSchema,
  sortingSchemaPart,
} from 'data/schemas/base.schema';
import { productOrderSchema } from 'data/schemas/product.schema';
import { DELIVERY } from 'data/orders/delivery.data';
import { ORDER_STATUS } from 'data/orders/statuses.data';

export const customerSchema = {
  type: 'object',
  properties: {
    _id: {
      type: 'string',
    },
    email: {
      type: 'string',
    },
    name: {
      type: 'string',
    },
    city: {
      type: 'string',
    },
    house: {
      type: 'number',
    },
    flat: {
      type: 'number',
    },
    street: {
      type: 'string',
    },
    phone: {
      type: 'string',
    },
    country: {
      type: 'string',
      enum: Object.values(COUNTRIES),
    },
    createdOn: {
      type: 'string',
    },
    notes: {
      type: 'string',
    },
  },
  required: [
    '_id',
    'email',
    'name',
    'country',
    'street',
    'city',
    'createdOn',
    'house',
    'flat',
    'phone',
  ],
};

export const oneCustomerSchema = {
  type: 'object',
  properties: {
    Customer: {
      ...customerSchema,
    },
    ...baseSchemaPart,
  },
  required: ['Customer', 'IsSuccess', 'ErrorMessage'],
};

export const allCustomersResponseSchema = {
  type: 'object',
  properties: {
    Customers: {
      type: 'array',
      items: customerSchema,
    },
    ...baseSchemaPart,
  },
  required: ['Customers', 'IsSuccess', 'ErrorMessage'],
};

export const customersListSchema = {
  type: 'object',
  properties: {
    Customers: {
      type: 'array',
      items: customerSchema,
    },
    sorting: {
      type: 'object',
      properties: sortingSchemaPart,
      required: ['sortField', 'sortOrder'],
    },
    ...customersMetaSchema,
    ...baseSchemaPart,
  },
  required: [
    'Customers',
    'sorting',
    'IsSuccess',
    'ErrorMessage',
    'total',
    'page',
    'limit',
    'search',
    'country',
  ],
};

export const addressSchema = {
  type: 'object',
  properties: {
    country: {
      type: 'string',
      enum: Object.values(COUNTRIES),
    },
    city: { type: 'string' },
    street: { type: 'string' },
    house: { type: 'number' },
    flat: { type: 'number' },
  },
  required: ['country', 'city', 'street', 'house', 'flat'],
};

const deliverySchema = {
  type: 'object',
  properties: {
    finalDate: {
      type: 'string',
      format: 'date',
    },
    condition: {
      type: 'string',
      enum: Object.values(DELIVERY),
    },
    address: addressSchema,
  },
  required: ['finalDate', 'condition', 'address'],
};

const commentSchema = {
  type: 'object',
  properties: {
    _id: { type: 'string' },
    text: { type: 'string' },
    createdOn: {
      type: 'string',
      format: 'date-time',
    },
  },
  required: ['_id', 'text', 'createdOn'],
};

const historySchema = {
  type: 'object',
  properties: {
    status: {
      type: 'string',
      enum: Object.values(ORDER_STATUS),
    },
    customer: { type: 'string' },
    products: {
      type: 'array',
      items: productOrderSchema,
    },
    total_price: { type: 'number' },
    action: { type: 'string' },
    changedOn: {
      type: 'string',
      format: 'date-time',
    },
  },
  required: [
    'status',
    'customer',
    'products',
    'total_price',
    'action',
    'changedOn',
  ],
};

export const customerAssociatedOrdersSchema = {
  type: 'object',
  properties: {
    _id: { type: 'string' },
    status: {
      type: 'string',
      enum: Object.values(ORDER_STATUS),
    },
    customer: {
      type: 'string',
    },
    customerSchema,
    products: {
      type: 'array',
      items: productOrderSchema,
    },
    total_price: { type: 'number' },
    createdOn: {
      type: 'string',
      format: 'date-time',
    },
    delivery: {
      anyOf: [deliverySchema, { type: 'null' }],
    },
    comments: {
      type: 'array',
      items: commentSchema,
    },
    history: {
      type: 'array',
      items: historySchema,
    },
  },
  required: [
    '_id',
    'status',
    'customer',
    'products',
    'total_price',
    'createdOn',
  ],
};

export const orderListSchema = {
  type: 'array',
  items: customerAssociatedOrdersSchema,
};
