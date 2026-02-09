import { ref, computed } from 'vue'

export interface User {
  id: string
  email: string
  name: string
  role: 'guest' | 'customer' | 'admin'
  createdAt: string
}

export interface AuthState {
  currentUser: User | null
  isLoggedIn: boolean
  token: string | null
}

const authState = ref<AuthState>({
  currentUser: null,
  isLoggedIn: false,
  token: null,
})

// Demo users stored in localStorage
const DEMO_USERS = [
  {
    id: 'admin_001',
    email: 'admin@posudapro.ru',
    password: 'admin123',
    name: 'Администратор',
    role: 'admin' as const,
    createdAt: new Date('2024-01-01').toISOString(),
  },
  {
    id: 'customer_001',
    email: 'customer@example.com',
    password: 'customer123',
    name: 'Иван Петров',
    role: 'customer' as const,
    createdAt: new Date('2024-01-15').toISOString(),
  },
]

// Initialize auth state from localStorage
function initAuthState() {
  const storedAuth = localStorage.getItem('auth')
  if (storedAuth) {
    try {
      const parsed = JSON.parse(storedAuth)
      authState.value = parsed
    } catch (e) {
      console.error('Failed to parse auth state:', e)
      resetAuthState()
    }
  }
}

// Save auth state to localStorage
function saveAuthState() {
  localStorage.setItem('auth', JSON.stringify(authState.value))
}

// Reset auth state
function resetAuthState() {
  authState.value = {
    currentUser: null,
    isLoggedIn: false,
    token: null,
  }
  localStorage.removeItem('auth')
}

// Get or create users list in localStorage
function getUsers() {
  const storedUsers = localStorage.getItem('users')
  if (storedUsers) {
    try {
      return JSON.parse(storedUsers)
    } catch (e) {
      return [...DEMO_USERS]
    }
  }
  // Initialize with demo users
  const users = [...DEMO_USERS]
  localStorage.setItem('users', JSON.stringify(users))
  return users
}

// Save users to localStorage
function saveUsers(users: any[]) {
  localStorage.setItem('users', JSON.stringify(users))
}

// Login method
function login(email: string, password: string): { success: boolean; error?: string } {
  const users = getUsers()
  const user = users.find((u: any) => u.email === email && u.password === password)

  if (!user) {
    return {
      success: false,
      error: 'Неправильный email или пароль',
    }
  }

  const { password: _, ...userWithoutPassword } = user
  const token = `token_${user.id}_${Date.now()}`

  authState.value = {
    currentUser: userWithoutPassword,
    isLoggedIn: true,
    token,
  }

  saveAuthState()
  return { success: true }
}

// Register method
function register(
  email: string,
  password: string,
  name: string,
): { success: boolean; error?: string } {
  const users = getUsers()

  // Check if user already exists
  if (users.find((u: any) => u.email === email)) {
    return {
      success: false,
      error: 'Пользователь с таким email уже существует',
    }
  }

  // Validate password
  if (password.length < 6) {
    return {
      success: false,
      error: 'Пароль должен быть не менее 6 символов',
    }
  }

  // Create new user
  const newUser = {
    id: `user_${Date.now()}`,
    email,
    password,
    name,
    role: 'customer' as const,
    createdAt: new Date().toISOString(),
  }

  users.push(newUser)
  saveUsers(users)

  // Auto-login after registration
  const { password: _, ...userWithoutPassword } = newUser
  const token = `token_${newUser.id}_${Date.now()}`

  authState.value = {
    currentUser: userWithoutPassword,
    isLoggedIn: true,
    token,
  }

  saveAuthState()
  return { success: true }
}

// Logout method
function logout() {
  resetAuthState()
}

// Get current user
function getCurrentUser(): User | null {
  return authState.value.currentUser || null
}

// Check if user is logged in
function isLoggedIn(): boolean {
  return authState.value.isLoggedIn
}

// Check if user is admin
function isAdmin(): boolean {
  return authState.value.currentUser?.role === 'admin' || false
}

// Check if user is customer
function isCustomer(): boolean {
  return authState.value.currentUser?.role === 'customer' || false
}

// Get user role
function getUserRole(): 'guest' | 'customer' | 'admin' | null {
  return authState.value.currentUser?.role || null
}

export function useAuth() {
  // Initialize on first use
  initAuthState()

  return {
    // State
    authState: computed(() => authState.value),
    currentUser: computed(() => authState.value.currentUser),

    // Methods
    login,
    register,
    logout,
    getCurrentUser,
    isLoggedIn,
    isAdmin,
    isCustomer,
    getUserRole,
  }
}
