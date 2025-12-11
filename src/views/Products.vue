<template>
  <div class="space-y-8">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-4xl font-bold text-slate-900">Каталог товаров</h1>
        <p class="text-slate-600 mt-2">Управление ассортиментом продукции</p>
      </div>
      <button class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition">
        + Новый товар
      </button>
    </div>

    <div class="flex gap-4 flex-wrap">
      <div class="flex-1 min-w-64 bg-white rounded-lg border border-slate-200 p-4">
        <label class="text-sm font-medium text-slate-700 block mb-2">Поиск</label>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Поиск по названию или SKU..."
          class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div class="bg-white rounded-lg border border-slate-200 p-4">
        <label class="text-sm font-medium text-slate-700 block mb-2">Категория</label>
        <select v-model="categoryFilter" class="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">Все категории</option>
          <option value="Тарелки">Тарелки</option>
          <option value="Чашки">Чашки</option>
          <option value="Приборы">Приборы</option>
          <option value="Миски">Миски</option>
          <option value="Кухонная утварь">Кухонная утварь</option>
        </select>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="product in filteredProducts"
        :key="product.id"
        class="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition overflow-hidden"
      >
        <div class="h-40 bg-gradient-to-br" :class="getGradientColor(product.category)"></div>
        
        <div class="p-6">
          <div class="flex items-start justify-between mb-3">
            <div>
              <h3 class="font-semibold text-slate-900">{{ product.name }}</h3>
              <p class="text-xs text-slate-500 mt-1">{{ product.category }}</p>
            </div>
            <span :class="getStatusBadge(product.status)">
              {{ getStatusLabel(product.status) }}
            </span>
          </div>

          <code class="text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded block mb-4">{{ product.sku }}</code>

          <div class="grid grid-cols-2 gap-4 mb-4">
            <div class="p-3 rounded-lg bg-slate-50">
              <p class="text-xs text-slate-600">Количество</p>
              <p class="font-bold text-slate-900 text-lg">{{ product.quantity }}</p>
            </div>
            <div class="p-3 rounded-lg bg-slate-50">
              <p class="text-xs text-slate-600">Цена</p>
              <p class="font-bold text-slate-900 text-lg">₽{{ product.unitCost }}</p>
            </div>
          </div>

          <div class="mb-4">
            <p class="text-xs text-slate-600 mb-2">Прогресс запаса</p>
            <div class="w-full bg-slate-200 rounded-full h-2">
              <div class="bg-blue-600 h-2 rounded-full" :style="{ width: getProgressPercent(product.quantity, product.reorderLevel) + '%' }"></div>
            </div>
          </div>

          <div class="flex gap-2">
            <button class="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition">
              Редактировать
            </button>
            <button class="flex-1 px-3 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 text-sm font-medium transition">
              Подробнее
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { products } from '../data/mockData'

const searchQuery = ref('')
const categoryFilter = ref('')

const filteredProducts = computed(() => {
  return products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesCategory = !categoryFilter.value || product.category === categoryFilter.value
    return matchesSearch && matchesCategory
  })
})

const getGradientColor = (category: string): string => {
  const gradients: Record<string, string> = {
    'Тарелки': 'from-blue-400 to-blue-600',
    'Чашки': 'from-orange-400 to-orange-600',
    'Приборы': 'from-green-400 to-green-600',
    'Миски': 'from-purple-400 to-purple-600',
    'Стеклянная посуда': 'from-cyan-400 to-cyan-600',
    'Кухонная утварь': 'from-rose-400 to-rose-600',
  }
  return gradients[category] || 'from-blue-400 to-blue-600'
}

const getStatusBadge = (status: string) => {
  const badges: Record<string, string> = {
    'in_stock': 'px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium',
    'low_stock': 'px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-medium',
    'out_of_stock': 'px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium',
  }
  return badges[status] || 'px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-medium'
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    'in_stock': 'В наличии',
    'low_stock': 'Низкий запас',
    'out_of_stock': 'Нет в наличии',
  }
  return labels[status] || 'Неизвестно'
}

const getProgressPercent = (quantity: number, reorderLevel: number) => {
  return Math.min((quantity / (reorderLevel * 2)) * 100, 100)
}
</script>
