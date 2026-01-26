import { onMounted, watch } from 'vue'
import { useNotification } from './useNotification'
import type { RawMaterial, Order } from '../types'

const STORAGE_KEY_NOTIFIED_MATERIALS = 'produceflow_notified_materials'
const STORAGE_KEY_NOTIFIED_ORDERS = 'produceflow_notified_orders'

const loadNotifiedSet = (key: string): Set<string> => {
  try {
    const stored = localStorage.getItem(key)
    return stored ? new Set(JSON.parse(stored)) : new Set()
  } catch {
    return new Set()
  }
}

const saveNotifiedSet = (key: string, set: Set<string>) => {
  try {
    localStorage.setItem(key, JSON.stringify(Array.from(set)))
  } catch (error) {
    console.error(`Failed to save ${key} to storage:`, error)
  }
}

export function useWarningNotifications() {
  const { addNotification } = useNotification()
  const notifiedMaterials = loadNotifiedSet(STORAGE_KEY_NOTIFIED_MATERIALS)
  const notifiedOrders = loadNotifiedSet(STORAGE_KEY_NOTIFIED_ORDERS)

  /**
   * Check raw materials for critical levels and expiry
   */
  const checkMaterialWarnings = (materials: RawMaterial[]) => {
    materials.forEach((material) => {
      // Check for critical low stock
      if (material.quantity < material.minStockLevel * 0.25) {
        if (!notifiedMaterials.has(`critical-${material.id}`)) {
          addNotification(
            'error',
            `Критический уровень: ${material.name}`,
            `Осталось ${material.quantity} ${material.unit} (минимум: ${material.minStockLevel})`,
          )
          notifiedMaterials.add(`critical-${material.id}`)
          saveNotifiedSet(STORAGE_KEY_NOTIFIED_MATERIALS, notifiedMaterials)
        }
      }
      // Check for expiry date
      else if (material.expiryDate) {
        const expiryDate = new Date(material.expiryDate)
        const today = new Date()
        const daysUntilExpiry = Math.floor(
          (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
        )

        if (daysUntilExpiry <= 7 && daysUntilExpiry > 0) {
          if (!notifiedMaterials.has(`expiry-${material.id}`)) {
            addNotification(
              'warning',
              `Истечение срока: ${material.name}`,
              `Товар истекает через ${daysUntilExpiry} дней`,
            )
            notifiedMaterials.add(`expiry-${material.id}`)
            saveNotifiedSet(STORAGE_KEY_NOTIFIED_MATERIALS, notifiedMaterials)
          }
        } else if (daysUntilExpiry <= 0) {
          if (!notifiedMaterials.has(`expired-${material.id}`)) {
            addNotification(
              'error',
              `Просроченный товар: ${material.name}`,
              'Материал истек, требуется немедленная утилизация',
            )
            notifiedMaterials.add(`expired-${material.id}`)
            saveNotifiedSet(STORAGE_KEY_NOTIFIED_MATERIALS, notifiedMaterials)
          }
        }
      }
    })
  }

  /**
   * Check for overdue and delayed orders
   */
  const checkOrderWarnings = (orders: Order[]) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    orders.forEach((order) => {
      const dueDate = new Date(order.dueDate)
      dueDate.setHours(0, 0, 0, 0)

      const daysOverdue = Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24))

      // Check for overdue orders
      if (daysOverdue > 0 && (order.status === 'принят' || order.status === 'в производстве')) {
        if (!notifiedOrders.has(`overdue-${order.id}`)) {
          const urgency = daysOverdue > 3 ? 'error' : 'warning'
          addNotification(
            urgency,
            `Заказ просрочен: ${order.orderNumber}`,
            `${order.customerName} - просрочка ${daysOverdue} дня(й)`,
          )
          notifiedOrders.add(`overdue-${order.id}`)
          saveNotifiedSet(STORAGE_KEY_NOTIFIED_ORDERS, notifiedOrders)
        }
      }

      // Check for orders ready to ship
      if (order.status === 'на складе') {
        if (!notifiedOrders.has(`ready-${order.id}`)) {
          addNotification(
            'info',
            `Заказ готов к отгрузке: ${order.orderNumber}`,
            `${order.customerName} - все товары готовы`,
          )
          notifiedOrders.add(`ready-${order.id}`)
          saveNotifiedSet(STORAGE_KEY_NOTIFIED_ORDERS, notifiedOrders)
        }
      }
    })
  }

  /**
   * Check for upcoming low stock (predicted in 3 days)
   */
  const checkStockPrewarnings = (materials: RawMaterial[]) => {
    materials.forEach((material) => {
      // Simple prediction: if consumption rate would deplete stock in 3 days
      if (material.quantity > 0 && material.quantity < material.minStockLevel) {
        const percentageOfMin = (material.quantity / material.minStockLevel) * 100

        if (percentageOfMin < 50 && percentageOfMin >= 25) {
          if (!notifiedMaterials.has(`warning-${material.id}`)) {
            addNotification(
              'warning',
              `Низкий запас: ${material.name}`,
              `Осталось ${material.quantity} ${material.unit}, рекомендуется заказ`,
            )
            notifiedMaterials.add(`warning-${material.id}`)
            saveNotifiedSet(STORAGE_KEY_NOTIFIED_MATERIALS, notifiedMaterials)
          }
        }
      }
    })
  }

  return {
    checkMaterialWarnings,
    checkOrderWarnings,
    checkStockPrewarnings,
  }
}
