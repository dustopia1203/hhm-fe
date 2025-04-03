import axios from 'axios';

const baseUrl = "http://localhost:8080";

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

    if (response.status === 401 && !config._retry) {
      config._retry = true;

      try {
        const refreshToken = localStorage.getItem("refresh_token");

        if (!refreshToken) {
          return Promise.reject(error);
        } else {
          const { data } = await axios.post(`${baseUrl}/refresh-token`, { refreshToken });

          localStorage.setItem("access_token", data.accessToken);

          config.headers.Authorization = `Bearer ${data.accessToken}`;

          return authClient(config);
        }
      } catch (error) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");

        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
)

export { publicClient, authClient };
