import { ref, watch } from 'vue'

const STORAGE_KEY_PRODUCTS = 'produceflow_products'
const STORAGE_KEY_ORDERS = 'produceflow_orders'
const STORAGE_KEY_INVENTORY = 'produceflow_inventory'
const STORAGE_KEY_FINANCE = 'produceflow_finance'

export function useStorage() {
  const isInitialized = ref(false)

  const loadFromStorage = <T>(key: string, defaultValue: T): T => {
    try {
      const stored = localStorage.getItem(key)
      return stored ? JSON.parse(stored) : defaultValue
    } catch {
      return defaultValue
    }
  }

  const saveToStorage = <T>(key: string, value: T) => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error('Failed to save to storage:', error)
    }
  }

  const initializeStorage = (products: any, orders: any, inventory: any, finance: any) => {
    const storedProducts = loadFromStorage(STORAGE_KEY_PRODUCTS, [])
    const storedOrders = loadFromStorage(STORAGE_KEY_ORDERS, [])
    const storedInventory = loadFromStorage(STORAGE_KEY_INVENTORY, [])
    const storedFinance = loadFromStorage(STORAGE_KEY_FINANCE, [])

    if (storedProducts.length > 0) {
      products.splice(0, products.length, ...storedProducts)
    } else {
      saveToStorage(STORAGE_KEY_PRODUCTS, products)
    }

    if (storedOrders.length > 0) {
      orders.splice(0, orders.length, ...storedOrders)
    } else {
      saveToStorage(STORAGE_KEY_ORDERS, orders)
    }

    if (storedInventory.length > 0) {
      inventory.splice(0, inventory.length, ...storedInventory)
    } else {
      saveToStorage(STORAGE_KEY_INVENTORY, inventory)
    }

    if (storedFinance.length > 0) {
      finance.splice(0, finance.length, ...storedFinance)
    } else {
      saveToStorage(STORAGE_KEY_FINANCE, finance)
    }

    isInitialized.value = true
  }

  const watchForChanges = (products: any, orders: any, inventory: any, finance: any) => {
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
