import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
});

// Routes that should NEVER trigger a refresh attempt
const AUTH_ROUTES = ['/auth/refresh', '/auth/login', '/auth/register', '/auth/logout'];

axiosInstance.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;
    const isAuthRoute     = AUTH_ROUTES.some((route) => originalRequest.url?.includes(route));

    // Only attempt refresh if:
    // 1. Status is 401
    // 2. We haven't already retried
    // 3. It's NOT an auth route itself
    if (error.response?.status === 401 && !originalRequest._retry && !isAuthRoute) {
      originalRequest._retry = true;

      try {
        await axiosInstance.post('/auth/refresh');
        return axiosInstance(originalRequest);
      } catch {
        // Refresh failed — only redirect if user was trying a protected action
        // Do NOT redirect for public routes like fetchProfile on page load
        const isProtectedAction = originalRequest.url &&
          !originalRequest.url.includes('/users/profile') &&
          !originalRequest.url.includes('/products') &&
          !originalRequest.url.includes('/users/recommendations');

        if (isProtectedAction) {
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;