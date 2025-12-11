<template>
  <div class="space-y-8">
    <div>
      <h1 class="text-4xl font-bold text-slate-900">Финансовый контроль</h1>
      <p class="text-slate-600 mt-2">Управление доходами, расходами и бюджетом</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-sm">
        <p class="text-green-100 text-sm mb-2">Общий доход</p>
        <p class="text-4xl font-bold">₽{{ totalIncome.toFixed(2) }}</p>
        <p class="text-green-100 text-sm mt-2">+{{ incomeRecords.length }} операций</p>
      </div>
      
      <div class="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white shadow-sm">
        <p class="text-red-100 text-sm mb-2">Общие расходы</p>
        <p class="text-4xl font-bold">₽{{ totalExpense.toFixed(2) }}</p>
        <p class="text-red-100 text-sm mt-2">+{{ expenseRecords.length }} операций</p>
      </div>

      <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-sm" :class="{ 'from-slate-500 to-slate-600': netBalance < 0 }">
        <p class="text-blue-100 text-sm mb-2">Чистый баланс</p>
        <p class="text-4xl font-bold">₽{{ netBalance.toFixed(2) }}</p>
        <p :class="['text-sm mt-2', netBalance >= 0 ? 'text-blue-100' : 'text-slate-100']">
          {{ netBalance >= 0 ? '✓ Прибыль' : '⚠ Убыток' }}
        </p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 class="text-lg font-semibold text-slate-900 mb-6">История транзакций</h2>
        
        <div class="space-y-3">
          <div
            v-for="record in financialRecords"
            :key="record.id"
            class="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition"
          >
            <div class="flex items-center gap-4">
              <div :class="['w-12 h-12 rounded-lg flex items-center justify-center', record.type === 'income' ? 'bg-green-100' : 'bg-red-100']">
                <svg :class="['w-6 h-6', record.type === 'income' ? 'text-green-600' : 'text-red-600']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    :d="record.type === 'income'
                      ? 'M12 6v6m0 0v6m0-6h6m-6 0H6'
                      : 'M20 12H4'"
                  "
                  />
                </svg>
              </div>
              <div>
                <p class="font-medium text-slate-900">{{ record.description }}</p>
                <p class="text-xs text-slate-600 mt-1">{{ record.date }} • {{ record.category }}</p>
              </div>
            </div>
            <div class="text-right">
              <p :class="['font-bold text-lg', record.type === 'income' ? 'text-green-600' : 'text-red-600']">
                {{ record.type === 'income' ? '+' : '-' }}₽{{ record.amount.toFixed(2) }}
              </p>
              <p class="text-xs text-slate-600 mt-1">{{ record.reference }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="space-y-6">
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 class="text-lg font-semibold text-slate-900 mb-4">По категориям</h3>
          
          <div class="space-y-3">
            <div
              v-for="category in expenseCategories"
              :key="category.name"
              class="p-3 rounded-lg bg-slate-50"
            >
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-medium text-slate-700">{{ category.name }}</span>
                <span class="font-semibold text-slate-900">₽{{ category.amount.toFixed(2) }}</span>
              </div>
              <div class="w-full bg-slate-200 rounded-full h-2">
                <div
                  class="bg-red-600 h-2 rounded-full"
                  :style="{ width: (category.amount / totalExpense) * 100 + '%' }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 class="text-lg font-semibold text-slate-900 mb-4">Источники дохода</h3>
          
          <div class="space-y-3">
            <div class="flex items-center justify-between p-3 rounded-lg bg-green-50">
              <span class="text-sm font-medium text-green-700">Продажи</span>
              <span class="font-semibold text-green-900">₽{{ totalIncome.toFixed(2) }}</span>
            </div>
            <div class="flex items-center justify-between p-3 rounded-lg bg-slate-100">
              <span class="text-sm font-medium text-slate-700">Прочее</span>
              <span class="font-semibold text-slate-900">₽0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { financialRecords } from '../data/mockData'

const incomeRecords = computed(() => financialRecords.filter(r => r.type === 'income'))
const expenseRecords = computed(() => financialRecords.filter(r => r.type === 'expense'))

const totalIncome = computed(() => incomeRecords.value.reduce((sum, r) => sum + r.amount, 0))
const totalExpense = computed(() => expenseRecords.value.reduce((sum, r) => sum + r.amount, 0))
const netBalance = computed(() => totalIncome.value - totalExpense.value)

const expenseCategories = computed(() => {
  const categories: Record<string, number> = {}
  expenseRecords.value.forEach(record => {
    categories[record.category] = (categories[record.category] || 0) + record.amount
  })
  return Object.entries(categories).map(([name, amount]) => ({ name, amount })).sort((a, b) => b.amount - a.amount)
})
</script>