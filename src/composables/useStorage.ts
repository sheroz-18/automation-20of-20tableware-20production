import { ref, watch } from 'vue'
import type { Ref } from 'vue'

const STORAGE_KEY_PRODUCTS = 'produceflow_products'
const STORAGE_KEY_ORDERS = 'produceflow_orders'
const STORAGE_KEY_INVENTORY = 'produceflow_inventory'
const STORAGE_KEY_FINANCE = 'produceflow_finance'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useStorage() {
  const isInitialized = ref(false)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const loadFromStorage = <T>(key: string, defaultValue: T): T => {
    try {
      const stored = localStorage.getItem(key)
      return stored ? JSON.parse(stored) : defaultValue
    } catch {
      return defaultValue
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const saveToStorage = <T>(key: string, value: T) => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error('Failed to save to storage:', error)
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const initializeStorage = (
    products: Ref<any[]>,
    orders: Ref<any[]>,
    inventory: Ref<any[]>,
    finance: Ref<any[]>,
  ) => {
    const storedProducts = loadFromStorage(STORAGE_KEY_PRODUCTS, null)
    const storedOrders = loadFromStorage(STORAGE_KEY_ORDERS, null)
    const storedInventory = loadFromStorage(STORAGE_KEY_INVENTORY, null)
    const storedFinance = loadFromStorage(STORAGE_KEY_FINANCE, null)

    if (storedProducts && Array.isArray(storedProducts)) {
      const arr = storedProducts as any[]
      products.value.splice(0, products.value.length, ...arr)
    } else {
      saveToStorage(STORAGE_KEY_PRODUCTS, products.value)
    }

    if (storedOrders && Array.isArray(storedOrders)) {
      const arr = storedOrders as any[]
      orders.value.splice(0, orders.value.length, ...arr)
    } else {
      saveToStorage(STORAGE_KEY_ORDERS, orders.value)
    }

    if (storedInventory && Array.isArray(storedInventory)) {
      const arr = storedInventory as any[]
      inventory.value.splice(0, inventory.value.length, ...arr)
    } else {
      saveToStorage(STORAGE_KEY_INVENTORY, inventory.value)
    }

    if (storedFinance && Array.isArray(storedFinance)) {
      const arr = storedFinance as any[]
      finance.value.splice(0, finance.value.length, ...arr)
    } else {
      saveToStorage(STORAGE_KEY_FINANCE, finance.value)
    }

    isInitialized.value = true
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const watchForChanges = (
    products: Ref<any[]>,
    orders: Ref<any[]>,
    inventory: Ref<any[]>,
    finance: Ref<any[]>,
  ) => {
    watch(products, (newVal) => saveToStorage(STORAGE_KEY_PRODUCTS, newVal), { deep: true })
    watch(orders, (newVal) => saveToStorage(STORAGE_KEY_ORDERS, newVal), { deep: true })
    watch(inventory, (newVal) => saveToStorage(STORAGE_KEY_INVENTORY, newVal), { deep: true })
    watch(finance, (newVal) => saveToStorage(STORAGE_KEY_FINANCE, newVal), { deep: true })
  }

  return {
    isInitialized,
    loadFromStorage,
    saveToStorage,
    initializeStorage,
    watchForChanges,
  }
}
