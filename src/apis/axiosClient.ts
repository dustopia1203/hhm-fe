import axios from 'axios';
import useProfileStore from "@stores/useProfileStore.ts";

const baseUrl = import.meta.env.VITE_REACT_SERVER_URL;

const publicClient = axios.create({
  baseURL: baseUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
})

const authClient = axios.create({
  baseURL: baseUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
})

authClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem("access_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  error => Promise.reject(error)
);

authClient.interceptors.response.use(
  response => response,
  async (error) => {
    const config = error.config;
    const response = error.response;

    if (response.data.code === 403002 && !config._retry) {
      config._retry = true;

      try {
        const refreshToken = localStorage.getItem("refresh_token");
        const rememberMeString = localStorage.getItem("remember_me");

        const rememberMe = rememberMeString === "true";

        if (!refreshToken) {
          return Promise.reject(error);
        } else {
          const { data } = await publicClient.post("/api/account/refresh-token", { refreshToken, rememberMe });

          localStorage.setItem("access_token", data.data.accessToken);

          config.headers.Authorization = `Bearer ${data.data.accessToken}`;

          return authClient(config);
        }
      } catch (error) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");

        useProfileStore.getState().clearProfile();

        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
)

export { publicClient, authClient };
