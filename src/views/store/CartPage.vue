<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-3xl font-bold text-slate-900 mb-2">Корзина покупок</h1>
      <p class="text-slate-600">Проверьте и оформите ваши товары</p>
    </div>

    <div v-if="items.length === 0" class="bg-white rounded-lg shadow p-12 text-center">
      <svg
        class="w-16 h-16 text-slate-300 mx-auto mb-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
      <h2 class="text-xl font-semibold text-slate-900 mb-2">Корзина пуста</h2>
      <p class="text-slate-600 mb-6">Добавьте товары из магазина</p>
      <router-link
        to="/store"
        class="inline-block px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
      >
        Вернуться в магазин
      </router-link>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Cart items -->
      <div class="lg:col-span-2 space-y-4">
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <!-- Header -->
          <div
            class="hidden sm:grid grid-cols-12 gap-4 px-6 py-4 border-b border-slate-200 bg-slate-50 font-semibold text-sm text-slate-700"
          >
            <div class="col-span-6">Товар</div>
            <div class="col-span-2 text-right">Цена</div>
            <div class="col-span-2 text-center">Кол-во</div>
            <div class="col-span-2 text-right">Итого</div>
          </div>

          <!-- Items -->
          <div class="divide-y divide-slate-200">
            <div
              v-for="item in items"
              :key="item.productId"
              class="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-slate-50 transition"
            >
              <!-- Product -->
              <div class="col-span-12 sm:col-span-6 flex gap-4">
                <img
                  v-if="item.image"
                  :src="item.image"
                  :alt="item.name"
                  class="w-16 h-16 object-cover rounded"
                />
                <div v-else class="w-16 h-16 bg-slate-200 rounded flex items-center justify-center">
                  <svg
                    class="w-8 h-8 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="font-semibold text-slate-900 truncate">{{ item.name }}</h3>
                  <p class="text-sm text-slate-600">{{ formatPrice(item.price) }} сом</p>
                </div>
              </div>

              <!-- Price (mobile only) -->
              <div class="col-span-6 sm:col-span-2 sm:hidden flex justify-between">
                <span class="text-slate-600">Цена:</span>
                <span class="font-semibold">{{ formatPrice(item.price) }} сом</span>
              </div>

              <!-- Price (desktop) -->
              <div class="hidden sm:block col-span-2 text-right">
                {{ formatPrice(item.price) }} сом
              </div>

              <!-- Quantity -->
              <div class="col-span-6 sm:col-span-2 sm:hidden flex justify-between items-center">
                <span class="text-slate-600">Кол-во:</span>
                <div class="flex items-center gap-2">
                  <button
                    @click="updateQuantity(item.productId, item.quantity - 1)"
                    class="p-1 hover:bg-slate-200 rounded transition"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M20 12H4"
                      />
                    </svg>
                  </button>
                  <input
                    type="number"
                    :value="item.quantity"
                    @change="(e) => updateQuantity(item.productId, parseInt(e.target.value))"
                    min="1"
                    class="w-12 text-center border border-slate-300 rounded py-1 text-sm text-black"
                  />
                  <button
                    @click="updateQuantity(item.productId, item.quantity + 1)"
                    class="p-1 hover:bg-slate-200 rounded transition"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Quantity (desktop) -->
              <div class="hidden sm:flex col-span-2 items-center justify-center gap-2">
                <button
                  @click="updateQuantity(item.productId, item.quantity - 1)"
                  class="p-1 hover:bg-slate-200 rounded transition"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M20 12H4"
                    />
                  </svg>
                </button>
                <input
                  type="number"
                  :value="item.quantity"
                  @change="(e) => updateQuantity(item.productId, parseInt(e.target.value))"
                  min="1"
                  class="w-12 text-center border border-slate-300 rounded py-1 text-sm text-black"
                />
                <button
                  @click="updateQuantity(item.productId, item.quantity + 1)"
                  class="p-1 hover:bg-slate-200 rounded transition"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </button>
              </div>

              <!-- Total (mobile) -->
              <div class="col-span-6 sm:col-span-2 sm:hidden flex justify-between">
                <span class="text-slate-600">Итого:</span>
                <span class="font-bold text-slate-900"
                  >{{ formatPrice(item.price * item.quantity) }} сом</span
                >
              </div>

              <!-- Total (desktop) -->
              <div class="hidden sm:block col-span-2 text-right font-bold text-slate-900">
                {{ formatPrice(item.price * item.quantity) }} сом
              </div>

              <!-- Delete button (mobile only) -->
              <button
                @click="removeItem(item.productId)"
                class="col-span-6 sm:hidden text-red-600 hover:text-red-700 font-semibold text-sm"
              >
                Удалить
              </button>

              <!-- Delete button (desktop) -->
              <div class="hidden sm:flex col-span-1 justify-end">
                <button
                  @click="removeItem(item.productId)"
                  class="text-red-600 hover:text-red-700 p-1"
                  title="Удалить"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Continue shopping -->
        <router-link
          to="/store"
          class="inline-block px-4 py-2 text-blue-600 hover:text-blue-700 font-semibold"
        >
          ← Продолжить покупки
        </router-link>
      </div>

      <!-- Order summary -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-lg shadow p-6 sticky top-24">
          <h2 class="text-lg font-bold text-slate-900 mb-4">Сумма заказа</h2>

          <div class="space-y-3 mb-6 pb-6 border-b border-slate-200">
            <div class="flex justify-between text-slate-600">
              <span>Подитог:</span>
              <span>{{ formatPrice(total) }} сом</span>
            </div>
            <div class="flex justify-between text-slate-600">
              <span>Доставка:</span>
              <span>Рассчитается при оформлении</span>
            </div>
          </div>

          <div class="mb-6">
            <div class="flex justify-between text-lg font-bold text-slate-900">
              <span>Итого:</span>
              <span>{{ formatPrice(total) }} сом</span>
            </div>
            <p class="text-xs text-slate-600 mt-1">+ стоимость доставки</p>
          </div>

          <router-link
            to="/checkout"
            class="block w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg text-center hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition mb-3"
          >
            Оформить заказ
          </router-link>

          <button
            @click="clearAllItems"
            class="w-full px-4 py-2 text-red-600 hover:text-red-700 font-semibold transition border border-red-300 rounded-lg hover:bg-red-50"
          >
            Очистить корзину
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCart } from '@/composables/useCart'

const { items, total, removeFromCart, updateQuantity, clearCart } = useCart()

const formatPrice = (price: number) => {
  return price.toLocaleString('ru-RU')
}

const removeItem = (productId: string) => {
  removeFromCart(productId)
}

const clearAllItems = () => {
  if (confirm('Вы уверены, что хотите очистить корзину?')) {
    clearCart()
  }
}
</script>
