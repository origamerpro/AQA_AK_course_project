import { STATUS_CODES } from 'data/statusCodes';
import { generateDeliveryData } from './generateDeliveryData.data';
import { COUNTRIES } from 'data/customers/countries.data';
import { DELIVERY } from './delivery.data';

export const positiveTestCasesForDelivery = [
  {
    name: 'Full valid delivery data',
    data: generateDeliveryData(),
    expectedStatusCode: STATUS_CODES.OK,
    isSuccess: true,
    errorMessage: null,
  },
  {
    name: '1-char city',
    data: generateDeliveryData({ address: { city: 'd' } }),
    expectedStatusCode: STATUS_CODES.OK,
    isSuccess: true,
    errorMessage: null,
  },
  {
    name: '1-char street',
    data: generateDeliveryData({ address: { street: 'P' } }),
    expectedStatusCode: STATUS_CODES.OK,
    isSuccess: true,
    errorMessage: null,
  },
  {
    name: 'min value in house (house = 1)',
    data: generateDeliveryData({ address: { house: 1 } }),
    expectedStatusCode: STATUS_CODES.OK,
    isSuccess: true,
    errorMessage: null,
  },
  {
    name: 'min value in flat (flat = 1)',
    data: generateDeliveryData({ address: { flat: 1 } }),
    expectedStatusCode: STATUS_CODES.OK,
    isSuccess: true,
    errorMessage: null,
  },
  {
    name: '20-char City (max)',
    data: generateDeliveryData({ address: { city: 'this textconsistsymb' } }),
    expectedStatusCode: STATUS_CODES.OK,
    isSuccess: true,
    errorMessage: null,
  },
  {
    name: '40-char Street (max)',
    data: generateDeliveryData({
      address: { street: 'Anastasiasu percalifragilisticnamesurnam' },
    }),
    expectedStatusCode: STATUS_CODES.OK,
    isSuccess: true,
    errorMessage: null,
  },
  {
    name: 'house = 999 (max)',
    data: generateDeliveryData({
      address: { house: 999 },
    }),
    expectedStatusCode: STATUS_CODES.OK,
    isSuccess: true,
    errorMessage: null,
  },
  {
    name: 'flat = 9999 (max)',
    data: generateDeliveryData({
      address: { flat: 9999 },
    }),
    expectedStatusCode: STATUS_CODES.OK,
    isSuccess: true,
    errorMessage: null,
  },
];

export const negativeTestCasesForDelivery = [
  {
    name: 'Country is not from the suggested list',
    data: generateDeliveryData({
      address: { country: 'Australia' as unknown as COUNTRIES },
    }),
    expectedStatusCode: STATUS_CODES.BAD_REQUEST,
    isSuccess: false,
    errorMessage: 'Incorrect request body',
  },
  {
    name: 'Delivery type is not from the suggested list',
    data: generateDeliveryData({ condition: 'nothing' as unknown as DELIVERY }),
    expectedStatusCode: STATUS_CODES.BAD_REQUEST,
    isSuccess: false,
    errorMessage: 'Incorrect request body',
  },
  {
    name: 'City too long (21 chars)',
    data: generateDeliveryData({ address: { city: 'this textconsistsymbs' } }),
    expectedStatusCode: STATUS_CODES.BAD_REQUEST,
    isSuccess: false,
    errorMessage: 'Incorrect Delivery',
  },
  {
    name: 'City is empty',
    data: generateDeliveryData({ address: { city: '' } }),
    expectedStatusCode: STATUS_CODES.BAD_REQUEST,
    isSuccess: false,
    errorMessage: 'Incorrect Delivery',
  },
  {
    name: 'City consists numbers',
    data: generateDeliveryData({ address: { city: 'thistextconsistsym1' } }),
    expectedStatusCode: STATUS_CODES.BAD_REQUEST,
    isSuccess: false,
    errorMessage: 'Incorrect Delivery',
  },
  {
    name: 'Street too long (41 chars)',
    data: generateDeliveryData({
      address: {
        street: 'Anastasiasu percalifragilisticnamesurnaae',
      },
    }),
    expectedStatusCode: STATUS_CODES.BAD_REQUEST,
    isSuccess: false,
    errorMessage: 'Incorrect Delivery',
  },
  {
    name: 'Street is empty',
    data: generateDeliveryData({ address: { street: '' } }),
    expectedStatusCode: STATUS_CODES.BAD_REQUEST,
    isSuccess: false,
    errorMessage: 'Incorrect Delivery',
  },
  {
    name: 'Street with @',
    data: generateDeliveryData({
      address: { street: 'Anastasia@upercalifra' },
    }),
    expectedStatusCode: STATUS_CODES.BAD_REQUEST,
    isSuccess: false,
    errorMessage: 'Incorrect Delivery',
  },
  {
    name: 'house = 0',
    data: generateDeliveryData({ address: { house: 0 } }),
    expectedStatusCode: STATUS_CODES.BAD_REQUEST,
    isSuccess: false,
    errorMessage: 'Incorrect Delivery',
  },
  {
    name: 'house = 1000',
    data: generateDeliveryData({ address: { house: 1000 } }),
    expectedStatusCode: STATUS_CODES.BAD_REQUEST,
    isSuccess: false,
    errorMessage: 'Incorrect Delivery',
  },
  {
    name: 'flat = 0',
    data: generateDeliveryData({ address: { flat: 0 } }),
    expectedStatusCode: STATUS_CODES.BAD_REQUEST,
    isSuccess: false,
    errorMessage: 'Incorrect Delivery',
  },
  {
    name: 'flat = 10000',
    data: generateDeliveryData({ address: { flat: 10000 } }),
    expectedStatusCode: STATUS_CODES.BAD_REQUEST,
    isSuccess: false,
    errorMessage: 'Incorrect Delivery',
  },
  {
    name: 'flat is a string',
    data: generateDeliveryData({
      address: { flat: 'string' as unknown as number },
    }),
    expectedStatusCode: STATUS_CODES.BAD_REQUEST,
    isSuccess: false,
    errorMessage: 'Incorrect request body',
  },
  {
    name: 'finalDate is empty',
    data: generateDeliveryData({ finalDate: '' }),
    expectedStatusCode: STATUS_CODES.BAD_REQUEST,
    isSuccess: false,
    errorMessage: 'Invalid final date',
  },
  {
    name: 'invalid finalDate',
    data: generateDeliveryData({ finalDate: '30-04-2023' }),
    expectedStatusCode: STATUS_CODES.BAD_REQUEST,
    isSuccess: false,
    errorMessage: 'Invalid final date',
  },
];

export const negativeTestCasesForDeliveryWithoutToken = [
  {
    name: 'Missing auth token',
    data: generateDeliveryData(),
    invalidToken: '',
    expectedStatusCode: STATUS_CODES.UNAUTHORIZED,
    isSuccess: false,
    errorMessage: 'Not authorized',
  },
  {
    name: 'Invalid auth token',
    data: generateDeliveryData(),
    invalidToken: 'invalid_token',
    expectedStatusCode: STATUS_CODES.UNAUTHORIZED,
    isSuccess: false,
    errorMessage: 'Invalid access token',
  },
];
