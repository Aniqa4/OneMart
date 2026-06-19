import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// Queue of requests waiting for a token refresh
let isRefreshing = false;
let failedQueue: Array<{ resolve: (t: string) => void; reject: (e: unknown) => void }> = [];

const flushQueue = (err: unknown, token: string | null = null) => {
  failedQueue.forEach((p) => (err ? p.reject(err) : p.resolve(token!)));
  failedQueue = [];
};

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosInstance.interceptors.response.use(
  (r) => r,
  async (error) => {
    const original = error.config;

    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }

    // Another request is already refreshing — queue this one
    if (isRefreshing) {
      return new Promise<string>((resolve, reject) =>
        failedQueue.push({ resolve, reject })
      ).then((token) => {
        original.headers.Authorization = `Bearer ${token}`;
        return axiosInstance(original);
      });
    }

    original._retry = true;
    isRefreshing = true;

    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      localStorage.removeItem("accessToken");
      window.location.href = "/login";
      return Promise.reject(error);
    }

    try {
      const { data } = await axios.post(`${BASE_URL}/refresh-token`, { refreshToken });
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      axiosInstance.defaults.headers.common.Authorization = `Bearer ${data.accessToken}`;
      original.headers.Authorization = `Bearer ${data.accessToken}`;
      flushQueue(null, data.accessToken);
      return axiosInstance(original);
    } catch (err) {
      flushQueue(err, null);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      window.location.href = "/login";
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }
);

export default axiosInstance;
