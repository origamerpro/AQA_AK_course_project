import { customerSchema } from './customer.schema'
import { productOrderSchema } from 'data/schemas/product.schema'
import { COUNTRIES } from 'data/customers/countries.data'
import { DELIVERY } from 'data/orders/delivery'
import { ORDER_STATUS } from 'data/orders/statuses'

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
}

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
}

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
}

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
}

export const orderSchema = {
  type: 'object',
  properties: {
    _id: { type: 'string' },
    status: {
      type: 'string',
      enum: Object.values(ORDER_STATUS),
    },
    customer: customerSchema,
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
}

export const orderListSchema = {
  type: 'array',
  items: orderSchema,
}
