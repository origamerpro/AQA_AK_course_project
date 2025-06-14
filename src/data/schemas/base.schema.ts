export const baseSchemaPart = {
  IsSuccess: {
    type: 'boolean',
  },
  ErrorMessage: {
    type: ['string', 'null'],
  },
};

export const sortingSchemaPart = {
  sortField: {
    type: 'string',
  },
  sortOrder: {
    type: 'string',
    enum: ['asc', 'desc'],
  },
};

export const customersMetaSchema = {
  total: { type: 'number' },
  page: { type: 'number' },
  limit: { type: 'number' },
  search: { type: 'string' },
  country: {
    type: 'array',
    items: { type: 'string' },
  },
};

export const productsMetaSchema = {
  total: { type: 'number' },
  page: { type: 'number' },
  limit: { type: 'number' },
  search: { type: 'string' },
  manufacturer: {
    type: 'array',
    items: { type: 'string' },
  },
};
