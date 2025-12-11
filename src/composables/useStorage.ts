import { ref, watch, isRef } from 'vue'

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

  const extractValue = (data: any) => {
    if (isRef(data)) {
      return data.value
    }
    return data
  }

  const saveToStorage = <T>(key: string, value: T) => {
    try {
      const dataToSave = extractValue(value)
      localStorage.setItem(key, JSON.stringify(dataToSave))
    } catch (error) {
      console.error('Failed to save to storage:', error)
    }
  }

  const initializeStorage = (products: any, orders: any, inventory: any, finance: any) => {
    const productsValue = extractValue(products)
    const ordersValue = extractValue(orders)
    const inventoryValue = extractValue(inventory)
    const financeValue = extractValue(finance)

    const storedProducts = loadFromStorage(STORAGE_KEY_PRODUCTS, [])
    const storedOrders = loadFromStorage(STORAGE_KEY_ORDERS, [])
    const storedInventory = loadFromStorage(STORAGE_KEY_INVENTORY, [])
    const storedFinance = loadFromStorage(STORAGE_KEY_FINANCE, [])

    if (storedProducts.length > 0 && Array.isArray(products)) {
      products.splice(0, products.length, ...storedProducts)
    } else if (Array.isArray(productsValue)) {
      saveToStorage(STORAGE_KEY_PRODUCTS, productsValue)
    }

    if (storedOrders.length > 0 && Array.isArray(orders)) {
      orders.splice(0, orders.length, ...storedOrders)
    } else if (Array.isArray(ordersValue)) {
      saveToStorage(STORAGE_KEY_ORDERS, ordersValue)
    }

    if (storedInventory.length > 0 && Array.isArray(inventory)) {
      inventory.splice(0, inventory.length, ...storedInventory)
    } else if (Array.isArray(inventoryValue)) {
      saveToStorage(STORAGE_KEY_INVENTORY, inventoryValue)
    }

    if (storedFinance.length > 0 && Array.isArray(finance)) {
      finance.splice(0, finance.length, ...storedFinance)
    } else if (Array.isArray(financeValue)) {
      saveToStorage(STORAGE_KEY_FINANCE, financeValue)
    }

    isInitialized.value = true
  }

  const watchForChanges = (products: any, orders: any, inventory: any, finance: any) => {
    if (products && products.length !== undefined) {
      watch(products, (newVal) => saveToStorage(STORAGE_KEY_PRODUCTS, newVal), { deep: true })
    }
    if (orders && orders.length !== undefined) {
      watch(orders, (newVal) => saveToStorage(STORAGE_KEY_ORDERS, newVal), { deep: true })
    }
    if (inventory && inventory.length !== undefined) {
      watch(inventory, (newVal) => saveToStorage(STORAGE_KEY_INVENTORY, newVal), { deep: true })
    }
    if (finance && finance.length !== undefined) {
      watch(finance, (newVal) => saveToStorage(STORAGE_KEY_FINANCE, newVal), { deep: true })
    }
  }

  return {
    isInitialized,
    loadFromStorage,
    saveToStorage,
    initializeStorage,
    watchForChanges,
  }
}
