<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-slate-900 mb-2">Магазин ПосудаПро</h1>
      <p class="text-slate-600">Премиум посуда и кухонная утварь высокого качества</p>
    </div>

    <!-- Search and filters -->
    <div class="bg-white rounded-lg shadow p-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Поиск товаров..."
            class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>
        <select
          v-model="selectedCategory"
          class="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
        >
          <option value="">Все категории</option>
          <option v-for="cat in categories" :key="cat" :value="cat">
            {{ cat }}
          </option>
        </select>
        <div v-if="filterResults.length > 0" class="text-sm text-slate-600 flex items-center">
          Найдено товаров: {{ filterResults.length }}
        </div>
      </div>
    </div>

    <!-- Featured products section -->
    <div v-if="filteredProducts.length === 0 && searchQuery === '' && selectedCategory === ''">
      <h2 class="text-2xl font-bold text-slate-900 mb-4">Популярные товары</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <ProductCard
          v-for="product in featuredProducts"
          :key="product.id"
          :product="product"
        />
      </div>
    </div>

    <!-- All products -->
    <div v-if="filteredProducts.length > 0">
      <h2 class="text-2xl font-bold text-slate-900 mb-4">Товары</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <ProductCard
          v-for="product in filteredProducts"
          :key="product.id"
          :product="product"
        />
      </div>
    </div>

    <!-- No results -->
    <div v-else-if="searchQuery !== '' || selectedCategory !== ''" class="text-center py-12">
      <svg class="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <h2 class="text-xl font-semibold text-slate-900 mb-2">Товары не найдены</h2>
      <p class="text-slate-600 mb-4">Попробуйте другие критерии поиска</p>
      <button
        @click="resetFilters"
        class="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
      >
        Сбросить фильтры
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useStoreProducts } from '@/composables/useStoreProducts'
import ProductCard from '@/components/store/ProductCard.vue'

const { getPublishedProducts, getCategories, searchProducts, getProductsByCategory, getFeaturedProducts } =
  useStoreProducts()

const searchQuery = ref('')
const selectedCategory = ref('')

const allProducts = computed(() => getPublishedProducts())
const categories = computed(() => getCategories())
const featuredProducts = computed(() => getFeaturedProducts(4))

const filteredProducts = computed(() => {
  let result = getPublishedProducts()

  if (searchQuery.value.trim()) {
    result = searchProducts(searchQuery.value)
  } else if (selectedCategory.value) {
    result = getProductsByCategory(selectedCategory.value)
  }

  return result
})

const filterResults = computed(() => filteredProducts.value)

const resetFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = ''
}
</script>
