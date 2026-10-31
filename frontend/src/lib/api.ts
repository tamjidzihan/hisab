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

// Request interceptor: attach token from localStorage if available
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    try {
      const token = localStorage.getItem('hisab_auth_token')
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`
      }
    } catch {
      // Ignore localStorage errors
    }
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
      // Never use window.location.href to avoid browser reload loops.
      // React Router ProtectedRoute handles redirection inside React context.
      console.warn('API request returned 401 Unauthorized.')
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

