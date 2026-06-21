// API Configuration
// Uses environment variable for base URL, falls back to localhost for development

export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH_REGISTER: `${API_BASE_URL}/api/auth/register`,
  AUTH_LOGIN: `${API_BASE_URL}/api/auth/login`,
  AUTH_LOGOUT: `${API_BASE_URL}/api/auth/logout`,
  AUTH_CHECK: `${API_BASE_URL}/api/auth/check-auth`,
  AUTH_FORGOT_PASSWORD: `${API_BASE_URL}/api/auth/forgot-password`,
  AUTH_RESET_PASSWORD: `${API_BASE_URL}/api/auth/reset-password`,
};
