<template>
  <div class="space-y-8">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-4xl font-bold text-slate-900">Каталог товаров</h1>
        <p class="text-slate-600 mt-2">Управление ассортиментом продукции</p>
      </div>
      <button
        @click="openCreateModal('product')"
        class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition"
      >
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
        <select
          v-model="categoryFilter"
          class="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Все категории</option>
          <option value="Тарелки">Тарелки</option>
          <option value="Чашки">Чашки</option>
          <option value="Приборы">Приборы</option>
          <option value="Миски">Миски</option>
          <option value="Кухонная утварь">Кухонная утварь</option>
          <option value="Стеклянная посуда">Стеклянная посуда</option>
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

          <code class="text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded block mb-4">{{
            product.sku
          }}</code>

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
              <div
                class="bg-blue-600 h-2 rounded-full"
                :style="{ width: getProgressPercent(product.quantity, product.reorderLevel) + '%' }"
              ></div>
            </div>
          </div>

          <div class="flex gap-2">
            <button
              @click="openEditModal(product, 'product')"
              class="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition"
            >
              Редактировать
            </button>
            <button
              @click="openViewModal(product, 'product')"
              class="flex-1 px-3 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 text-sm font-medium transition"
            >
              Подробнее
            </button>
          </div>
        </div>
      </div>
    </div>

    <ModalBase
      :is-open="modal.isOpen.value && modal.contentType.value === 'product'"
      :title="
        modal.isCreateModal.value
          ? 'Создать товар'
          : modal.isEditModal.value
            ? 'Редактировать товар'
            : 'Информация о товаре'
      "
      :show-actions="true"
      :show-save-button="modal.isCreateModal.value || modal.isEditModal.value"
      @close="modal.closeModal"
      @save="saveProduct"
    >
      <div v-if="modal.isViewModal.value" class="space-y-6">
        <div class="grid grid-cols-2 gap-6">
          <div>
            <p class="text-sm text-slate-600">Название</p>
            <p class="text-lg font-semibold text-slate-900">{{ modal.selectedItem.value?.name }}</p>
          </div>
          <div>
            <p class="text-sm text-slate-600">SKU</p>
            <p class="text-lg font-semibold text-slate-900">{{ modal.selectedItem.value?.sku }}</p>
          </div>
          <div>
            <p class="text-sm text-slate-600">Категория</p>
            <p class="text-lg font-semibold text-slate-900">{{ modal.selectedItem.value?.category }}</p>
          </div>
          <div>
            <p class="text-sm text-slate-600">Статус</p>
            <span :class="getStatusBadge(modal.selectedItem.value?.status)">
              {{ getStatusLabel(modal.selectedItem.value?.status) }}
            </span>
          </div>
          <div>
            <p class="text-sm text-slate-600">Количество</p>
            <p class="text-lg font-semibold text-slate-900">
              {{ modal.selectedItem.value?.quantity }} шт
            </p>
          </div>
          <div>
            <p class="text-sm text-slate-600">Уровень переказа</p>
            <p class="text-lg font-semibold text-slate-900">
              {{ modal.selectedItem.value?.reorderLevel }} шт
            </p>
          </div>
          <div>
            <p class="text-sm text-slate-600">Цена за единицу</p>
            <p class="text-lg font-semibold text-slate-900">₽{{ modal.selectedItem.value?.unitCost }}</p>
          </div>
          <div>
            <p class="text-sm text-slate-600">Последнее обновление</p>
            <p class="text-lg font-semibold text-slate-900">
              {{ modal.selectedItem.value?.lastUpdated }}
            </p>
          </div>
        </div>

        <div class="flex gap-2 pt-4 border-t border-slate-200">
          <button
            @click="
              () => {
                modal.openEditModal(modal.selectedItem, 'product')
              }
            "
            class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition"
          >
            Редактировать
          </button>
          <button
            @click="modal.openDeleteModal(modal.selectedItem, 'product')"
            class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition"
          >
            Удалить
          </button>
        </div>
      </div>

      <div v-else class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Название товара</label>
          <input
            v-model="formData.name"
            type="text"
            class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Введите название"
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">SKU</label>
            <input
              v-model="formData.sku"
              type="text"
              class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="PLATE-001"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Категория</label>
            <select
              v-model="formData.category"
              class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Тарелки">Тарелки</option>
              <option value="Чашки">Чашки</option>
              <option value="Приборы">Приборы</option>
              <option value="Миски">Миски</option>
              <option value="Кухонная утварь">Кухонная утварь</option>
              <option value="Стеклянная посуда">Стеклянная посуда</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Количество</label>
            <input
              v-model.number="formData.quantity"
              type="number"
              class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Уровень переказа</label>
            <input
              v-model.number="formData.reorderLevel"
              type="number"
              class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="100"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Цена за единицу (₽)</label>
          <input
            v-model.number="formData.unitCost"
            type="number"
            step="0.01"
            class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0.00"
          />
        </div>
      </div>
    </ModalBase>

    <ModalBase
      v-if="modal.modalType.value === 'delete'"
      :is-open="modal.isOpen.value && modal.contentType.value === 'product'"
      title="Подтвердить удаление"
      :show-actions="true"
      @close="modal.closeModal"
    >
      <div class="space-y-4">
        <p class="text-slate-700">
          Вы уверены, что хотите удалить товар <strong>{{ modal.selectedItem?.name }}</strong
          >?
        </p>
        <p class="text-sm text-slate-600">Это действие нельзя будет отменить.</p>
        <div class="flex gap-3 justify-end pt-4">
          <button
            @click="modal.closeModal"
            class="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition"
          >
            Отмена
          </button>
          <button
            @click="deleteProduct"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition"
          >
            Удалить
          </button>
        </div>
      </div>
    </ModalBase>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { products as mockProducts } from '../data/mockData'
import { useModal } from '../composables/useModal'
import { useStorage } from '../composables/useStorage'
import ModalBase from '../components/ModalBase.vue'
import type { Product } from '../types'

const modal = useModal()
const storage = useStorage()

const products = ref<Product[]>([...mockProducts])
const searchQuery = ref('')
const categoryFilter = ref('')

const formData = ref<Partial<Product>>({
  name: '',
  sku: '',
  category: 'Тарелки',
  quantity: 0,
  reorderLevel: 100,
  unitCost: 0,
})

onMounted(() => {
  storage.initializeStorage(products, [], [], [])
  storage.watchForChanges(products, [], [], [])
})

const filteredProducts = computed(() => {
  return products.value.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesCategory = !categoryFilter.value || product.category === categoryFilter.value
    return matchesSearch && matchesCategory
  })
})

const openCreateModal = (type: any) => {
  formData.value = {
    name: '',
    sku: '',
    category: 'Тарелки',
    quantity: 0,
    reorderLevel: 100,
    unitCost: 0,
  }
  modal.openCreateModal(type)
}

const openEditModal = (product: Product, type: any) => {
  formData.value = { ...product }
  modal.openEditModal(product, type)
}

const openViewModal = (product: Product, type: any) => {
  modal.openViewModal(product, type)
}

const saveProduct = () => {
  if (!formData.value.name || !formData.value.sku) {
    alert('Пожалуйста, заполните обязательные поля')
    return
  }

  if (modal.isCreateModal) {
    const newProduct: Product = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.value.name || '',
      sku: formData.value.sku || '',
      category: formData.value.category || 'Тарелки',
      quantity: formData.value.quantity || 0,
      reorderLevel: formData.value.reorderLevel || 100,
      unitCost: formData.value.unitCost || 0,
      status: 'in_stock',
      lastUpdated: new Date().toISOString().split('T')[0],
    }
    products.value.push(newProduct)
  } else if (modal.isEditModal && modal.selectedItem) {
    const index = products.value.findIndex((p) => p.id === modal.selectedItem.id)
    if (index !== -1) {
      products.value[index] = {
        ...modal.selectedItem,
        ...formData.value,
        status:
          formData.value.quantity === 0
            ? 'out_of_stock'
            : formData.value.quantity! < formData.value.reorderLevel!
              ? 'low_stock'
              : 'in_stock',
      }
    }
  }
  modal.closeModal()
}

const deleteProduct = () => {
  const index = products.value.findIndex((p) => p.id === modal.selectedItem.id)
  if (index !== -1) {
    products.value.splice(index, 1)
  }
  modal.closeModal()
}

const getGradientColor = (category: string): string => {
  const gradients: Record<string, string> = {
    Тарелки: 'from-blue-400 to-blue-600',
    Чашки: 'from-orange-400 to-orange-600',
    Приборы: 'from-green-400 to-green-600',
    Миски: 'from-purple-400 to-purple-600',
    'Стеклянная посуда': 'from-cyan-400 to-cyan-600',
    'Кухонная утварь': 'from-rose-400 to-rose-600',
  }
  return gradients[category] || 'from-blue-400 to-blue-600'
}

const getStatusBadge = (status: string) => {
  const badges: Record<string, string> = {
    in_stock: 'px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium',
    low_stock: 'px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-medium',
    out_of_stock: 'px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium',
  }
  return badges[status] || 'px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-medium'
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    in_stock: 'В наличии',
    low_stock: 'Низкий запас',
    out_of_stock: 'Нет в наличии',
  }
  return labels[status] || 'Неизвестно'
}

const getProgressPercent = (quantity: number, reorderLevel: number) => {
  return Math.min((quantity / (reorderLevel * 2)) * 100, 100)
}
</script>
