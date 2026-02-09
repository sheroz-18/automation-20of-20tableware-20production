<template>
  <div v-if="product" class="space-y-6">
    <!-- Back button -->
    <router-link to="/store" class="inline-block px-4 py-2 text-blue-600 hover:text-blue-700 font-semibold">
      ← Вернуться в магазин
    </router-link>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Product image -->
      <div class="flex items-start">
        <div class="w-full bg-gradient-to-br from-slate-200 to-slate-300 rounded-lg overflow-hidden">
          <img
            v-if="product.image"
            :src="product.image"
            :alt="product.name"
            class="w-full h-auto object-cover"
          />
          <div v-else class="w-full h-96 flex items-center justify-center">
            <svg class="w-24 h-24 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        </div>
      </div>

      <!-- Product info -->
      <div class="space-y-6">
        <!-- Category and title -->
        <div>
          <p class="text-blue-600 font-semibold text-sm mb-2">{{ product.category }}</p>
          <h1 class="text-4xl font-bold text-slate-900 mb-2">{{ product.name }}</h1>
          <p class="text-lg text-slate-600">{{ product.description }}</p>
        </div>

        <!-- Rating -->
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2">
            <span class="text-2xl text-yellow-500">★</span>
            <span class="text-lg font-bold text-slate-900">{{ product.rating }}</span>
            <span class="text-slate-600">({{ product.reviewCount }} отзывов)</span>
          </div>
        </div>

        <!-- Price -->
        <div class="border-b border-slate-200 pb-6">
          <div class="flex items-baseline gap-3 mb-2">
            <span class="text-4xl font-bold text-slate-900">{{ formatPrice(product.price) }} сом</span>
            <span v-if="product.oldPrice" class="text-xl text-slate-500 line-through">
              {{ formatPrice(product.oldPrice) }} сом
            </span>
          </div>
          <p v-if="product.oldPrice && product.oldPrice > product.price" class="text-red-600 font-semibold">
            Экономия: {{ formatPrice(product.oldPrice - product.price) }} сом
            ({{ Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) }}%)
          </p>
        </div>

        <!-- Stock status -->
        <div>
          <div v-if="product.inStock" class="inline-block px-4 py-2 bg-green-100 text-green-700 rounded-lg font-semibold">
            В наличии
          </div>
          <div v-else class="inline-block px-4 py-2 bg-red-100 text-red-700 rounded-lg font-semibold">
            Нет в наличии
          </div>
        </div>

        <!-- Add to cart -->
        <div class="flex gap-4">
          <div class="flex items-center gap-2 border border-slate-300 rounded-lg">
            <button
              @click="decreaseQuantity"
              class="p-3 hover:bg-slate-100 transition"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
              </svg>
            </button>
            <input
              v-model.number="quantity"
              type="number"
              min="1"
              class="w-16 text-center border-l border-r border-slate-300 py-2 outline-none text-black"
            />
            <button
              @click="increaseQuantity"
              class="p-3 hover:bg-slate-100 transition"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>

          <button
            v-if="product.inStock"
            @click="addToCart"
            :disabled="isAdding"
            class="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition disabled:opacity-50 disabled:cursor-not-allowed text-lg"
          >
            <span v-if="!isAdding">Добавить в корзину</span>
            <span v-else>Добавляю...</span>
          </button>
          <button
            v-else
            disabled
            class="flex-1 px-6 py-3 bg-slate-300 text-slate-600 font-semibold rounded-lg cursor-not-allowed text-lg"
          >
            Нет в наличии
          </button>
        </div>

        <!-- Share buttons -->
        <div class="flex gap-2">
          <button class="p-3 border border-slate-300 rounded-lg hover:bg-slate-100 transition" title="Поделиться">
            <svg class="w-5 h-5 text-slate-600" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Description tabs -->
    <div class="bg-white rounded-lg shadow p-6">
      <div class="border-b border-slate-200 mb-6">
        <div class="flex gap-8">
          <button
            @click="activeTab = 'description'"
            :class="[
              'px-4 py-2 font-semibold border-b-2 transition',
              activeTab === 'description'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900',
            ]"
          >
            Описание
          </button>
          <button
            @click="activeTab = 'specs'"
            :class="[
              'px-4 py-2 font-semibold border-b-2 transition',
              activeTab === 'specs'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900',
            ]"
          >
            Характеристики
          </button>
          <button
            @click="activeTab = 'reviews'"
            :class="[
              'px-4 py-2 font-semibold border-b-2 transition',
              activeTab === 'reviews'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900',
            ]"
          >
            Отзывы
          </button>
        </div>
      </div>

      <!-- Description tab -->
      <div v-if="activeTab === 'description'" class="prose max-w-none">
        <p class="text-slate-700 leading-relaxed">{{ product.longDescription }}</p>
      </div>

      <!-- Specs tab -->
      <div v-if="activeTab === 'specs'" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-sm text-slate-600 font-semibold">Материал</p>
            <p class="text-slate-900">{{ product.material }}</p>
          </div>
          <div>
            <p class="text-sm text-slate-600 font-semibold">Размеры</p>
            <p class="text-slate-900">{{ product.dimensions }}</p>
          </div>
          <div>
            <p class="text-sm text-slate-600 font-semibold">Вес</p>
            <p class="text-slate-900">{{ product.weight }} кг</p>
          </div>
          <div>
            <p class="text-sm text-slate-600 font-semibold">SKU</p>
            <p class="text-slate-900">{{ product.sku }}</p>
          </div>
        </div>
      </div>

      <!-- Reviews tab -->
      <div v-if="activeTab === 'reviews'" class="space-y-4">
        <p class="text-slate-700">
          Товар имеет <strong>{{ product.reviewCount }}</strong> отзывов с рейтингом
          <strong>{{ product.rating }}/5</strong>
        </p>
        <div class="mt-4 p-4 bg-blue-50 rounded-lg">
          <p class="text-sm text-blue-800">Отзывы скоро появятся на сайте</p>
        </div>
      </div>
    </div>

    <!-- Related products -->
    <div>
      <h2 class="text-2xl font-bold text-slate-900 mb-4">Похожие товары</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <ProductCard
          v-for="p in relatedProducts"
          :key="p.id"
          :product="p"
        />
      </div>
    </div>
  </div>

  <!-- Not found -->
  <div v-else class="text-center py-12">
    <svg class="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
    <h2 class="text-xl font-semibold text-slate-900 mb-2">Товар не найден</h2>
    <router-link to="/store" class="text-blue-600 hover:text-blue-700 font-semibold">
      Вернуться в магазин
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useStoreProducts } from '@/composables/useStoreProducts'
import { useCart } from '@/composables/useCart'
import ProductCard from '@/components/store/ProductCard.vue'

const route = useRoute()
const { getProductById, getProductsByCategory } = useStoreProducts()
const { addToCart: addProductToCart } = useCart()

const product = computed(() => getProductById(route.params.id as string))
const quantity = ref(1)
const activeTab = ref('description')
const isAdding = ref(false)

const relatedProducts = computed(() => {
  if (!product.value) return []
  return getProductsByCategory(product.value.category).filter((p) => p.id !== product.value?.id).slice(0, 4)
})

const formatPrice = (price: number) => {
  return price.toLocaleString('ru-RU')
}

const increaseQuantity = () => {
  quantity.value++
}

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

const addToCart = () => {
  if (!product.value) return
  isAdding.value = true
  setTimeout(() => {
    addProductToCart(product.value!, quantity.value)
    isAdding.value = false
    quantity.value = 1
  }, 300)
}
</script>
