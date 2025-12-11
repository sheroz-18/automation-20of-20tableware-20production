import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import Inventory from '../views/Inventory.vue'
import Products from '../views/Products.vue'
import Orders from '../views/Orders.vue'
import Finance from '../views/Finance.vue'
import Analytics from '../views/Analytics.vue'
import ProductionPlanning from '../views/ProductionPlanning.vue'
import Warehouse from '../views/Warehouse.vue'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
  },
  {
    path: '/inventory',
    name: 'Inventory',
    component: Inventory,
  },
  {
    path: '/products',
    name: 'Products',
    component: Products,
  },
  {
    path: '/orders',
    name: 'Orders',
    component: Orders,
  },
  {
    path: '/finance',
    name: 'Finance',
    component: Finance,
  },
  {
    path: '/analytics',
    name: 'Analytics',
    component: Analytics,
  },
  {
    path: '/production-planning',
    name: 'ProductionPlanning',
    component: ProductionPlanning,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
