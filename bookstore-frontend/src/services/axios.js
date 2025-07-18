import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://bookstore-management-system-9im0.onrender.com/api",
});

api.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (
        !error.config.url.includes("/auth/login") &&
        !error.config.url.includes("/auth/register")
      ) {
        console.log(
          "401 Unauthorized response received. Clearing tokens and redirecting."
        );
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
      }
    }
    return Promise.reject(error);
  }
);

export default api;
