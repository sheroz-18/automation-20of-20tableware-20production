import { useAppState } from './useAppState'
import type { FinancialRecord } from '../types'

export interface TransactionInput {
  description: string
  type: 'income' | 'expense'
  amount: number
  category: string
  reference: string
  date?: string
}

export function useFinancialTransaction() {
  const { financialRecords } = useAppState()

  /**
   * Create a new financial transaction
   */
  const createTransaction = (input: TransactionInput): FinancialRecord => {
    const newRecord: FinancialRecord = {
      id: `fin-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      date: input.date || new Date().toISOString().split('T')[0],
      description: input.description,
      type: input.type,
      amount: input.amount,
      category: input.category,
      reference: input.reference,
    }

    financialRecords.value.push(newRecord)
    return newRecord
  }

  /**
   * Create income transaction (for orders)
   */
  const createIncomeTransaction = (
    orderNumber: string,
    amount: number,
    customerName?: string,
  ): FinancialRecord => {
    return createTransaction({
      description: `Оплата заказа ${orderNumber}${customerName ? ` от ${customerName}` : ''}`,
      type: 'income',
      amount,
      category: 'Продажи',
      reference: orderNumber,
    })
  }

  /**
   * Create expense transaction (for production materials)
   */
  const createProductionExpense = (
    batchNumber: string,
    amount: number,
    productName: string,
  ): FinancialRecord => {
    return createTransaction({
      description: `Производство: ${productName} (партия ${batchNumber})`,
      type: 'expense',
      amount,
      category: 'Производство',
      reference: batchNumber,
    })
  }

  /**
   * Create expense transaction (for raw materials)
   */
  const createMaterialExpense = (
    materialName: string,
    quantity: number,
    unitCost: number,
    reference: string,
  ): FinancialRecord => {
    const totalCost = quantity * unitCost
    return createTransaction({
      description: `Закупка материала: ${materialName} (${quantity} ед.)`,
      type: 'expense',
      amount: totalCost,
      category: 'Производство',
      reference,
    })
  }

  /**
   * Create expense transaction (for inventory movements)
   */
  const createInventoryExpense = (
    productName: string,
    quantity: number,
    unitCost: number,
    reference: string,
  ): FinancialRecord => {
    const totalCost = quantity * unitCost
    return createTransaction({
      description: `Списание товара: ${productName} (${quantity} ед.)`,
      type: 'expense',
      amount: totalCost,
      category: 'Производство',
      reference,
    })
  }

  /**
   * Check if transaction already exists to avoid duplicates
   */
  const transactionExists = (reference: string, type: 'income' | 'expense'): boolean => {
    return financialRecords.value.some(
      (record) => record.reference === reference && record.type === type,
    )
  }

  /**
   * Get all transactions for a specific reference
   */
  const getTransactionsByReference = (reference: string): FinancialRecord[] => {
    return financialRecords.value.filter((record) => record.reference === reference)
  }

  /**
   * Delete transactions by reference
   */
  const deleteTransactionsByReference = (reference: string): void => {
    const indices = financialRecords.value
      .map((record, idx) => (record.reference === reference ? idx : -1))
      .filter((idx) => idx !== -1)
      .reverse()

    indices.forEach((idx) => {
      financialRecords.value.splice(idx, 1)
    })
  }

  return {
    createTransaction,
    createIncomeTransaction,
    createProductionExpense,
    createMaterialExpense,
    createInventoryExpense,
    transactionExists,
    getTransactionsByReference,
    deleteTransactionsByReference,
  }
}
