<template>
  <div class="space-y-8">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-4xl font-bold text-slate-900">Отчёты и Аналитика</h1>
        <p class="text-slate-600 mt-2">Анализ финансов, производительности и прибыльности в реальном времени</p>
      </div>
      <div class="flex gap-3">
        <button
          @click="exportToExcel"
          class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold transition flex items-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Экспорт Excel
        </button>
        <button
          @click="exportToCSV"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition flex items-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Экспорт CSV
        </button>
        <button
          @click="printReport"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition flex items-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Печать
        </button>
      </div>
    </div>

    <!-- Финансовые метрики -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <p class="text-sm text-slate-600 mb-2">Общий доход</p>
        <p class="text-3xl font-bold text-green-600">{{ financialMetrics.totalIncome }}</p>
        <p class="text-xs text-slate-500 mt-2">Все продажи</p>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <p class="text-sm text-slate-600 mb-2">Общие расходы</p>
        <p class="text-3xl font-bold text-red-600">{{ financialMetrics.totalExpense }}</p>
        <p class="text-xs text-slate-500 mt-2">Производство + персонал</p>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <p class="text-sm text-slate-600 mb-2">Прибыль</p>
        <p class="text-3xl font-bold text-blue-600">{{ financialMetrics.profit }}</p>
        <p class="text-xs text-slate-500 mt-2">{{ financialMetrics.profitMargin }}% маржа</p>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <p class="text-sm text-slate-600 mb-2">Выполнение сроков</p>
        <p class="text-3xl font-bold text-purple-600">{{ performanceMetrics.onTimeRate }}%</p>
        <p class="text-xs text-slate-500 mt-2">Вовремя: {{ performanceMetrics.onTimeOrders }}/{{ performanceMetrics.totalOrders }}</p>
      </div>
    </div>

    <!-- Лучшие и худшие товары -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 class="text-lg font-semibold text-slate-900 mb-4">ТОП 5 прибыльных товаров</h3>
        <div class="space-y-3">
          <div
            v-for="(product, idx) in topBottomProducts.top"
            :key="idx"
            class="flex items-center justify-between p-3 rounded-lg bg-green-50 border border-green-200"
          >
            <div>
              <p class="font-medium text-slate-900">{{ product.name }}</p>
              <p class="text-xs text-slate-500">Доход: ${{ product.revenue.toFixed(2) }}</p>
            </div>
            <p class="font-bold text-green-600">+${{ product.profit.toFixed(2) }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 class="text-lg font-semibold text-slate-900 mb-4">ТОП 5 убыточных товаров</h3>
        <div class="space-y-3">
          <div
            v-for="(product, idx) in topBottomProducts.bottom"
            :key="idx"
            class="flex items-center justify-between p-3 rounded-lg bg-red-50 border border-red-200"
          >
            <div>
              <p class="font-medium text-slate-900">{{ product.name }}</p>
              <p class="text-xs text-slate-500">Доход: ${{ product.revenue.toFixed(2) }}</p>
            </div>
            <p class="font-bold text-red-600">{{ product.profit < 0 ? '-' : '' }}${{ Math.abs(product.profit).toFixed(2) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Таблица рентабельности партий -->
    <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div class="p-6 border-b border-slate-200">
        <h3 class="text-lg font-semibold text-slate-900">Рентабельность производственных партий</h3>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-slate-200 bg-slate-50">
              <th class="px-6 py-4 text-left text-sm font-semibold text-slate-900">Номер партии</th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-slate-900">Товар</th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-slate-900">Количество</th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-slate-900">Себестоимость</th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-slate-900">Доход</th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-slate-900">Прибыль</th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-slate-900">Маржа</th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-slate-900">Статус</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="batch in batchProfitability"
              :key="batch.batchNumber"
              class="border-b border-slate-200 hover:bg-slate-50 transition"
            >
              <td class="px-6 py-4">
                <code class="text-sm font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded">
                  {{ batch.batchNumber }}
                </code>
              </td>
              <td class="px-6 py-4">
                <p class="font-medium text-slate-900">{{ batch.productName }}</p>
              </td>
              <td class="px-6 py-4">
                <p class="text-slate-600">{{ batch.quantity }} шт</p>
              </td>
              <td class="px-6 py-4">
                <p class="text-slate-600">${{ batch.cost }}</p>
              </td>
              <td class="px-6 py-4">
                <p class="text-slate-600">${{ batch.revenue }}</p>
              </td>
              <td class="px-6 py-4">
                <p
                  :class="[
                    'font-semibold',
                    parseFloat(batch.profit) >= 0 ? 'text-green-600' : 'text-red-600',
                  ]"
                >
                  ${{ batch.profit }}
                </p>
              </td>
              <td class="px-6 py-4">
                <p
                  :class="[
                    'font-semibold',
                    parseFloat(batch.profitMargin) >= 0 ? 'text-green-600' : 'text-red-600',
                  ]"
                >
                  {{ batch.profitMargin }}%
                </p>
              </td>
              <td class="px-6 py-4">
                <span :class="getStatusBadge(batch.status)">
                  {{ getStatusLabel(batch.status) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Анализ выполнения сроков -->
    <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div class="p-6 border-b border-slate-200">
        <h3 class="text-lg font-semibold text-slate-900">Анализ выполнения сроков заказов</h3>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-slate-200 bg-slate-50">
              <th class="px-6 py-4 text-left text-sm font-semibold text-slate-900">Заказ</th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-slate-900">Клиент</th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-slate-900">Планирование (дн.)</th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-slate-900">Использовано (дн.)</th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-slate-900">Статус</th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-slate-900">Просрочка (дн.)</th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-slate-900">Сумма</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="perf in orderPerformance"
              :key="perf.orderNumber"
              class="border-b border-slate-200 hover:bg-slate-50 transition"
            >
              <td class="px-6 py-4">
                <code class="text-sm font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded">
                  {{ perf.orderNumber }}
                </code>
              </td>
              <td class="px-6 py-4">
                <p class="font-medium text-slate-900">{{ perf.customerName }}</p>
              </td>
              <td class="px-6 py-4">
                <p class="text-slate-600">{{ perf.daysPlanned }}</p>
              </td>
              <td class="px-6 py-4">
                <p class="text-slate-600">{{ perf.daysUsed }}</p>
              </td>
              <td class="px-6 py-4">
                <span :class="getOrderStatusBadge(perf.onTime)">
                  {{ perf.onTime ? 'Вовремя' : 'Просрочка' }}
                </span>
              </td>
              <td class="px-6 py-4">
                <p :class="perf.daysOverdue > 0 ? 'text-red-600 font-semibold' : 'text-slate-600'">
                  {{ perf.daysOverdue > 0 ? '+' + perf.daysOverdue : '0' }}
                </p>
              </td>
              <td class="px-6 py-4">
                <p class="font-semibold text-slate-900">${{ perf.totalAmount.toFixed(2) }}</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Скорость оборота товара -->
    <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div class="p-6 border-b border-slate-200">
        <h3 class="text-lg font-semibold text-slate-900">Скорость оборота товара (Inventory Turnover)</h3>
        <p class="text-sm text-slate-600 mt-2">
          Показатель того, как часто товар продаётся и пополняется
        </p>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-slate-200 bg-slate-50">
              <th class="px-6 py-4 text-left text-sm font-semibold text-slate-900">Товар</th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-slate-900">SKU</th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-slate-900">Категория</th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-slate-900">Продано</th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-slate-900">Текущий запас</th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-slate-900">Скорость оборота</th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-slate-900">Дни в запасе</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in inventoryTurnover.slice(0, 15)"
              :key="item.sku"
              class="border-b border-slate-200 hover:bg-slate-50 transition"
            >
              <td class="px-6 py-4">
                <p class="font-medium text-slate-900">{{ item.productName }}</p>
              </td>
              <td class="px-6 py-4">
                <code class="text-sm text-slate-600 bg-slate-100 px-2 py-1 rounded">
                  {{ item.sku }}
                </code>
              </td>
              <td class="px-6 py-4">
                <p class="text-sm text-slate-600">{{ item.category }}</p>
              </td>
              <td class="px-6 py-4">
                <p class="font-semibold text-slate-900">{{ item.unitsSold }} шт</p>
              </td>
              <td class="px-6 py-4">
                <p class="text-slate-600">{{ item.currentStock }} шт</p>
              </td>
              <td class="px-6 py-4">
                <span :class="getTurnoverBadge(item.turnoverRate)">
                  {{ item.turnoverRate.toFixed(2) }}x
                </span>
              </td>
              <td class="px-6 py-4">
                <p class="text-slate-600">{{ item.daysInStock }} дней</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Распределение расходов и доходов -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 class="text-lg font-semibold text-slate-900 mb-4">Распределение расходов</h3>
        <div class="space-y-3">
          <div
            v-for="(amount, category) in financialMetrics.expensesByCategory"
            :key="category"
            class="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200"
          >
            <span class="font-medium text-slate-900">{{ category }}</span>
            <span class="font-bold text-red-600">${{ amount.toFixed(2) }}</span>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 class="text-lg font-semibold text-slate-900 mb-4">Распределение доходов</h3>
        <div class="space-y-3">
          <div
            v-for="(amount, category) in financialMetrics.incomeByCategory"
            :key="category"
            class="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200"
          >
            <span class="font-medium text-slate-900">{{ category }}</span>
            <span class="font-bold text-green-600">${{ amount.toFixed(2) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Статистика по статусам заказов -->
    <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h3 class="text-lg font-semibold text-slate-900 mb-4">Статистика по статусам заказов</h3>
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div
          v-for="(count, status) in orderStatusStats"
          :key="status"
          class="text-center p-4 rounded-lg bg-slate-50 border border-slate-200"
        >
          <p class="text-xs text-slate-600 mb-2 capitalize">{{ status }}</p>
          <p class="text-3xl font-bold text-blue-600">{{ count }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAnalytics } from '../composables/useAnalytics'
import * as XLSX from 'xlsx'

const {
  profitByProduct,
  batchProfitability,
  orderPerformance,
  inventoryTurnover,
  financialMetrics,
  orderStatusStats,
  topBottomProducts,
  performanceMetrics,
} = useAnalytics()

const getStatusBadge = (status: string) => {
  const badges: Record<string, string> = {
    planning: 'px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium',
    in_progress: 'px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium',
    completed: 'px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium',
    cancelled: 'px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium',
  }
  return badges[status] || 'px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium'
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    planning: 'Планирование',
    in_progress: 'В производстве',
    completed: 'Завершено',
    cancelled: 'Отменено',
  }
  return labels[status] || status
}

const getOrderStatusBadge = (onTime: boolean) => {
  return onTime
    ? 'px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium'
    : 'px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium'
}

const getTurnoverBadge = (turnover: number) => {
  if (turnover > 2) {
    return 'px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium font-semibold'
  } else if (turnover > 1) {
    return 'px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium font-semibold'
  }
  return 'px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium font-semibold'
}

const exportToExcel = () => {
  const timestamp = new Date().toLocaleDateString('ru-RU')
  const workbook = XLSX.utils.book_new()

  // Лист 1: Финансовые метрики
  const financialData = [
    ['ФИНАНСОВЫЕ МЕТРИКИ'],
    [''],
    ['Показатель', 'Значение'],
    ['Общий доход', financialMetrics.totalIncome],
    ['Общие расходы', financialMetrics.totalExpense],
    ['Прибыль', financialMetrics.profit],
    ['Маржа прибыли', financialMetrics.profitMargin + '%'],
  ]
  const financialSheet = XLSX.utils.aoa_to_sheet(financialData)
  financialSheet['!cols'] = [{ wch: 25 }, { wch: 15 }]
  XLSX.utils.book_append_sheet(workbook, financialSheet, 'Финансы')

  // Лист 2: Рентабельность партий
  const batchData = [
    ['РЕНТАБЕЛЬНОСТЬ ПАРТИЙ'],
    [''],
    [
      'Номер партии',
      'Товар',
      'Количество',
      'Себестоимость',
      'Доход',
      'Прибыль',
      'Маржа',
      'Статус',
    ],
    ...batchProfitability.value.map((batch) => [
      batch.batchNumber,
      batch.productName,
      batch.quantity,
      parseFloat(batch.cost),
      parseFloat(batch.revenue),
      parseFloat(batch.profit),
      parseFloat(batch.profitMargin),
      batch.status,
    ]),
  ]
  const batchSheet = XLSX.utils.aoa_to_sheet(batchData)
  batchSheet['!cols'] = [
    { wch: 15 },
    { wch: 25 },
    { wch: 12 },
    { wch: 15 },
    { wch: 15 },
    { wch: 15 },
    { wch: 12 },
    { wch: 15 },
  ]
  XLSX.utils.book_append_sheet(workbook, batchSheet, 'Партии')

  // Лист 3: Выполнение сроков
  const performanceData = [
    ['ВЫПОЛНЕНИЕ СРОКОВ ЗАКАЗОВ'],
    [''],
    ['Заказ', 'Клиент', 'Планирование (дн.)', 'Использовано (дн.)', 'Статус', 'Просрочка (дн.)', 'Сумма'],
    ...orderPerformance.value.map((order) => [
      order.orderNumber,
      order.customerName,
      order.daysPlanned,
      order.daysUsed,
      order.onTime ? 'Вовремя' : 'Просрочка',
      order.daysOverdue,
      order.totalAmount,
    ]),
  ]
  const performanceSheet = XLSX.utils.aoa_to_sheet(performanceData)
  performanceSheet['!cols'] = [
    { wch: 15 },
    { wch: 25 },
    { wch: 15 },
    { wch: 15 },
    { wch: 12 },
    { wch: 15 },
    { wch: 12 },
  ]
  XLSX.utils.book_append_sheet(workbook, performanceSheet, 'Заказы')

  // Лист 4: Оборот товара
  const turnoverData = [
    ['СКОРОСТЬ ОБОРОТА ТОВАРА'],
    [''],
    [
      'Товар',
      'SKU',
      'Категория',
      'Продано (шт)',
      'Текущий запас (шт)',
      'Скорость оборота',
      'Дни в запасе',
    ],
    ...inventoryTurnover.value.slice(0, 15).map((item) => [
      item.productName,
      item.sku,
      item.category,
      item.unitsSold,
      item.currentStock,
      item.turnoverRate,
      item.daysInStock,
    ]),
  ]
  const turnoverSheet = XLSX.utils.aoa_to_sheet(turnoverData)
  turnoverSheet['!cols'] = [
    { wch: 25 },
    { wch: 12 },
    { wch: 15 },
    { wch: 12 },
    { wch: 15 },
    { wch: 15 },
    { wch: 12 },
  ]
  XLSX.utils.book_append_sheet(workbook, turnoverSheet, 'Оборот')

  // Лист 5: Распределение расходов
  const expenseData = [
    ['РАСПРЕДЕЛЕНИЕ РАСХОДОВ'],
    [''],
    ['Категория', 'Сумма'],
    ...Object.entries(financialMetrics.expensesByCategory).map(([category, amount]) => [
      category,
      amount,
    ]),
  ]
  const expenseSheet = XLSX.utils.aoa_to_sheet(expenseData)
  expenseSheet['!cols'] = [{ wch: 25 }, { wch: 15 }]
  XLSX.utils.book_append_sheet(workbook, expenseSheet, 'Расходы')

  // Лист 6: Распределение доходов
  const incomeData = [
    ['РАСПРЕДЕЛЕНИЕ ДОХОДОВ'],
    [''],
    ['Категория', 'Сумма'],
    ...Object.entries(financialMetrics.incomeByCategory).map(([category, amount]) => [
      category,
      amount,
    ]),
  ]
  const incomeSheet = XLSX.utils.aoa_to_sheet(incomeData)
  incomeSheet['!cols'] = [{ wch: 25 }, { wch: 15 }]
  XLSX.utils.book_append_sheet(workbook, incomeSheet, 'Доходы')

  // Сохранение файла
  XLSX.writeFile(workbook, `analytics-report-${timestamp}.xlsx`)
}

const exportToCSV = () => {
  const timestamp = new Date().toLocaleDateString('ru-RU')

  // Функция для экранирования CSV значений
  const escapeCSV = (value: string | number): string => {
    const stringValue = String(value)
    // Если значение содержит запятую, кавычку или новую строку, оборачиваем в кавычки
    if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
      return `"${stringValue.replace(/"/g, '""')}"`
    }
    return stringValue
  }

  // Подготовка данных для CSV
  let csvContent = 'ОТЧЁТ АНАЛИТИКИ\n'
  csvContent += `Дата: ${timestamp}\n\n`

  // Финансовые метрики
  csvContent += 'ФИНАНСОВЫЕ МЕТРИКИ\n'
  csvContent += `Общий доход,${escapeCSV(financialMetrics.totalIncome)}\n`
  csvContent += `Общие расходы,${escapeCSV(financialMetrics.totalExpense)}\n`
  csvContent += `Прибыль,${escapeCSV(financialMetrics.profit)}\n`
  csvContent += `Маржа прибыли,%,${escapeCSV(financialMetrics.profitMargin)}\n\n`

  // Таблица рентабельности партий
  csvContent += 'РЕНТАБЕЛЬНОСТЬ ПАРТИЙ\n'
  csvContent += 'Номер партии,Товар,Количество,Себестоимость,Доход,Прибыль,Маржа\n'
  batchProfitability.value.forEach((batch) => {
    csvContent += `${escapeCSV(batch.batchNumber)},${escapeCSV(batch.productName)},${escapeCSV(batch.quantity)},${escapeCSV(batch.cost)},${escapeCSV(batch.revenue)},${escapeCSV(batch.profit)},${escapeCSV(batch.profitMargin)}%\n`
  })
  csvContent += '\n'

  // Таблица выполнения сроков
  csvContent += 'ВЫПОЛНЕНИЕ СРОКОВ ЗАКАЗОВ\n'
  csvContent += 'Заказ,Клиент,Планирование,Использовано,Статус,Просрочка,Сумма\n'
  orderPerformance.value.forEach((order) => {
    const status = order.onTime ? 'Вовремя' : 'Просрочка'
    csvContent += `${escapeCSV(order.orderNumber)},${escapeCSV(order.customerName)},${escapeCSV(order.daysPlanned)},${escapeCSV(order.daysUsed)},${escapeCSV(status)},${escapeCSV(order.daysOverdue)},$${escapeCSV(order.totalAmount.toFixed(2))}\n`
  })
  csvContent += '\n'

  // Таблица оборота товара
  csvContent += 'СКОРОСТЬ ОБОРОТА ТОВАРА\n'
  csvContent += 'Товар,SKU,Категория,Продано,Текущий запас,Скорость оборота,Дни в запасе\n'
  inventoryTurnover.value.slice(0, 15).forEach((item) => {
    csvContent += `${escapeCSV(item.productName)},${escapeCSV(item.sku)},${escapeCSV(item.category)},${escapeCSV(item.unitsSold)},${escapeCSV(item.currentStock)},${escapeCSV(item.turnoverRate.toFixed(2))}x,${escapeCSV(item.daysInStock)}\n`
  })

  // Загрузка файла с правильной кодировкой UTF-8
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', `analytics-report-${timestamp}.csv`)
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

const printReport = () => {
  const printWindow = window.open('', '', 'width=900,height=800')
  if (printWindow) {
    const timestamp = new Date().toLocaleDateString('ru-RU')

    let htmlContent = `
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Отчёт аналитики</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
          h1 { color: #333; border-bottom: 3px solid #2563eb; padding-bottom: 10px; }
          h2 { color: #555; margin-top: 20px; margin-bottom: 10px; }
          table { width: 100%; border-collapse: collapse; margin: 15px 0; }
          th { background-color: #f3f4f6; padding: 10px; text-align: left; border: 1px solid #ddd; font-weight: bold; }
          td { padding: 10px; border: 1px solid #ddd; }
          tr:nth-child(even) { background-color: #f9fafb; }
          .metric { display: inline-block; margin: 10px 20px 10px 0; }
          .metric-value { font-size: 24px; font-weight: bold; color: #2563eb; }
          .metric-label { color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <h1>Отчёт аналитики - ${timestamp}</h1>

        <h2>Финансовые метрики</h2>
        <div class="metric">
          <div class="metric-label">Общий доход</div>
          <div class="metric-value">${financialMetrics.totalIncome}</div>
        </div>
        <div class="metric">
          <div class="metric-label">Общие расходы</div>
          <div class="metric-value">${financialMetrics.totalExpense}</div>
        </div>
        <div class="metric">
          <div class="metric-label">Прибыль</div>
          <div class="metric-value">${financialMetrics.profit}</div>
        </div>
        <div class="metric">
          <div class="metric-label">Маржа</div>
          <div class="metric-value">${financialMetrics.profitMargin}%</div>
        </div>

        <h2>Рентабельность партий</h2>
        <table>
          <tr>
            <th>Номер партии</th>
            <th>Товар</th>
            <th>Количество</th>
            <th>Доход</th>
            <th>Прибыль</th>
            <th>Маржа</th>
          </tr>
          ${batchProfitability.value
            .map(
              (batch) => `
            <tr>
              <td>${batch.batchNumber}</td>
              <td>${batch.productName}</td>
              <td>${batch.quantity}</td>
              <td>$${batch.revenue}</td>
              <td>$${batch.profit}</td>
              <td>${batch.profitMargin}%</td>
            </tr>
          `
            )
            .join('')}
        </table>

        <h2>Выполнение сроков заказов</h2>
        <table>
          <tr>
            <th>Заказ</th>
            <th>Клиент</th>
            <th>Статус</th>
            <th>Просрочка (дн.)</th>
            <th>Сумма</th>
          </tr>
          ${orderPerformance.value
            .map(
              (order) => `
            <tr>
              <td>${order.orderNumber}</td>
              <td>${order.customerName}</td>
              <td>${order.onTime ? 'Вовремя' : 'Просрочка'}</td>
              <td>${order.daysOverdue}</td>
              <td>$${order.totalAmount.toFixed(2)}</td>
            </tr>
          `
            )
            .join('')}
        </table>
      </body>
      </html>
    `

    printWindow.document.write(htmlContent)
    printWindow.document.close()
    setTimeout(() => {
      printWindow.print()
    }, 250)
  }
}
</script>
