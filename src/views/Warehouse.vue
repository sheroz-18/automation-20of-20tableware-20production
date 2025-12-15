<template>
  <div class="space-y-8">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-4xl font-bold text-slate-900">Управление складом</h1>
        <p class="text-slate-600 mt-2">Контроль сырья, готовой продукции и остатков</p>
      </div>
      <button
        @click="openCreateModal(activeTab)"
        class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition"
      >
        {{ activeTab === 'raw' ? '+ Новое сырье' : '+ Новый товар' }}
      </button>
    </div>

    <div class="flex gap-4 border-b border-slate-200">
      <button
        @click="activeTab = 'raw'"
        :class="[
          'px-6 py-3 font-medium transition-colors border-b-2',
          activeTab === 'raw'
            ? 'text-blue-600 border-blue-600'
            : 'text-slate-600 border-transparent hover:text-slate-900',
        ]"
      >
        Сырье ({{ rawMaterials.length }})
      </button>
      <button
        @click="activeTab = 'finished'"
        :class="[
          'px-6 py-3 font-medium transition-colors border-b-2',
          activeTab === 'finished'
            ? 'text-blue-600 border-blue-600'
            : 'text-slate-600 border-transparent hover:text-slate-900',
        ]"
      >
        Готовая продукция ({{ finishedGoods.length }})
      </button>
      <button
        @click="activeTab = 'movements'"
        :class="[
          'px-6 py-3 font-medium transition-colors border-b-2',
          activeTab === 'movements'
            ? 'text-blue-600 border-blue-600'
            : 'text-slate-600 border-transparent hover:text-slate-900',
        ]"
      >
        История движений ({{ stockMovements.length }})
      </button>
    </div>

    <div v-if="activeTab === 'raw'" class="space-y-6">
      <div class="flex gap-4 flex-wrap">
        <div class="flex-1 min-w-64 bg-white rounded-lg border border-slate-200 p-4">
          <label class="text-sm font-medium text-slate-700 block mb-2">Поиск</label>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Поиск по названию или поставщику..."
            class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div class="bg-white rounded-lg border border-slate-200 p-4">
          <label class="text-sm font-medium text-slate-700 block mb-2">Фильтр</label>
          <select
            v-model="materialTypeFilter"
            class="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Все типы</option>
            <option value="clay">Глина</option>
            <option value="metal">Металл</option>
            <option value="glass">Стекло</option>
            <option value="plastic">Пластик</option>
            <option value="other">Прочее</option>
          </select>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-4">
        <div
          v-for="material in filteredRawMaterials"
          :key="material.id"
          class="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-md transition"
        >
          <div class="flex items-start justify-between mb-4">
            <div>
              <h3 class="text-lg font-semibold text-slate-900">{{ material.name }}</h3>
              <p class="text-sm text-slate-600 mt-1">
                {{ getMaterialTypeLabel(material.materialType) }}
              </p>
            </div>
            <span
              :class="[
                'px-3 py-1 rounded-lg text-xs font-medium',
                material.quantity < material.minStockLevel
                  ? 'bg-red-100 text-red-700'
                  : material.quantity < material.minStockLevel * 1.5
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-green-100 text-green-700',
              ]"
            >
              {{
                material.quantity < material.minStockLevel
                  ? 'Критический уровень'
                  : material.quantity < material.minStockLevel * 1.5
                    ? 'Низкий запас'
                    : 'Норма'
              }}
            </span>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <p class="text-xs text-slate-600">Количество</p>
              <p class="text-xl font-bold text-slate-900">
                {{ material.quantity }} {{ material.unit }}
              </p>
            </div>
            <div>
              <p class="text-xs text-slate-600">Минимум</p>
              <p class="text-xl font-bold text-slate-900">
                {{ material.minStockLevel }} {{ material.unit }}
              </p>
            </div>
            <div>
              <p class="text-xs text-slate-600">Стоимость за ед.</p>
              <p class="text-xl font-bold text-slate-900">SM{{ material.unitCost }}</p>
            </div>
            <div>
              <p class="text-xs text-slate-600">Общая стоимость</p>
              <p class="text-xl font-bold text-slate-900">
                SM{{ (material.quantity * material.unitCost).toFixed(2) }}
              </p>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4 mb-4 text-sm">
            <div>
              <p class="text-slate-600">
                Поставщик: <span class="font-semibold text-slate-900">{{ material.supplier }}</span>
              </p>
            </div>
            <div>
              <p class="text-slate-600">
                Последнее пополнение:
                <span class="font-semibold text-slate-900">{{
                  formatDate(material.lastRestocked)
                }}</span>
              </p>
            </div>
          </div>

          <div
            v-if="material.expiryDate"
            class="mb-4 p-3 bg-orange-50 border border-orange-200 rounded"
          >
            <p class="text-sm text-orange-700">
              <strong>Срок годности:</strong> {{ formatDate(material.expiryDate) }}
            </p>
          </div>

          <div class="flex gap-2">
            <button
              @click="openEditModal(material, 'raw')"
              class="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition"
            >
              Редактировать
            </button>
            <button
              @click="openStockMovementModal(material, 'raw')"
              class="flex-1 px-3 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 text-sm font-medium transition"
            >
              Приходо-расход
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="activeTab === 'finished'" class="space-y-6">
      <div class="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <table class="w-full">
          <thead class="bg-slate-50 border-b border-slate-200">
            <tr>
              <th class="px-6 py-4 text-left text-sm font-semibold text-slate-900">Товар</th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-slate-900">SKU</th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-slate-900">Количество</th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-slate-900">Минимум</th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-slate-900">Статус</th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-slate-900">Действия</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200">
            <tr v-for="good in finishedGoods" :key="good.id" class="hover:bg-slate-50 transition">
              <td class="px-6 py-4 text-sm">
                <div>
                  <p class="font-medium text-slate-900">{{ good.name }}</p>
                  <p class="text-xs text-slate-500">{{ good.category }}</p>
                </div>
              </td>
              <td class="px-6 py-4 text-sm font-mono text-slate-600">{{ good.sku }}</td>
              <td class="px-6 py-4 text-sm font-semibold text-slate-900">{{ good.quantity }} шт</td>
              <td class="px-6 py-4 text-sm text-slate-600">{{ good.minStockLevel }} шт</td>
              <td class="px-6 py-4 text-sm">
                <span
                  :class="[
                    'px-3 py-1 rounded-lg text-xs font-medium',
                    good.quantity < good.minStockLevel
                      ? 'bg-red-100 text-red-700'
                      : good.quantity < good.minStockLevel * 1.5
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-green-100 text-green-700',
                  ]"
                >
                  {{
                    good.quantity === 0
                      ? 'Нет в наличии'
                      : good.quantity < good.minStockLevel
                        ? 'Критический уровень'
                        : good.quantity < good.minStockLevel * 1.5
                          ? 'Низкий запас'
                          : 'В наличии'
                  }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm">
                <div class="flex gap-2">
                  <button
                    @click="openStockMovementModal(good, 'finished')"
                    class="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded font-medium transition"
                  >
                    Движение
                  </button>
                  <button
                    @click="openEditModal(good, 'finished')"
                    class="px-3 py-1 text-slate-600 hover:bg-slate-100 rounded font-medium transition"
                  >
                    Редактировать
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="activeTab === 'movements'" class="space-y-6">
      <div class="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <table class="w-full">
          <thead class="bg-slate-50 border-b border-slate-200">
            <tr>
              <th class="px-6 py-4 text-left text-sm font-semibold text-slate-900">Дата</th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-slate-900">Наименование</th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-slate-900">Тип движения</th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-slate-900">Количество</th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-slate-900">Ссылка</th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-slate-900">Примечание</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200">
            <tr
              v-for="movement in stockMovements"
              :key="movement.id"
              class="hover:bg-slate-50 transition"
            >
              <td class="px-6 py-4 text-sm text-slate-600">{{ formatDate(movement.date) }}</td>
              <td class="px-6 py-4 text-sm font-medium text-slate-900">
                <div>
                  <p>{{ movement.itemName }}</p>
                  <p class="text-xs text-slate-500">
                    {{ movement.itemType === 'raw_material' ? 'Сырье' : 'Готовый товар' }}
                  </p>
                </div>
              </td>
              <td class="px-6 py-4 text-sm">
                <span
                  :class="[
                    'px-3 py-1 rounded-lg text-xs font-medium',
                    movement.movementType === 'in'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-orange-100 text-orange-700',
                  ]"
                >
                  {{ movement.movementType === 'in' ? 'Приход' : 'Расход' }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm font-semibold text-slate-900">
                {{ movement.quantity }}
              </td>
              <td class="px-6 py-4 text-sm font-mono text-slate-600">{{ movement.reference }}</td>
              <td class="px-6 py-4 text-sm text-slate-600">{{ movement.notes || '-' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <ModalBase
      :is-open="
        modal.isOpen.value &&
        (modal.contentType.value === 'raw' || modal.contentType.value === 'finished')
      "
      :title="
        modal.isCreateModal.value
          ? activeTab === 'raw'
            ? 'Добавить сырье'
            : 'Добавить товар'
          : 'Редактировать'
      "
      :show-actions="true"
      :show-save-button="!modal.isViewModal.value"
      @close="modal.closeModal"
      @save="saveMaterial"
    >
      <div class="space-y-4">
        <div v-if="activeTab === 'raw'">
          <label class="block text-sm font-medium text-gray-700 mb-1">Наименование</label>
          <input
            v-model="formData.name"
            type="text"
            class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            placeholder="Название материала"
          />
        </div>

        <div v-if="activeTab === 'raw'">
          <label class="block text-sm font-medium text-gray-700 mb-1">Тип материала</label>
          <select
            v-model="formData.materialType"
            class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
          >
            <option value="clay">Глина</option>
            <option value="metal">Металл</option>
            <option value="glass">Стекло</option>
            <option value="plastic">Пластик</option>
            <option value="other">Прочее</option>
          </select>
        </div>

        <div v-if="activeTab === 'raw'">
          <label class="block text-sm font-medium text-gray-700 mb-1">Единица измерения</label>
          <select
            v-model="formData.unit"
            class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
          >
            <option value="кг">кг</option>
            <option value="г">г</option>
            <option value="л">л</option>
            <option value="листы">листы</option>
            <option value="штуки">штуки</option>
          </select>
        </div>

        <div v-if="activeTab === 'finished'">
          <label class="block text-sm font-medium text-gray-700 mb-1">SKU</label>
          <input
            v-model="formData.sku"
            type="text"
            class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            placeholder="PLATE-001"
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Количество</label>
            <input
              v-model.number="formData.quantity"
              type="number"
              class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
              placeholder="0"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Минимум</label>
            <input
              v-model.number="formData.minStockLevel"
              type="number"
              class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
              placeholder="0"
            />
          </div>
        </div>

        <div v-if="activeTab === 'raw'">
          <label class="block text-sm font-medium text-gray-700 mb-1">Цена за единицу (SM)</label>
          <input
            v-model.number="formData.unitCost"
            type="number"
            step="0.01"
            class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            placeholder="0.00"
          />
        </div>

        <div v-if="activeTab === 'raw'">
          <label class="block text-sm font-medium text-gray-700 mb-1">Поставщик</label>
          <input
            v-model="formData.supplier"
            type="text"
            class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            placeholder="Название поставщика"
          />
        </div>

        <div v-if="activeTab === 'raw'">
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Срок годности (опционально)</label
          >
          <input
            v-model="formData.expiryDate"
            type="date"
            class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
          />
        </div>

        <div v-if="activeTab === 'finished'">
          <label class="block text-sm font-medium text-gray-700 mb-1">Категория</label>
          <select
            v-model="formData.category"
            class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
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
    </ModalBase>

    <ModalBase
      :is-open="modal.isOpen.value && modal.contentType.value === 'movement'"
      title="Приходо-расход"
      :show-actions="true"
      :show-save-button="true"
      @close="modal.closeModal"
      @save="saveMovement"
    >
      <div class="space-y-4">
        <div>
          <p class="text-sm font-medium text-gray-700 mb-2">
            Товар: <span class="font-semibold">{{ movementFormData.itemName }}</span>
          </p>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Тип операции</label>
            <select
              v-model="movementFormData.movementType"
              class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            >
              <option value="in">Приход</option>
              <option value="out">Расход</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Количество</label>
            <input
              v-model.number="movementFormData.quantity"
              type="number"
              class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
              placeholder="0"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Ссылка/Номер документа</label>
          <input
            v-model="movementFormData.reference"
            type="text"
            class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            placeholder="ORD-2024-001, BATCH-2024-001"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Примечание</label>
          <textarea
            v-model="movementFormData.notes"
            class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            rows="3"
            placeholder="Введите примечание..."
          ></textarea>
        </div>
      </div>
    </ModalBase>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useModal } from '../composables/useModal'
import { useAppState } from '../composables/useAppState'
import ModalBase from '../components/ModalBase.vue'
import type { RawMaterial, FinishedGood, StockMovement } from '../types'

const modal = useModal()
const { rawMaterials, finishedGoods, stockMovements } = useAppState()

const activeTab = ref<'raw' | 'finished' | 'movements'>('raw')
const searchQuery = ref('')
const materialTypeFilter = ref('')

const formData = ref<Partial<RawMaterial & FinishedGood>>({
  name: '',
  materialType: 'clay',
  unit: 'кг',
  quantity: 0,
  minStockLevel: 0,
  unitCost: 0,
  supplier: '',
  sku: '',
  category: 'Тарелки',
})

const movementFormData = ref<Partial<StockMovement>>({
  movementType: 'in',
  quantity: 0,
  reference: '',
  notes: '',
  itemName: '',
  itemId: '',
  itemType: 'raw_material',
})

const filteredRawMaterials = computed(() => {
  return rawMaterials.value.filter((material) => {
    const matchesSearch =
      material.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      material.supplier.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesType =
      !materialTypeFilter.value || material.materialType === materialTypeFilter.value
    return matchesSearch && matchesType
  })
})

const openCreateModal = (type: string) => {
  if (type === 'raw') {
    formData.value = {
      name: '',
      materialType: 'clay',
      unit: 'кг',
      quantity: 0,
      minStockLevel: 0,
      unitCost: 0,
      supplier: '',
    }
  } else {
    formData.value = {
      name: '',
      sku: '',
      quantity: 0,
      minStockLevel: 0,
      category: 'Тарелки',
    }
  }
  modal.openCreateModal(type)
}

const openEditModal = (item: RawMaterial | FinishedGood, type: string) => {
  formData.value = { ...item }
  modal.openEditModal(item, type)
}

const openStockMovementModal = (item: RawMaterial | FinishedGood, type: string) => {
  const itemType = type === 'raw' ? 'raw_material' : 'finished_good'
  movementFormData.value = {
    movementType: 'out',
    quantity: 0,
    reference: '',
    notes: '',
    itemName: item.name,
    itemId: item.id,
    itemType: itemType,
  }
  modal.openCreateModal('movement')
}

const saveMaterial = () => {
  if (!formData.value.name) {
    alert('Пожалуйста, введите название')
    return
  }

  if (activeTab.value === 'raw') {
    if (modal.isCreateModal.value) {
      const newMaterial: RawMaterial = {
        id: Math.random().toString(36).substr(2, 9),
        name: formData.value.name || '',
        materialType: (formData.value.materialType as any) || 'clay',
        unit: formData.value.unit || 'кг',
        quantity: formData.value.quantity || 0,
        minStockLevel: formData.value.minStockLevel || 0,
        unitCost: formData.value.unitCost || 0,
        supplier: formData.value.supplier || '',
        lastRestocked: new Date().toISOString().split('T')[0],
        expiryDate: formData.value.expiryDate,
      }
      rawMaterials.value.push(newMaterial)
    } else if (modal.isEditModal.value && modal.selectedItem.value) {
      const index = rawMaterials.value.findIndex((m) => m.id === modal.selectedItem.value?.id)
      if (index !== -1) {
        rawMaterials.value[index] = {
          ...modal.selectedItem.value,
          ...formData.value,
        } as RawMaterial
      }
    }
  } else {
    if (modal.isCreateModal.value) {
      const newGood: FinishedGood = {
        id: Math.random().toString(36).substr(2, 9),
        name: formData.value.name || '',
        sku: formData.value.sku || '',
        quantity: formData.value.quantity || 0,
        minStockLevel: formData.value.minStockLevel || 0,
        category: formData.value.category || 'Тарелки',
        readyDate: new Date().toISOString().split('T')[0],
      }
      finishedGoods.value.push(newGood)
    } else if (modal.isEditModal.value && modal.selectedItem.value) {
      const index = finishedGoods.value.findIndex((g) => g.id === modal.selectedItem.value?.id)
      if (index !== -1) {
        finishedGoods.value[index] = {
          ...modal.selectedItem.value,
          ...formData.value,
        } as FinishedGood
      }
    }
  }
  modal.closeModal()
}

const saveMovement = () => {
  if (!movementFormData.value.quantity || !movementFormData.value.reference) {
    alert('Пожалуйста, заполните обязательные поля')
    return
  }

  const newMovement: StockMovement = {
    id: Math.random().toString(36).substr(2, 9),
    itemId: movementFormData.value.itemId || '',
    itemName: movementFormData.value.itemName || '',
    itemType: (movementFormData.value.itemType as any) || 'raw_material',
    movementType: (movementFormData.value.movementType as any) || 'in',
    quantity: movementFormData.value.quantity || 0,
    date: new Date().toISOString().split('T')[0],
    reference: movementFormData.value.reference || '',
    notes: movementFormData.value.notes,
  }

  stockMovements.value.unshift(newMovement)

  if (movementFormData.value.itemType === 'raw_material') {
    const materialIndex = rawMaterials.value.findIndex(
      (m) => m.id === movementFormData.value.itemId,
    )
    if (materialIndex !== -1) {
      if (movementFormData.value.movementType === 'in') {
        rawMaterials.value[materialIndex].quantity += movementFormData.value.quantity || 0
      } else {
        rawMaterials.value[materialIndex].quantity = Math.max(
          0,
          rawMaterials.value[materialIndex].quantity - (movementFormData.value.quantity || 0),
        )
      }
    }
  } else {
    const goodIndex = finishedGoods.value.findIndex((g) => g.id === movementFormData.value.itemId)
    if (goodIndex !== -1) {
      if (movementFormData.value.movementType === 'in') {
        finishedGoods.value[goodIndex].quantity += movementFormData.value.quantity || 0
      } else {
        finishedGoods.value[goodIndex].quantity = Math.max(
          0,
          finishedGoods.value[goodIndex].quantity - (movementFormData.value.quantity || 0),
        )
      }
    }
  }

  modal.closeModal()
}

const formatDate = (date: string | undefined): string => {
  if (!date) return '-'
  const d = new Date(date)
  return d.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const getMaterialTypeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    clay: 'Глина',
    metal: 'Металл',
    glass: 'Стекло',
    plastic: 'Пластик',
    other: 'Прочее',
  }
  return labels[type] || 'Неизвестно'
}
</script>
