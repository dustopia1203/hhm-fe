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
    PRODUCT_RESOURCE: {
      GET_PRODUCT_BY_ID: "/api/products/{id}"
    },
    SHOP_RESOURCE: {
        GET_SHOP_BY_ID: "/api/shops/{id}",
        GET_MY_SHOP: "/api/shops/my",
        CREATE_MY_SHOP: "/api/shops"
    }
}

export default resourceUrls;
