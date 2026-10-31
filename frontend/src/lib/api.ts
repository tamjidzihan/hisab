import axios, { AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

export interface ApiErrorResponse {
  success?: boolean
  message: string
  errors?: Record<string, string[]> | Array<{ field: string; message: string }>
  statusCode?: number
}

/**
 * Centralized Axios instance for Hisab.
 * Configured with HttpOnly cookie support and unified error normalization.
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Required for HttpOnly cookie sessions
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// Request interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Inject CSRF header or tracing ID if needed in the future
    return config
  },
  (error: unknown) => {
    return Promise.reject(error)
  }
)

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error: AxiosError<ApiErrorResponse>) => {
    const status = error.response?.status
    const customMessage = error.response?.data?.message

    if (status === 401) {
      // Do not redirect if already on login/register pages
      const currentPath = window.location.pathname
      if (!currentPath.includes('/login') && !currentPath.includes('/register')) {
        // Broadcast auth expiration or handle redirect gracefully
        console.warn('Session expired or unauthenticated request.')
      }
    }

    const normalizedError = {
      status,
      message: customMessage || error.message || 'An unexpected error occurred. Please try again.',
      details: error.response?.data?.errors,
    }

    return Promise.reject(normalizedError)
  }
)

export default apiClient

