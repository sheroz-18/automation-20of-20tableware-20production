<template>
  <div
    class="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden cursor-pointer"
    @click="goToProduct"
  >
    <!-- Product image -->
    <div class="relative w-full h-48 bg-gradient-to-br from-slate-200 to-slate-300 overflow-hidden group">
      <img
        v-if="product.image"
        :src="product.image"
        :alt="product.name"
        class="w-full h-full object-cover group-hover:scale-110 transition duration-300"
      />
      <div v-else class="w-full h-full flex items-center justify-center">
        <svg class="w-16 h-16 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>

      <!-- Sale badge -->
      <div
        v-if="product.oldPrice && product.oldPrice > product.price"
        class="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-bold"
      >
        -{{ Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) }}%
      </div>

      <!-- Stock status -->
      <div
        v-if="!product.inStock"
        class="absolute inset-0 bg-black/50 flex items-center justify-center"
      >
        <span class="text-white font-bold text-lg">Нет в наличии</span>
      </div>
    </div>

    <!-- Product info -->
    <div class="p-4">
      <!-- Category -->
      <p class="text-xs text-blue-600 font-semibold mb-1">{{ product.category }}</p>

      <!-- Name -->
      <h3 class="font-semibold text-slate-900 mb-1 line-clamp-2 hover:text-blue-600">
        {{ product.name }}
      </h3>

      <!-- Description -->
      <p class="text-sm text-slate-600 mb-3 line-clamp-1">{{ product.description }}</p>

      <!-- Rating -->
      <div class="flex items-center gap-1 mb-3">
        <span class="text-xs text-yellow-500">★</span>
        <span class="text-xs font-semibold text-slate-900">{{ product.rating }}</span>
        <span class="text-xs text-slate-600">({{ product.reviewCount }})</span>
      </div>

      <!-- Price -->
      <div class="flex items-baseline gap-2 mb-4">
        <span class="text-lg font-bold text-slate-900">{{ formatPrice(product.price) }} сом</span>
        <span v-if="product.oldPrice" class="text-sm text-slate-500 line-through">
          {{ formatPrice(product.oldPrice) }} сом
        </span>
      </div>

      <!-- Add to cart button -->
      <button
        v-if="product.inStock"
        @click.stop="handleAddToCart"
        :disabled="isAdding"
        class="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span v-if="!isAdding">В корзину</span>
        <span v-else>Добавляю...</span>
      </button>
      <button
        v-else
        disabled
        class="w-full px-4 py-2 bg-slate-300 text-slate-600 font-semibold rounded-lg cursor-not-allowed"
      >
        Нет в наличии
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCart } from '@/composables/useCart'
import type { Product } from '@/composables/useStoreProducts'

interface Props {
  product: Product
}

const props = defineProps<Props>()

const router = useRouter()
const { addToCart } = useCart()
const isAdding = ref(false)

const formatPrice = (price: number) => {
  return price.toLocaleString('ru-RU')
}

const goToProduct = () => {
  router.push(`/store/product/${props.product.id}`)
}

const handleAddToCart = () => {
  isAdding.value = true
  setTimeout(() => {
    addToCart(props.product, 1)
    isAdding.value = false
  }, 300)
}
</script>
