<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-slate-900 mb-2">Управление товарами</h1>
      <p class="text-slate-600">Управляйте товарами, которые доступны в магазине</p>
    </div>

    <!-- Controls -->
    <div
      class="bg-white rounded-lg shadow p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
    >
      <div class="flex-1 max-w-md">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Поиск товара..."
          class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-black"
        />
      </div>
      <div class="flex gap-3">
        <button
          @click="showOnlyPublished = !showOnlyPublished"
          :class="[
            'px-4 py-2 rounded-lg font-semibold transition',
            showOnlyPublished
              ? 'bg-green-100 text-green-700 border border-green-300'
              : 'bg-slate-100 text-slate-700 border border-slate-300',
          ]"
        >
          {{ showOnlyPublished ? '✓ Опубликованные' : 'Все товары' }}
        </button>
        <button
          @click="openAddProductForm"
          class="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
        >
          + Добавить товар
        </button>
      </div>
    </div>

    <!-- Products table -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div v-if="filteredProducts.length === 0" class="p-12 text-center">
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
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
        <h2 class="text-xl font-semibold text-slate-900 mb-2">Товаров не найдено</h2>
        <p class="text-slate-600">
          {{ showOnlyPublished ? 'Нет опубликованных товаров' : 'Добавьте первый товар' }}
        </p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <!-- Table header -->
          <thead class="bg-slate-50 border-b border-slate-200">
            <tr>
              <th class="px-6 py-4 text-left text-sm font-semibold text-slate-900 w-40">
                Название
              </th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-slate-900 w-20">
                Категория
              </th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-slate-900 w-20">Цена</th>
              <th class="px-6 py-4 text-center text-sm font-semibold text-slate-900 w-20">
                В наличии
              </th>
              <th class="px-6 py-4 text-center text-sm font-semibold text-slate-900 w-24">
                Статус
              </th>
              <th class="px-6 py-4 text-right text-sm font-semibold text-slate-900 w-32">
                Действия
              </th>
            </tr>
          </thead>

          <!-- Table body -->
          <tbody class="divide-y divide-slate-200">
            <tr
              v-for="product in filteredProducts"
              :key="product.id"
              class="hover:bg-slate-50 transition"
            >
              <td class="px-6 py-4">
                <div class="font-semibold text-slate-900">{{ product.name }}</div>
                <p class="text-xs text-slate-600 mt-1">ID: {{ product.id }}</p>
              </td>
              <td class="px-6 py-4 text-slate-700">{{ product.category }}</td>
              <td class="px-6 py-4 font-semibold text-slate-900">
                {{ formatPrice(product.price) }} сом
              </td>
              <td class="px-6 py-4 text-center">
                <div
                  :class="[
                    'inline-block px-3 py-1 rounded-full text-sm font-semibold',
                    product.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700',
                  ]"
                >
                  {{ product.inStock ? 'Есть' : 'Нет' }}
                </div>
              </td>
              <td class="px-6 py-4 text-center">
                <button
                  @click="togglePublish(product.id)"
                  :class="[
                    'inline-block px-3 py-1 rounded-full text-sm font-semibold transition',
                    product.published
                      ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
                  ]"
                >
                  {{ product.published ? '✓ Опубликован' : 'Скрыт' }}
                </button>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex gap-2 justify-end">
                  <button
                    @click="editProduct(product)"
                    class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    title="Редактировать"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                  <button
                    @click="deleteProduct(product.id)"
                    class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Удалить"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
        <p class="text-sm text-blue-700 font-semibold mb-2">Всего товаров</p>
        <p class="text-3xl font-bold text-blue-900">{{ products.length }}</p>
      </div>
      <div
        class="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200"
      >
        <p class="text-sm text-green-700 font-semibold mb-2">Опубликовано</p>
        <p class="text-3xl font-bold text-green-900">{{ publishedCount }}</p>
      </div>
      <div
        class="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-6 border border-yellow-200"
      >
        <p class="text-sm text-yellow-700 font-semibold mb-2">В наличии</p>
        <p class="text-3xl font-bold text-yellow-900">{{ inStockCount }}</p>
      </div>
      <div
        class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200"
      >
        <p class="text-sm text-purple-700 font-semibold mb-2">Скрыто</p>
        <p class="text-3xl font-bold text-purple-900">{{ products.length - publishedCount }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useStoreProducts } from '@/composables/useStoreProducts'

const { products, toggleProductPublished, updateProduct } = useStoreProducts()

const searchQuery = ref('')
const showOnlyPublished = ref(false)

const filteredProducts = computed(() => {
  let filtered = products.value

  if (showOnlyPublished.value) {
    filtered = filtered.filter((p) => p.published)
  }

  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter((p) => p.name.toLowerCase().includes(query) || p.id.includes(query))
  }

  return filtered
})

const publishedCount = computed(() => products.value.filter((p) => p.published).length)
const inStockCount = computed(() => products.value.filter((p) => p.inStock).length)

const formatPrice = (price: number) => {
  return price.toLocaleString('ru-RU')
}

const togglePublish = (productId: string) => {
  toggleProductPublished(productId)
}

const editProduct = (product: any) => {
  alert(
    `Редактирование товара: ${product.name}\n\nЭта функция будет доступна в будущих версиях.\n\nПока вы можете использовать консоль разработчика для редактирования через localStorage.`,
  )
}

const deleteProduct = (productId: string) => {
  if (confirm('Вы уверены, что хотите удалить этот товар?')) {
    alert('Удаление будет доступно в будущих версиях.')
  }
}

const openAddProductForm = () => {
  alert(
    'Добавление новых товаров будет доступно в будущих версиях.\n\nПока вы можете использовать встроенные товары.',
  )
}
</script>
