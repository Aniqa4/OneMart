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

    const status = error.response?.status;
    if ((status !== 401 && status !== 403) || original._retry) {
      return Promise.reject(error);
    }

    // Only attempt refresh if this request was authenticated (had an access token).
    // Unauthenticated 401/403 (e.g. wrong password, unverified email on /signin)
    // are business-logic errors — pass them straight through.
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
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
      return Promise.reject(error);
    }

    try {
      const { data } = await axios.post(`${BASE_URL}/refresh-token`, { refreshToken });
      const payload = data.data ?? data;
      const newAccess: string | undefined =
        payload.accessToken ?? payload.token ?? payload.access_token;
      const newRefresh: string | undefined =
        payload.refreshToken ?? payload.refresh_token ?? refreshToken;
      if (!newAccess) throw new Error("refresh response missing access token");
      localStorage.setItem("accessToken", newAccess);
      localStorage.setItem("refreshToken", newRefresh as string);
      axiosInstance.defaults.headers.common.Authorization = `Bearer ${newAccess}`;
      original.headers.Authorization = `Bearer ${newAccess}`;
      flushQueue(null, newAccess);
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
