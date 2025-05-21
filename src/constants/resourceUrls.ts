interface ResourceUrls {
  [resource: string]: {
    [api: string]: string,
  },
}

const resourceUrls: ResourceUrls = {
  ACCOUNT_RESOURCE: {
    REGISTER: "/api/account/register",
    ACTIVE_ACCOUNT: "/api/account/active",
    ACTIVE_ACCOUNT_BY_ID: "/api/account/{id}/active",
    RESEND_CODE: "/api/account/resend-code",
    LOGIN: "/api/account/authenticate",
    REFRESH_TOKEN: "/api/account/refresh-token",
    GET_PROFILE: "/api/account/profile",
  },
  CART_RESOURCE: {
    GET_MY_CART: "/api/carts/my",
    ADD_MY_CART: "/api/carts/my",
    DELETE_MY_CART: "/api/carts/my"
  },
  CATEGORY_RESOURCE: {
    SEARCH_CATEGORIES: "/api/categories/q",
    GET_TREE_BY_ID: "/api/categories/{id}"
  },
  ORDER_RESOURCE: {
    SEARCH_MY_ORDERS: "/api/orders/my/q",
    SEARCH_MY_SHOP_ORDERS: "/api/orders/my/shop/q",
    COD_PAYMENT_MY_ORDER: "/api/orders/my/payment/cod",
    REFUND_MY_ORDER: "/api/orders/my/{id}/refund",
    COMPLETED_MY_ORDER: "/api/orders/my/{id}/completed",
  },
  PRODUCT_RESOURCE: {
    SEARCH_PRODUCTS: "/api/products/q",
    GET_PRODUCT_BY_ID: "/api/products/{id}",
    CREATE_MY_SHOP_PRODUCT: "/api/products/my/shop",
    UPDATE_MY_SHOP_PRODUCT: "/api/products/my/shop/{id}",
    ACTIVE_MY_SHOP_PRODUCT: "/api/products/my/shop/active",
    INACTIVE_MY_SHOP_PRODUCT: "/api/products/my/shop/inactive",
    DELETE_MY_SHOP_PRODUCT: "/api/products/my/shop",
    CONFIRM_ORDER: "/api/shops/my/{orderId}/confirm",
    CONFIRM_ORDER_REFUND: "/api/shops/my/{orderId}/refund",
  },
  REVIEW_RESOURCE: {
    SEARCH_REVIEWS: "/api/reviews/q",
    CREATE_MY_REVIEW: "/api/reviews/my",
  },
  SHIPPING_RESOURCE: {
    SEARCH_SHIPPING: "/api/shipping/q"
  },
  SHOP_RESOURCE: {
    GET_SHOP_BY_ID: "/api/shops/{id}",
    GET_MY_SHOP: "/api/shops/my",
    CREATE_MY_SHOP: "/api/shops/my",
    UPDATE_MY_SHOP: "/api/shops/my"
  }
}

export default resourceUrls;
