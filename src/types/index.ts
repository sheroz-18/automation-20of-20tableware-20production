export interface Product {
  id: string
  name: string
  sku: string
  category: string
  quantity: number
  reorderLevel: number
  unitCost: number
  status: 'in_stock' | 'low_stock' | 'out_of_stock'
  lastUpdated: string
  image: string
  material: string
  size: string
  weight: number
}

export interface InventoryItem {
  id: string
  productId: string
  productName: string
  quantity: number
  location: string
  lastCounted: string
  variance: number
}

export interface Order {
  id: string
  orderNumber: string
  customerName: string
  items: OrderItem[]
  totalAmount: number
  status: 'pending' | 'processing' | 'completed' | 'shipped'
  createdDate: string
  dueDate: string
}

export interface OrderItem {
  productId: string
  productName: string
  quantity: number
  unitPrice: number
  subtotal: number
}

export interface FinancialRecord {
  id: string
  date: string
  description: string
  type: 'income' | 'expense'
  amount: number
  category: string
  reference: string
}

export interface DashboardMetrics {
  totalRevenue: number
  totalOrders: number
  activeInventory: number
  productionOutput: number
  revenueChange: number
  ordersChange: number
  inventoryChange: number
  productionChange: number
}

export interface ProductionBatch {
  id: string
  batchNumber: string
  productId: string
  productName: string
  quantity: number
  status: 'planning' | 'in_progress' | 'completed' | 'cancelled'
  startDate: string
  endDate: string
  createdDate: string
  category: string
}
