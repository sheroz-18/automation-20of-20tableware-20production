import { ref, computed } from 'vue'
import type { CartItem } from './useCart'

export interface ShippingAddress {
  name: string
  phone: string
  address: string
  regionId: string
  regionName: string
}

export interface Order {
  id: string
  userId: string
  items: CartItem[]
  subtotal: number
  shippingCost: number
  total: number
  shippingAddress: ShippingAddress
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  createdAt: string
  updatedAt: string
}

const orders = ref<Order[]>(loadOrders())

function loadOrders(): Order[] {
  const stored = localStorage.getItem('customerOrders')
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch (e) {
      return []
    }
  }
  return []
}

function saveOrders() {
  localStorage.setItem('customerOrders', JSON.stringify(orders.value))
}

// Create new order
function createOrder(
  userId: string,
  items: CartItem[],
  subtotal: number,
  shippingCost: number,
  shippingAddress: ShippingAddress,
): Order {
  const order: Order = {
    id: `ORD-${Date.now()}`,
    userId,
    items: [...items],
    subtotal,
    shippingCost,
    total: subtotal + shippingCost,
    shippingAddress,
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  orders.value.push(order)
  saveOrders()

  return order
}

// Get order by ID
function getOrderById(orderId: string): Order | undefined {
  return orders.value.find((o) => o.id === orderId)
}

// Get user orders
function getUserOrders(userId: string): Order[] {
  return orders.value.filter((o) => o.userId === userId)
}

// Update order status
function updateOrderStatus(orderId: string, status: Order['status']) {
  const order = getOrderById(orderId)
  if (order) {
    order.status = status
    order.updatedAt = new Date().toISOString()
    saveOrders()
  }
}

// Get orders by status
function getOrdersByStatus(userId: string, status: Order['status']): Order[] {
  return getUserOrders(userId).filter((o) => o.status === status)
}

// Get pending orders
function getPendingOrders(userId: string): Order[] {
  return getOrdersByStatus(userId, 'pending')
}

// Get shipped orders
function getShippedOrders(userId: string): Order[] {
  return getOrdersByStatus(userId, 'shipped')
}

// Get delivered orders
function getDeliveredOrders(userId: string): Order[] {
  return getOrdersByStatus(userId, 'delivered')
}

// Cancel order
function cancelOrder(orderId: string): boolean {
  const order = getOrderById(orderId)
  if (order && (order.status === 'pending' || order.status === 'confirmed')) {
    order.status = 'cancelled'
    order.updatedAt = new Date().toISOString()
    saveOrders()
    return true
  }
  return false
}

// Get order statistics
function getOrderStatistics(userId: string) {
  const userOrders = getUserOrders(userId)

  return {
    total: userOrders.length,
    pending: userOrders.filter((o) => o.status === 'pending').length,
    confirmed: userOrders.filter((o) => o.status === 'confirmed').length,
    shipped: userOrders.filter((o) => o.status === 'shipped').length,
    delivered: userOrders.filter((o) => o.status === 'delivered').length,
    cancelled: userOrders.filter((o) => o.status === 'cancelled').length,
    totalSpent: userOrders
      .filter((o) => o.status !== 'cancelled')
      .reduce((sum, o) => sum + o.total, 0),
  }
}

export function useCustomerOrders() {
  return {
    // State
    orders: computed(() => orders.value),

    // Methods
    createOrder,
    getOrderById,
    getUserOrders,
    updateOrderStatus,
    getOrdersByStatus,
    getPendingOrders,
    getShippedOrders,
    getDeliveredOrders,
    cancelOrder,
    getOrderStatistics,
  }
}
