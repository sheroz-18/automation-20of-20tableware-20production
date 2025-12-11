import { ref, watch, onMounted } from 'vue'
import {
  orders as mockOrders,
  products as mockProducts,
  financialRecords as mockFinance,
  inventoryItems as mockInventory,
  productionBatches as mockProductionBatches,
} from '../data/mockData'
import type { Order, Product, FinancialRecord, InventoryItem, ProductionBatch } from '../types'

const STORAGE_KEY_PRODUCTS = 'produceflow_products'
const STORAGE_KEY_ORDERS = 'produceflow_orders'
const STORAGE_KEY_INVENTORY = 'produceflow_inventory'
const STORAGE_KEY_FINANCE = 'produceflow_finance'
const STORAGE_KEY_PRODUCTION_BATCHES = 'produceflow_production_batches'

let isInitialized = false

const products = ref<Product[]>([])
const orders = ref<Order[]>([])
const inventory = ref<InventoryItem[]>([])
const financialRecords = ref<FinancialRecord[]>([])
const productionBatches = ref<ProductionBatch[]>([])

const loadFromStorage = <T>(key: string, defaultValue: T[]): T[] => {
  try {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : defaultValue
  } catch {
    return defaultValue
  }
}

const saveToStorage = <T>(key: string, value: T[]) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`Failed to save ${key} to storage:`, error)
  }
}

const initializeAppState = () => {
  if (isInitialized) return

  products.value = loadFromStorage(STORAGE_KEY_PRODUCTS, mockProducts)
  orders.value = loadFromStorage(STORAGE_KEY_ORDERS, mockOrders)
  inventory.value = loadFromStorage(STORAGE_KEY_INVENTORY, mockInventory)
  financialRecords.value = loadFromStorage(STORAGE_KEY_FINANCE, mockFinance)
  productionBatches.value = loadFromStorage(STORAGE_KEY_PRODUCTION_BATCHES, mockProductionBatches)

  watch(products, (newVal) => saveToStorage(STORAGE_KEY_PRODUCTS, newVal), { deep: true })
  watch(orders, (newVal) => saveToStorage(STORAGE_KEY_ORDERS, newVal), { deep: true })
  watch(inventory, (newVal) => saveToStorage(STORAGE_KEY_INVENTORY, newVal), { deep: true })
  watch(financialRecords, (newVal) => saveToStorage(STORAGE_KEY_FINANCE, newVal), { deep: true })
  watch(productionBatches, (newVal) => saveToStorage(STORAGE_KEY_PRODUCTION_BATCHES, newVal), { deep: true })

  isInitialized = true
}

export function useAppState() {
  onMounted(() => {
    initializeAppState()
  })

  return {
    products,
    orders,
    inventory,
    financialRecords,
  }
}
