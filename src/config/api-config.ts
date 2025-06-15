export const apiConfig = {
  BASE_URL: 'https://aqa-course-project.app',
  ENDPOINTS: {
    CUSTOMERS: '/api/customers',
    ALL_CUSTOMERS: '/api/customers/all',
    CUSTOMER_BY_ID: (id: string) => `/api/customers/${id}/`,
    PRODUCTS: '/api/products',
    ALL_PRODUCTS: '/api/products/all',
    PRODUCT_BY_ID: (id: string) => `/api/products/${id}/`,
    LOGIN: '/api/login',
    LOGOUT: '/api/logout',
  },
} as const;
