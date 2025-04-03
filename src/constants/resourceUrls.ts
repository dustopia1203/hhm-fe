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
    }
}

export default resourceUrls;
