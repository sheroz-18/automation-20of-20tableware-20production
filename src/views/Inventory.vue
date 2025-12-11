<template>
  <div class="space-y-8">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-4xl font-bold text-slate-900">Управление инвентаризацией</h1>
        <p class="text-slate-600 mt-2">Отслеживание остатков товаров на складах</p>
      </div>
      <button class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition">
        + Новая инвентаризация
      </button>
    </div>

    <div class="flex gap-4 flex-wrap">
      <div class="flex-1 min-w-64 bg-white rounded-lg border border-slate-200 p-4">
        <label class="text-sm font-medium text-slate-700 block mb-2">Поиск товара</label>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Искать товар по названию или SKU..."
          class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div class="bg-white rounded-lg border border-slate-200 p-4">
        <label class="text-sm font-medium text-slate-700 block mb-2">Фильтр по статусу</label>
        <select v-model="statusFilter" class="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">Все товары</option>
          <option value="in_stock">На складе</option>
          <option value="low_stock">Низкий запас</option>
          <option value="out_of_stock">Нет в наличии</option>
        </select>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-slate-200 bg-slate-50">
              <th class="px-6 py-4 text-left text-sm font-semibold text-slate-900">Товар</th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-slate-900">SKU</th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-slate-900">Количество</th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-slate-900">Уровень переказа</th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-slate-900">Место хранения</th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-slate-900">Последний учет</th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-slate-900">Статус</th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-slate-900">Действие</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in filteredInventory"
              :key="item.id"
              class="border-b border-slate-200 hover:bg-slate-50 transition"
            >
              <td class="px-6 py-4">
                <p class="font-medium text-slate-900">{{ item.productName }}</p>
              </td>
              <td class="px-6 py-4">
                <code class="text-sm text-slate-600 bg-slate-100 px-2 py-1 rounded">{{ item.productId }}</code>
              </td>
              <td class="px-6 py-4">
                <p class="font-semibold text-slate-900">{{ item.quantity }}</p>
              </td>
              <td class="px-6 py-4">
                <p class="text-slate-600">-</p>
              </td>
              <td class="px-6 py-4">
                <p class="text-sm text-slate-600">{{ item.location }}</p>
              </td>
              <td class="px-6 py-4">
                <p class="text-sm text-slate-600">{{ item.lastCounted }}</p>
              </td>
              <td class="px-6 py-4">
                <span :class="getStatusBadge(item.quantity)">
                  {{ getStatusLabel(item.quantity) }}
                </span>
              </td>
              <td class="px-6 py-4">
                <button class="text-blue-600 hover:text-blue-700 font-medium text-sm">Обновить</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 class="text-lg font-semibold text-slate-900 mb-4">Статистика склада</h3>
        <div class="space-y-4">
          <div class="flex items-center justify-between p-3 rounded-lg bg-green-50">
            <span class="text-sm text-green-700">Товаров в наличии</span>
            <span class="font-bold text-green-900">7</span>
          </div>
          <div class="flex items-center justify-between p-3 rounded-lg bg-orange-50">
            <span class="text-sm text-orange-700">Низкие запасы</span>
            <span class="font-bold text-orange-900">1</span>
          </div>
          <div class="flex items-center justify-between p-3 rounded-lg bg-red-50">
            <span class="text-sm text-red-700">Нет в наличии</span>
            <span class="font-bold text-red-900">1</span>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 class="text-lg font-semibold text-slate-900 mb-4">Самые ходовые товары</h3>
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-sm text-slate-600">Столовая ложка</span>
            <span class="font-semibold text-slate-900">1,200 шт</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-slate-600">Обеденная тарелка</span>
            <span class="font-semibold text-slate-900">850 шт</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-slate-600">Десертная тарелка</span>
            <span class="font-semibold text-slate-900">420 шт</span>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 class="text-lg font-semibold text-slate-900 mb-4">Требуется переказ</h3>
        <div class="space-y-3">
          <div class="p-3 rounded-lg bg-red-50 border border-red-200">
            <p class="font-medium text-red-900 text-sm">Стеклянный стакан</p>
            <p class="text-xs text-red-700 mt-1">Заказать: 500 шт</p>
          </div>
          <div class="p-3 rounded-lg bg-orange-50 border border-orange-200">
            <p class="font-medium text-orange-900 text-sm">Фарфоровая чашка</p>
            <p class="text-xs text-orange-700 mt-1">Заказать: 155 шт</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { inventoryItems } from '../data/mockData'
import { products } from '../data/mockData'

const searchQuery = ref('')
const statusFilter = ref('')

const filteredInventory = computed(() => {
  return inventoryItems.filter(item => {
    const matchesSearch = item.productName.toLowerCase().includes(searchQuery.value.toLowerCase())
    const product = products.find(p => p.id === item.productId)
    
    let matchesStatus = true
    if (statusFilter.value) {
      matchesStatus = product?.status === statusFilter.value
    }
    
    return matchesSearch && matchesStatus
  })
})

const getStatusBadge = (quantity: number) => {
  if (quantity === 0) {
    return 'px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium'
  } else if (quantity < 100) {
    return 'px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium'
  }
  return 'px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium'
}

const getStatusLabel = (quantity: number) => {
  if (quantity === 0) {
    return 'Нет в наличии'
  } else if (quantity < 100) {
    return 'Низкий запас'
  }
  return 'На складе'
}
</script>
