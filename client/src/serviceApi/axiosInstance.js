import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API,
});

//!  Request Interceptor (attach token)
axiosInstance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

//!  Optional: Response Interceptor (handle 401)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      sessionStorage.clear();
      window.location.href = "/"; // redirect to login
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
