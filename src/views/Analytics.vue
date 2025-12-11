<template>
  <div class="space-y-8">
    <div>
      <h1 class="text-4xl font-bold text-slate-900">Аналитика и отчеты</h1>
      <p class="text-slate-600 mt-2">Подробный анализ показателей производства</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <OrdersChart :orders="orders" />
      <RevenueChart :records="financialRecords" />
    </div>

    <div class="grid grid-cols-1 gap-6">
      <ProductionChart :batches="productionBatches" />
    </div>

    <div class="grid grid-cols-1 gap-6">
      <StockChart :materials="rawMaterials" />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <p class="text-gray-700 text-sm mb-2">Средний размер заказа</p>
        <p class="text-3xl font-bold text-slate-900">ЅМ{{ avgOrderValue.toFixed(2) }}</p>
        <p class="text-xs text-green-600 mt-2">+5.2% от прошлого месяца</p>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <p class="text-slate-600 text-sm mb-2">Скорость обработки</p>
        <p class="text-3xl font-bold text-slate-900">2.4 дн</p>
        <p class="text-xs text-green-600 mt-2">Выполнено в срок</p>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <p class="text-slate-600 text-sm mb-2">Оборот товаров</p>
        <p class="text-3xl font-bold text-slate-900">4.2x</p>
        <p class="text-xs text-blue-600 mt-2">В месяц</p>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <p class="text-slate-600 text-sm mb-2">Эффективность</p>
        <p class="text-3xl font-bold text-slate-900">87%</p>
        <p class="text-xs text-orange-600 mt-2">Процент выполнения плана</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 class="text-lg font-semibold text-slate-900 mb-6">Продажи по категориям</h2>

        <div class="space-y-4">
          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium text-gray-700">Тарелки (52%)</span>
              <span class="text-sm font-semibold text-slate-900">ЅМ1,918</span>
            </div>
            <div class="w-full bg-slate-200 rounded-full h-3">
              <div class="bg-blue-600 h-3 rounded-full" style="width: 52%"></div>
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium text-gray-700">Приборы (18%)</span>
              <span class="text-sm font-semibold text-slate-900">ЅМ665</span>
            </div>
            <div class="w-full bg-slate-200 rounded-full h-3">
              <div class="bg-green-600 h-3 rounded-full" style="width: 18%"></div>
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium text-gray-700">Чашки (16%)</span>
              <span class="text-sm font-semibold text-slate-900">ЅМ591</span>
            </div>
            <div class="w-full bg-slate-200 rounded-full h-3">
              <div class="bg-orange-600 h-3 rounded-full" style="width: 16%"></div>
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium text-gray-700">Кухонная утварь (9%)</span>
              <span class="text-sm font-semibold text-slate-900">ЅМ332</span>
            </div>
            <div class="w-full bg-slate-200 rounded-full h-3">
              <div class="bg-purple-600 h-3 rounded-full" style="width: 9%"></div>
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium text-gray-700">Миски (5%)</span>
              <span class="text-sm font-semibold text-slate-900">ЅМ185</span>
            </div>
            <div class="w-full bg-slate-200 rounded-full h-3">
              <div class="bg-cyan-600 h-3 rounded-full" style="width: 5%"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 class="text-lg font-semibold text-slate-900 mb-6">Ключевые показатели</h2>

        <div class="space-y-4">
          <div class="p-4 rounded-lg bg-blue-50 border border-blue-200">
            <div class="flex items-center justify-between">
              <span class="font-medium text-blue-900">Производительность</span>
              <span class="text-2xl font-bold text-blue-600">↑ 15.7%</span>
            </div>
            <p class="text-sm text-blue-700 mt-2">Увеличение объема производства</p>
          </div>

          <div class="p-4 rounded-lg bg-green-50 border border-green-200">
            <div class="flex items-center justify-between">
              <span class="font-medium text-green-900">Удовлетворение спроса</span>
              <span class="text-2xl font-bold text-green-600">↑ 12.3%</span>
            </div>
            <p class="text-sm text-green-700 mt-2">Выполнение заказов в срок</p>
          </div>

          <div class="p-4 rounded-lg bg-orange-50 border border-orange-200">
            <div class="flex items-center justify-between">
              <span class="font-medium text-orange-900">Затраты на единицу</span>
              <span class="text-2xl font-bold text-orange-600">↓ 8.5%</span>
            </div>
            <p class="text-sm text-orange-700 mt-2">Оптимизация производства</p>
          </div>

          <div class="p-4 rounded-lg bg-purple-50 border border-purple-200">
            <div class="flex items-center justify-between">
              <span class="font-medium text-purple-900">Рентабельность</span>
              <span class="text-2xl font-bold text-purple-600">-36%</span>
            </div>
            <p class="text-sm text-purple-700 mt-2">Требуется улучшение</p>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 class="text-lg font-semibold text-slate-900 mb-6">Лучшие продавцы</h2>

        <div class="space-y-3">
          <div class="flex items-center justify-between p-3 rounded-lg bg-slate-50">
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm"
              >
                1
              </div>
              <div>
                <p class="font-medium text-slate-900">Столовая ложка</p>
                <p class="text-xs text-gray-700">1200 продано</p>
              </div>
            </div>
            <span class="font-bold text-slate-900">ЅМ1,800</span>
          </div>

          <div class="flex items-center justify-between p-3 rounded-lg bg-slate-50">
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white font-bold text-sm"
              >
                2
              </div>
              <div>
                <p class="font-medium text-slate-900">Обеденная тарелка</p>
                <p class="text-xs text-gray-700">620 продано</p>
              </div>
            </div>
            <span class="font-bold text-slate-900">ЅМ2,604</span>
          </div>

          <div class="flex items-center justify-between p-3 rounded-lg bg-slate-50">
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 rounded-full bg-orange-600 flex items-center justify-center text-white font-bold text-sm"
              >
                3
              </div>
              <div>
                <p class="font-medium text-slate-900">Фарфоровая чашка</p>
                <p class="text-xs text-gray-700">200 продано</p>
              </div>
            </div>
            <span class="font-bold text-slate-900">ЅМ640</span>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 class="text-lg font-semibold text-slate-900 mb-6">Тренды спроса</h2>

        <div class="space-y-4">
          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium text-slate-700">Спрос возрастает</span>
              <span class="text-xs font-semibold text-green-600">↑ 23%</span>
            </div>
            <div class="flex flex-wrap gap-2">
              <span class="text-xs bg-green-100 text-green-700 px-2 py-1 rounded"
                >Столовые приборы</span
              >
              <span class="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Кастрюли</span>
              <span class="text-xs bg-green-100 text-green-700 px-2 py-1 rounded"
                >Обеденные наборы</span
              >
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium text-slate-700">Спрос стабилен</span>
              <span class="text-xs font-semibold text-slate-600">→ 5%</span>
            </div>
            <div class="flex flex-wrap gap-2">
              <span class="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded"
                >Десертные тарелки</span
              >
              <span class="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">Чашки</span>
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium text-slate-700">Спрос снижается</span>
              <span class="text-xs font-semibold text-orange-600">↓ 12%</span>
            </div>
            <div class="flex flex-wrap gap-2">
              <span class="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded"
                >Стеклянные стаканы</span
              >
              <span class="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">Салатники</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppState } from '../composables/useAppState'

const { orders } = useAppState()

const avgOrderValue = computed(() => {
  if (orders.value.length === 0) return 0
  return orders.value.reduce((sum, order) => sum + order.totalAmount, 0) / orders.value.length
})
</script>
