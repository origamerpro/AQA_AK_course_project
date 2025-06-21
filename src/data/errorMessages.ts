export const ERROR_MESSAGES = {
  INCORRECT_REQUEST_BODY: 'Incorrect request body',
  NOT_AUTHORIZED: 'Not authorized',
  INVALID_ACCESS_TOKEN: 'Invalid access token',
  CUSTOMER_NOT_FOUND: (id: string) => `Customer with id '${id}' wasn't found`,
  CUSTOMER_ID_FOR_ORDERS_NOT_FOUND: (id: string) =>
    `Not found customer with ID: ${id}`,
  INVALID_ORDER_STATUS: 'Invalid order status',
  ORDER_NOT_FOUND: `Order with id 'undefined' wasn't found`,
  PRODUCT_IS_NOT_REQUESTED_IN_ORDER: (id: string) =>
    `Product with Id '${id}' is not requested`,
};
