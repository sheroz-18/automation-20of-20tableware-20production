<template>
  <div class="space-y-8">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-4xl font-bold text-slate-900">Управление инвентаризацией</h1>
        <p class="text-slate-600 mt-2">Отслеживание остатков товаров на складах</p>
      </div>
      <button
        @click="modal.openCreateModal('inventory')"
        class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition"
      >
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
        <select
          v-model="statusFilter"
          class="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
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
              <th class="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                Уровень переказа
              </th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                Место хранения
              </th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                Последний учет
              </th>
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
                <code class="text-sm text-slate-600 bg-slate-100 px-2 py-1 rounded">{{
                  item.productId
                }}</code>
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
                <div class="flex gap-2">
                  <button
                    @click="modal.openViewModal(item, 'inventory')"
                    class="text-blue-600 hover:text-blue-700 font-medium text-sm"
                  >
                    Просмотр
                  </button>
                  <button
                    @click="modal.openEditModal(item, 'inventory')"
                    class="text-blue-600 hover:text-blue-700 font-medium text-sm"
                  >
                    Обновить
                  </button>
                </div>
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
            <span class="font-bold text-green-900">{{ inStockCount }}</span>
          </div>
          <div class="flex items-center justify-between p-3 rounded-lg bg-orange-50">
            <span class="text-sm text-orange-700">Низкие запасы</span>
            <span class="font-bold text-orange-900">{{ lowStockCount }}</span>
          </div>
          <div class="flex items-center justify-between p-3 rounded-lg bg-red-50">
            <span class="text-sm text-red-700">Нет в наличии</span>
            <span class="font-bold text-red-900">{{ outOfStockCount }}</span>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 class="text-lg font-semibold text-slate-900 mb-4">Самые ходовые товары</h3>
        <div class="space-y-3">
          <div v-for="(item, idx) in topItems" :key="idx" class="flex items-center justify-between">
            <span class="text-sm text-slate-600">{{ item.productName }}</span>
            <span class="font-semibold text-slate-900">{{ item.quantity }} шт</span>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 class="text-lg font-semibold text-slate-900 mb-4">Требуется переказ</h3>
        <div class="space-y-3">
          <div
            v-for="item in needsRestock"
            :key="item.id"
            class="p-3 rounded-lg bg-red-50 border border-red-200"
          >
            <p class="font-medium text-red-900 text-sm">{{ item.productName }}</p>
            <p class="text-xs text-red-700 mt-1">На складе: {{ item.quantity }} шт</p>
          </div>
        </div>
      </div>
    </div>

    <ModalBase
      :is-open="modal.isOpen.value && modal.contentType.value === 'inventory'"
      :title="modal.isEditModal.value ? 'Обновить инвентаризацию' : 'Информация об инвентаризации'"
      :show-actions="true"
      :show-save-button="modal.isEditModal.value || modal.isCreateModal.value"
      @close="modal.closeModal"
      @save="saveInventory"
    >
      <div v-if="modal.isViewModal.value" class="space-y-6">
        <div class="grid grid-cols-2 gap-6">
          <div>
            <p class="text-sm text-slate-600">Товар</p>
            <p class="text-lg font-semibold text-slate-900">
              {{ modal.selectedItem?.productName }}
            </p>
          </div>
          <div>
            <p class="text-sm text-slate-600">Количество</p>
            <p class="text-lg font-semibold text-slate-900">
              {{ modal.selectedItem?.quantity }} шт
            </p>
          </div>
          <div>
            <p class="text-sm text-slate-600">Место хранения</p>
            <p class="text-lg font-semibold text-slate-900">{{ modal.selectedItem?.location }}</p>
          </div>
          <div>
            <p class="text-sm text-slate-600">Последний учет</p>
            <p class="text-lg font-semibold text-slate-900">
              {{ modal.selectedItem?.lastCounted }}
            </p>
          </div>
          <div>
            <p class="text-sm text-slate-600">Отклонение</p>
            <p
              :class="[
                'text-lg font-semibold',
                modal.selectedItem?.variance === 0
                  ? 'text-slate-900'
                  : modal.selectedItem?.variance! > 0
                    ? 'text-green-600'
                    : 'text-red-600',
              ]"
            >
              {{
                modal.selectedItem?.variance === 0
                  ? '±0'
                  : modal.selectedItem?.variance! > 0
                    ? '+' + modal.selectedItem?.variance
                    : modal.selectedItem?.variance
              }}
            </p>
          </div>
        </div>

        <div class="flex gap-2 pt-4 border-t border-slate-200">
          <button
            @click="
              () => {
                modal.openEditModal(modal.selectedItem, 'inventory')
              }
            "
            class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition"
          >
            Обновить
          </button>
          <button
            @click="modal.openDeleteModal(modal.selectedItem, 'inventory')"
            class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition"
          >
            Удалить
          </button>
        </div>
      </div>

      <div v-else class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Товар</label>
          <input
            v-model="formData.productName"
            type="text"
            class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Название товара"
          />
        </div>

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
          <label class="block text-sm font-medium text-slate-700 mb-1">Место хранения</label>
          <input
            v-model="formData.location"
            type="text"
            class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Склад А - Стеллаж 1"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Дата последнего учета</label>
          <input
            v-model="formData.lastCounted"
            type="date"
            class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Отклонение</label>
          <input
            v-model.number="formData.variance"
            type="number"
            class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0"
          />
        </div>
      </div>
    </ModalBase>

    <ModalBase
      v-if="modal.modalType.value === 'delete'"
      :is-open="modal.isOpen.value && modal.contentType.value === 'inventory'"
      title="Подтвердить удаление"
      :show-actions="true"
      @close="modal.closeModal"
    >
      <div class="space-y-4">
        <p class="text-slate-700">
          Вы уверены, что хотите удалить запись
          <strong>{{ modal.selectedItem?.productName }}</strong
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
            @click="deleteInventory"
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
import { inventoryItems as mockInventory, products as mockProducts } from '../data/mockData'
import { useModal } from '../composables/useModal'
import { useStorage } from '../composables/useStorage'
import ModalBase from '../components/ModalBase.vue'
import type { InventoryItem } from '../types'

const modal = useModal()
const storage = useStorage()

const inventory = ref<InventoryItem[]>([...mockInventory])
const products = ref([...mockProducts])
const searchQuery = ref('')
const statusFilter = ref('')

const formData = ref<Partial<InventoryItem>>({
  productName: '',
  productId: '',
  quantity: 0,
  location: '',
  lastCounted: new Date().toISOString().split('T')[0],
  variance: 0,
})

onMounted(() => {
  storage.initializeStorage(products, [], inventory, [])
  storage.watchForChanges(products, [], inventory, [])
})

const filteredInventory = computed(() => {
  return inventory.value.filter((item) => {
    const matchesSearch = item.productName.toLowerCase().includes(searchQuery.value.toLowerCase())
    const product = products.value.find((p) => p.id === item.productId)

    let matchesStatus = true
    if (statusFilter.value) {
      matchesStatus = product?.status === statusFilter.value
    }

    return matchesSearch && matchesStatus
  })
})

const inStockCount = computed(() => {
  return filteredInventory.value.filter((item) => item.quantity > 0).length
})

const lowStockCount = computed(() => {
  return filteredInventory.value.filter((item) => item.quantity > 0 && item.quantity < 100).length
})

const outOfStockCount = computed(() => {
  return filteredInventory.value.filter((item) => item.quantity === 0).length
})

const topItems = computed(() => {
  return [...filteredInventory.value].sort((a, b) => b.quantity - a.quantity).slice(0, 3)
})

const needsRestock = computed(() => {
  return filteredInventory.value.filter((item) => item.quantity === 0 || item.quantity < 100)
})

const saveInventory = () => {
  if (!formData.value.productName) {
    alert('Пожалуйста, заполните обязательные поля')
    return
  }

  if (modal.isCreateModal) {
    const newItem: InventoryItem = {
      id: Math.random().toString(36).substr(2, 9),
      productId: formData.value.productId || '',
      productName: formData.value.productName || '',
      quantity: formData.value.quantity || 0,
      location: formData.value.location || '',
      lastCounted: formData.value.lastCounted || new Date().toISOString().split('T')[0],
      variance: formData.value.variance || 0,
    }
    inventory.value.push(newItem)
  } else if (modal.isEditModal && modal.selectedItem) {
    const index = inventory.value.findIndex((i) => i.id === modal.selectedItem.id)
    if (index !== -1) {
      inventory.value[index] = {
        ...modal.selectedItem,
        ...formData.value,
      }
    }
  }
  modal.closeModal()
}

const deleteInventory = () => {
  const index = inventory.value.findIndex((i) => i.id === modal.selectedItem.id)
  if (index !== -1) {
    inventory.value.splice(index, 1)
  }
  modal.closeModal()
}

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
