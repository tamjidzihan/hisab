export interface AuthUser {
  id: string
  name: string
  email: string
  householdName: string
  baseCurrency: string
  role: string
  joinedDate: string
}

export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RegisterCredentials {
  name: string
  email: string
  householdName: string
  baseCurrency: string
  password: string
  confirmPassword: string
  acceptTerms: boolean
}

export interface AuthContextValue {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  register: (credentials: RegisterCredentials) => Promise<void>
  logout: () => Promise<void>
}

