import { computed } from 'vue'
import { useAppState } from './useAppState'
import type { Product, Order, FinancialRecord, ProductionBatch } from '../types'

export function useAnalytics() {
  const { products, orders, financialRecords, productionBatches, inventory } = useAppState()

  // Прибыль по типам товара
  const profitByProduct = computed(() => {
    const productProfits: Record<string, { name: string; revenue: number; cost: number; profit: number }> = {}

    // Считаем доход по товарам
    orders.value.forEach((order) => {
      order.items.forEach((item) => {
        if (!productProfits[item.productId]) {
          const product = products.value.find((p) => p.id === item.productId)
          productProfits[item.productId] = {
            name: item.productName,
            revenue: 0,
            cost: 0,
            profit: 0,
          }
        }
        const product = products.value.find((p) => p.id === item.productId)
        productProfits[item.productId].revenue += item.subtotal
        if (product) {
          productProfits[item.productId].cost += product.unitCost * item.quantity
        }
      })
    })

    // Вычисляем прибыль
    Object.keys(productProfits).forEach((productId) => {
      productProfits[productId].profit =
        productProfits[productId].revenue - productProfits[productId].cost
    })

    return Object.values(productProfits)
      .sort((a, b) => b.profit - a.profit)
      .slice(0, 10)
  })

  // Рентабельность по партиям
  const batchProfitability = computed(() => {
    return productionBatches.value.map((batch) => {
      const cost = (batch.quantity * (products.value.find((p) => p.id === batch.productId)?.unitCost || 0))

      // Находим связанные заказы
      const relatedOrderItems = orders.value.flatMap((order) =>
        order.items.filter((item) => item.productId === batch.productId)
      )

      const revenue = relatedOrderItems.reduce((sum, item) => sum + item.subtotal, 0)
      const profit = revenue - cost
      const profitMargin = revenue > 0 ? ((profit / revenue) * 100).toFixed(1) : 0

      return {
        batchNumber: batch.batchNumber,
        productName: batch.productName,
        quantity: batch.quantity,
        cost: cost.toFixed(2),
        revenue: revenue.toFixed(2),
        profit: profit.toFixed(2),
        profitMargin: profitMargin,
        status: batch.status,
        startDate: batch.startDate,
        endDate: batch.endDate,
      }
    })
  })

  // Анализ выполнения сроков заказов
  const orderPerformance = computed(() => {
    const today = new Date()

    return orders.value.map((order) => {
      const dueDate = new Date(order.dueDate)
      const createdDate = new Date(order.createdDate)
      const daysPlanned = Math.ceil((dueDate.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24))

      let daysUsed = daysPlanned
      let onTime = true
      let daysOverdue = 0

      if (order.status === 'отправлен' || order.status === 'получен') {
        daysUsed = Math.ceil((today.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24))
        onTime = daysUsed <= daysPlanned
        if (!onTime) {
          daysOverdue = daysUsed - daysPlanned
        }
      } else if (today > dueDate) {
        onTime = false
        daysOverdue = Math.ceil((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24))
      }

      return {
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        daysPlanned,
        daysUsed,
        onTime,
        daysOverdue,
        status: order.status,
        totalAmount: order.totalAmount,
      }
    })
  })

  // Скорость оборота товара (turnover rate)
  const inventoryTurnover = computed(() => {
    return products.value.map((product) => {
      // Количество продано в этот период
      const unitsSold = orders.value
        .flatMap((order) => order.items)
        .filter((item) => item.productId === product.id)
        .reduce((sum, item) => sum + item.quantity, 0)

      // Средний запас
      const currentInventory = inventory.value.find((inv) => inv.productId === product.id)?.quantity || product.quantity

      // Скорость оборота (раз в период)
      const turnoverRate = currentInventory > 0 ? (unitsSold / currentInventory).toFixed(2) : '0'

      // Дни хранения = 365 / turnover rate
      const daysInStock = parseFloat(turnoverRate) > 0 ? (365 / parseFloat(turnoverRate)).toFixed(0) : '0'

      return {
        productName: product.name,
        sku: product.sku,
        unitsSold,
        currentStock: currentInventory,
        turnoverRate: parseFloat(turnoverRate),
        daysInStock: parseInt(daysInStock),
        category: product.category,
      }
    }).sort((a, b) => b.turnoverRate - a.turnoverRate)
  })

  // Финансовые метрики
  const financialMetrics = computed(() => {
    const totalIncome = financialRecords.value
      .filter((r) => r.type === 'income')
      .reduce((sum, r) => sum + r.amount, 0)

    const totalExpense = financialRecords.value
      .filter((r) => r.type === 'expense')
      .reduce((sum, r) => sum + r.amount, 0)

    const profit = totalIncome - totalExpense
    const profitMargin = totalIncome > 0 ? ((profit / totalIncome) * 100).toFixed(2) : '0'

    // Расходы по категориям
    const expensesByCategory: Record<string, number> = {}
    financialRecords.value
      .filter((r) => r.type === 'expense')
      .forEach((r) => {
        expensesByCategory[r.category] = (expensesByCategory[r.category] || 0) + r.amount
      })

    // Доход по категориям
    const incomeByCategory: Record<string, number> = {}
    financialRecords.value
      .filter((r) => r.type === 'income')
      .forEach((r) => {
        incomeByCategory[r.category] = (incomeByCategory[r.category] || 0) + r.amount
      })

    return {
      totalIncome: totalIncome.toFixed(2),
      totalExpense: totalExpense.toFixed(2),
      profit: profit.toFixed(2),
      profitMargin: profitMargin,
      expensesByCategory,
      incomeByCategory,
    }
  })

  // Статистика по статусам заказов
  const orderStatusStats = computed(() => {
    const stats: Record<string, number> = {}
    orders.value.forEach((order) => {
      stats[order.status] = (stats[order.status] || 0) + 1
    })
    return stats
  })

  // Лучшие и худшие товары по прибыльности
  const topBottomProducts = computed(() => {
    const products = profitByProduct.value
    return {
      top: products.slice(0, 5),
      bottom: products.slice(-5).reverse(),
    }
  })

  // Средняя производительность по срокам
  const performanceMetrics = computed(() => {
    const performance = orderPerformance.value
    const onTimeOrders = performance.filter((p) => p.onTime).length
    const totalOrders = performance.length
    const onTimeRate = totalOrders > 0 ? ((onTimeOrders / totalOrders) * 100).toFixed(1) : '0'
    const avgDaysOverdue =
      performance.length > 0
        ? (performance.reduce((sum, p) => sum + p.daysOverdue, 0) / performance.length).toFixed(1)
        : '0'

    return {
      totalOrders,
      onTimeOrders,
      onTimeRate: parseFloat(onTimeRate),
      avgDaysOverdue: parseFloat(avgDaysOverdue),
    }
  })

  return {
    profitByProduct,
    batchProfitability,
    orderPerformance,
    inventoryTurnover,
    financialMetrics,
    orderStatusStats,
    topBottomProducts,
    performanceMetrics,
  }
}
