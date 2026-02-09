import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

// Auth views
import LoginPage from '../views/auth/LoginPage.vue'
import RegisterPage from '../views/auth/RegisterPage.vue'

// Store views
import StorePage from '../views/store/StorePage.vue'

// Admin views
import Dashboard from '../views/admin/Dashboard.vue'
import Inventory from '../views/admin/Inventory.vue'
import Products from '../views/admin/Products.vue'
import Orders from '../views/admin/Orders.vue'
import Finance from '../views/admin/Finance.vue'
import Analytics from '../views/admin/Analytics.vue'
import ProductionPlanning from '../views/admin/ProductionPlanning.vue'
import Warehouse from '../views/admin/Warehouse.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
    meta: { layout: 'auth' },
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterPage,
    meta: { layout: 'auth' },
  },
  {
    path: '/store',
    name: 'Store',
    component: StorePage,
    meta: { requiresAuth: false },
  },
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: Dashboard,
    meta: { requiresAdmin: true },
  },
  {
    path: '/admin/inventory',
    name: 'AdminInventory',
    component: Inventory,
    meta: { requiresAdmin: true },
  },
  {
    path: '/admin/products',
    name: 'AdminProducts',
    component: Products,
    meta: { requiresAdmin: true },
  },
  {
    path: '/admin/orders',
    name: 'AdminOrders',
    component: Orders,
    meta: { requiresAdmin: true },
  },
  {
    path: '/admin/finance',
    name: 'AdminFinance',
    component: Finance,
    meta: { requiresAdmin: true },
  },
  {
    path: '/admin/analytics',
    name: 'AdminAnalytics',
    component: Analytics,
    meta: { requiresAdmin: true },
  },
  {
    path: '/admin/production-planning',
    name: 'AdminProductionPlanning',
    component: ProductionPlanning,
    meta: { requiresAdmin: true },
  },
  {
    path: '/admin/warehouse',
    name: 'AdminWarehouse',
    component: Warehouse,
    meta: { requiresAdmin: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Route guards for authentication
router.beforeEach((to, from, next) => {
  const { isLoggedIn, isAdmin } = useAuth()

  if (to.meta.requiresAdmin) {
    if (!isAdmin()) {
      next('/login')
      return
    }
  }

  if (to.meta.requiresAuth && !isLoggedIn()) {
    next('/login')
    return
  }

  // Redirect authenticated users away from auth pages
  if ((to.path === '/login' || to.path === '/register') && isLoggedIn()) {
    next('/store')
    return
  }

  next()
})

export default router
