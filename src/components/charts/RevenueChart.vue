<template>
  <div class="bg-white rounded-lg shadow border border-slate-200 p-6">
    <div class="mb-4">
      <h3 class="text-lg font-semibold text-slate-900">Финансовая аналитика</h3>
      <p class="text-sm text-slate-600">Доход и расходы за период</p>
    </div>

    <div class="grid grid-cols-2 gap-4 mb-6">
      <div class="bg-green-50 border border-green-200 rounded-lg p-4">
        <p class="text-sm text-green-700 font-medium">Доход</p>
        <p class="text-2xl font-bold text-green-900">ЅМ{{ totalIncome.toFixed(0) }}</p>
        <p class="text-xs text-green-600 mt-1">{{ incomeRecords.length }} операций</p>
      </div>
      <div class="bg-red-50 border border-red-200 rounded-lg p-4">
        <p class="text-sm text-red-700 font-medium">Расходы</p>
        <p class="text-2xl font-bold text-red-900">ЅМ{{ totalExpense.toFixed(0) }}</p>
        <p class="text-xs text-red-600 mt-1">{{ expenseRecords.length }} операций</p>
      </div>
    </div>

    <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <p class="text-sm text-blue-700 font-medium">Чистая прибыль</p>
      <p :class="netProfit >= 0 ? 'text-green-900' : 'text-red-900'" class="text-2xl font-bold">
        ЅМ{{ netProfit.toFixed(0) }}
      </p>
      <p class="text-xs text-blue-600 mt-1">
        {{ ((netProfit / totalIncome) * 100).toFixed(1) }}% рентабельность
      </p>
    </div>

    <div class="mb-4">
      <h4 class="font-semibold text-slate-900 mb-3">Доход по категориям</h4>
      <div class="space-y-3">
        <div
          v-for="category in incomeByCategory"
          :key="category.category"
          class="flex items-center gap-3"
        >
          <div class="flex-1">
            <div class="flex justify-between mb-1">
              <span class="text-sm font-medium text-slate-900">{{ category.category }}</span>
              <span class="text-sm font-medium text-slate-900">ЅМ{{ category.amount.toFixed(2) }}</span>
            </div>
            <div class="w-full bg-slate-200 rounded-full h-2">
              <div
                :style="{ width: getPercentage(category.amount, totalIncome) + '%' }"
                class="bg-blue-500 h-2 rounded-full"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div>
      <h4 class="font-semibold text-slate-900 mb-3">Расходы по категориям</h4>
      <div class="space-y-3">
        <div
          v-for="category in expenseByCategory"
          :key="category.category"
          class="flex items-center gap-3"
        >
          <div class="flex-1">
            <div class="flex justify-between mb-1">
              <span class="text-sm font-medium text-slate-900">{{ category.category }}</span>
              <span class="text-sm font-medium text-slate-900">ЅМ{{ category.amount.toFixed(2) }}</span>
            </div>
            <div class="w-full bg-slate-200 rounded-full h-2">
              <div
                :style="{ width: getPercentage(category.amount, totalExpense) + '%' }"
                class="bg-red-500 h-2 rounded-full"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { FinancialRecord } from '../../types'

interface Props {
  records: FinancialRecord[]
}

const props = defineProps<Props>()

const incomeRecords = computed(() => props.records.filter((r) => r.type === 'income'))
const expenseRecords = computed(() => props.records.filter((r) => r.type === 'expense'))

const totalIncome = computed(() => incomeRecords.value.reduce((sum, r) => sum + r.amount, 0))
const totalExpense = computed(() => expenseRecords.value.reduce((sum, r) => sum + r.amount, 0))
const netProfit = computed(() => totalIncome.value - totalExpense.value)

const incomeByCategory = computed(() => {
  const categories: Record<string, number> = {}
  incomeRecords.value.forEach((record) => {
    categories[record.category] = (categories[record.category] || 0) + record.amount
  })
  return Object.entries(categories)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount)
})

const expenseByCategory = computed(() => {
  const categories: Record<string, number> = {}
  expenseRecords.value.forEach((record) => {
    categories[record.category] = (categories[record.category] || 0) + record.amount
  })
  return Object.entries(categories)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount)
})

const getPercentage = (amount: number, total: number) => {
  return total > 0 ? (amount / total) * 100 : 0
}
</script>
