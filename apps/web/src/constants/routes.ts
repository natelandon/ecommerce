export const ROUTES = {
  HOME: '/',
  CART: '/cart',
  CHECKOUT: '/checkout',
  LOGIN: '/login',
  SIGNUP: '/signup',
  PROFILE: '/profile',
  PRODUCTS: '/products',
  ORDER_SUCCESS: '/order-success',
} as const;

export const getProductRoute = (id: number | string) =>
  `${ROUTES.PRODUCTS}/${id}`;
export const getOrderSuccessRoute = (orderId: string) =>
  `${ROUTES.ORDER_SUCCESS}/${orderId}`;
