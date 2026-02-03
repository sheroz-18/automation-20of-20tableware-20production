import { useAppState } from './useAppState'
import type { Order, FinancialRecord } from '../types'

export function useOrderManagement() {
  const { orders, financialRecords } = useAppState()

  const markOrderAsReceived = (orderId: string) => {
    const order = orders.value.find((o) => o.id === orderId)

    if (!order) {
      console.error('Order not found')
      return false
    }

    // Check if order is already received
    if (order.status === 'получен') {
      console.warn('Order is already marked as received')
      return false
    }

    // Update order status
    order.status = 'получен'

    // Add amount to financial records as income
    const financialRecord: FinancialRecord = {
      id: `fin_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      date: new Date().toISOString().split('T')[0],
      description: `Оплата заказа ${order.orderNumber}`,
      type: 'income',
      amount: order.totalAmount,
      category: 'Продажи',
      reference: order.id,
    }

    financialRecords.value.push(financialRecord)

    return true
  }

  const canMarkAsReceived = (order: Order): boolean => {
    return order.status !== 'получен'
  }

  const getReceivedOrdersTotal = (): number => {
    return orders.value
      .filter((order) => order.status === 'получен')
      .reduce((sum, order) => sum + order.totalAmount, 0)
  }

  return {
    markOrderAsReceived,
    canMarkAsReceived,
    getReceivedOrdersTotal,
  }
}
