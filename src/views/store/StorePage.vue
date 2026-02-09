<template>
  <div class="space-y-8">
    <!-- Hero Banner with Animation -->
    <div class="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 shadow-2xl">
      <div class="absolute inset-0 opacity-20">
        <div class="absolute top-0 left-0 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div class="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div class="absolute bottom-0 left-1/2 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div class="relative px-6 sm:px-8 py-12 sm:py-16">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <!-- Content -->
          <div class="text-white">
            <div class="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-4">
              <span class="text-sm font-semibold">Добро пожаловать в ПосудаПро</span>
            </div>
            <h1 class="text-4xl sm:text-5xl font-bold mb-4 leading-tight">
              Премиум посуда высочайшего качества
            </h1>
            <p class="text-lg text-blue-100 mb-6">
              Выбирайте из огромного ассортимента кухонной утвари от ведущих производителей. Быстрая доставка по всему Таджикистану!
            </p>

            <!-- Stats -->
            <div class="grid grid-cols-3 gap-4 mb-8">
              <div class="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3">
                <p class="text-2xl font-bold">10+</p>
                <p class="text-sm text-blue-100">Товаров</p>
              </div>
              <div class="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3">
                <p class="text-2xl font-bold">6</p>
                <p class="text-sm text-blue-100">Регионов</p>
              </div>
              <div class="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3">
                <p class="text-2xl font-bold">24/7</p>
                <p class="text-sm text-blue-100">Поддержка</p>
              </div>
            </div>

            <router-link
              to="/store"
              class="inline-block px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 focus:ring-4 focus:ring-blue-300 transition shadow-lg"
            >
              Начать покупки →
            </router-link>
          </div>

          <!-- Image placeholder with animation -->
          <div class="relative h-96 hidden md:block">
            <div class="absolute inset-0 bg-gradient-to-br from-blue-400/30 to-blue-600/30 rounded-xl backdrop-blur-sm flex items-center justify-center animate-float">
              <div class="text-center">
                <svg class="w-32 h-32 text-white/80 mx-auto mb-4 animate-spin-slow" fill="none" viewBox="0 0 24 24">
                  <ellipse cx="12" cy="12" rx="8" ry="7.5" fill="currentColor" opacity="0.15" />
                  <circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="1.3" />
                  <g transform="translate(5, 9)">
                    <path
                      d="M 2 0 L 2 4 M 3.5 0 L 3.5 4"
                      stroke="currentColor"
                      stroke-width="1.1"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M 1.5 4 L 4 4 Q 2.75 5.2 2.75 6.5"
                      stroke="currentColor"
                      stroke-width="1.1"
                      fill="none"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </g>
                  <g transform="translate(13, 8.5)">
                    <path
                      d="M 0.5 0 L 2 3 L 2.2 5 Q 1.2 5.5 0.5 5.5 Q 0.3 3.5 0.5 0"
                      stroke="currentColor"
                      stroke-width="1.1"
                      fill="none"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <line
                      x1="0.5"
                      y1="0"
                      x2="2"
                      y2="3"
                      stroke="currentColor"
                      stroke-width="1.1"
                      stroke-linecap="round"
                    />
                  </g>
                  <circle cx="12" cy="12" r="0.9" fill="currentColor" opacity="0.7" />
                </svg>
                <p class="text-white/80 font-semibold">Качество гарантировано</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delivery Info Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 hover:shadow-lg transition">
        <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
          <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
          </svg>
        </div>
        <h3 class="text-lg font-bold text-slate-900 mb-2">Быстрая доставка</h3>
        <p class="text-slate-600 text-sm">Доставка от 50 сом в любой регион Таджикистана. Сроки от 1 до 5 дней в зависимости от региона.</p>
      </div>

      <div class="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-6 hover:shadow-lg transition">
        <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
          <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 class="text-lg font-bold text-slate-900 mb-2">Выгодные цены</h3>
        <p class="text-slate-600 text-sm">Скидки и акции на популярные товары. Оптимальное соотношение цены и качества.</p>
      </div>

      <div class="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6 hover:shadow-lg transition">
        <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
          <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </div>
        <h3 class="text-lg font-bold text-slate-900 mb-2">Поддержка 24/7</h3>
        <p class="text-slate-600 text-sm">Помощь и консультации доступны всегда. Мы помогаем с выбором товара и решаем любые вопросы.</p>
      </div>
    </div>

    <!-- Search and filters -->
    <div class="bg-white rounded-xl shadow-lg p-6 sticky top-24 z-10">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="lg:col-span-2">
          <label class="block text-sm font-semibold text-slate-700 mb-2">Поиск товаров</label>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Введите название товара..."
            class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900 placeholder-slate-500 font-medium"
          />
        </div>
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-2">Категория</label>
          <select
            v-model="selectedCategory"
            class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-slate-900 font-medium cursor-pointer"
          >
            <option value="">Все категории</option>
            <option v-for="cat in categories" :key="cat" :value="cat">
              {{ cat }}
            </option>
          </select>
        </div>
        <div class="flex items-end">
          <button
            @click="resetFilters"
            class="w-full px-4 py-3 bg-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-300 transition"
          >
            Сбросить
          </button>
        </div>
      </div>
      <div v-if="filterResults.length > 0" class="mt-4 text-sm text-blue-600 font-semibold">
        ✓ Найдено товаров: {{ filterResults.length }}
      </div>
    </div>

    <!-- Featured products section -->
    <div v-if="filteredProducts.length === 0 && searchQuery === '' && selectedCategory === ''">
      <div class="mb-6">
        <h2 class="text-3xl font-bold text-slate-900 mb-2">Популярные товары</h2>
        <p class="text-slate-600">Самые востребованные товары нашего магазина</p>
      </div>
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
      <div class="mb-6">
        <h2 class="text-3xl font-bold text-slate-900 mb-2">Результаты поиска</h2>
        <p class="text-slate-600">Найдено {{ filteredProducts.length }} товар(ов)</p>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <ProductCard
          v-for="product in filteredProducts"
          :key="product.id"
          :product="product"
        />
      </div>
    </div>

    <!-- No results -->
    <div v-else-if="searchQuery !== '' || selectedCategory !== ''" class="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border-2 border-dashed border-slate-300 p-12 text-center">
      <svg class="w-20 h-20 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <h2 class="text-2xl font-bold text-slate-900 mb-2">Товары не найдены</h2>
      <p class="text-slate-600 mb-6 text-lg">К сожалению, по вашему запросу ничего не найдено</p>
      <button
        @click="resetFilters"
        class="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition"
      >
        Вернуться к покупкам
      </button>
    </div>
  </div>
</template>

<style scoped>
@keyframes blob {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

@keyframes spin-slow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

.animate-spin-slow {
  animation: spin-slow 3s linear infinite;
}
</style>

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
