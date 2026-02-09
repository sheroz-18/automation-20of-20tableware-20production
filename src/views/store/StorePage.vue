<template>
  <div class="min-h-screen bg-slate-50">
    <!-- Header -->
    <div class="bg-white border-b border-slate-200">
      <div class="max-w-7xl mx-auto px-4 py-6">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h1 class="text-3xl font-bold text-slate-900">Магазин ПосудаПро</h1>
            <p class="text-slate-600 mt-1">Премиум посуда и кухонная утварь высокого качества</p>
          </div>
          <div class="flex items-center gap-4">
            <div class="relative">
              <button
                class="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition relative"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <span class="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  0
                </span>
              </button>
            </div>
            <button
              @click="toggleUserMenu"
              class="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>
          </div>
        </div>

        <!-- Search and filters -->
        <div class="flex gap-4">
          <div class="flex-1 relative">
            <input
              type="text"
              placeholder="Поиск товаров..."
              class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
          <select class="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
            <option>Все категории</option>
            <option>Сковороды</option>
            <option>Кастрюли</option>
            <option>Ножи</option>
            <option>Доски</option>
            <option>Столовые приборы</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Products grid -->
    <div class="max-w-7xl mx-auto px-4 py-12">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Product card example -->
        <div
          v-for="i in 12"
          :key="i"
          class="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden"
        >
          <!-- Product image placeholder -->
          <div class="w-full h-48 bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
            <svg class="w-16 h-16 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>

          <!-- Product info -->
          <div class="p-4">
            <h3 class="font-semibold text-slate-900 mb-1">Премиум сковорода</h3>
            <p class="text-sm text-slate-600 mb-3">Нержавеющая сталь, 30 см</p>

            <!-- Rating -->
            <div class="flex items-center gap-1 mb-3">
              <span class="text-xs text-yellow-500">★★★★★</span>
              <span class="text-xs text-slate-600">(42)</span>
            </div>

            <!-- Price -->
            <div class="flex items-baseline gap-2 mb-4">
              <span class="text-lg font-bold text-slate-900">2500 сом</span>
              <span class="text-sm text-slate-500 line-through">3500 сом</span>
            </div>

            <!-- Add to cart button -->
            <button
              class="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
            >
              В корзину
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '@/composables/useAuth'

const { currentUser, logout, isAdmin } = useAuth()
const showUserMenu = ref(false)

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}
</script>
