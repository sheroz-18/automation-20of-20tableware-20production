<template>
  <div class="space-y-8">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-4xl font-bold text-slate-900">Планирование производства</h1>
        <p class="text-slate-600 mt-2">Управление производственными партиями</p>
      </div>
      <button
        @click="openCreateModal('batch')"
        class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition"
      >
        + Новая партия
      </button>
    </div>

    <div class="flex gap-4 flex-wrap">
      <div class="flex-1 min-w-64 bg-white rounded-lg border border-slate-200 p-4">
        <label class="text-sm font-medium text-slate-700 block mb-2">Поиск</label>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Поиск по названию или номеру партии..."
          class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div class="bg-white rounded-lg border border-slate-200 p-4">
        <label class="text-sm font-medium text-slate-700 block mb-2">Статус</label>
        <select
          v-model="statusFilter"
          class="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Все статусы</option>
          <option value="planning">Планирование</option>
          <option value="in_progress">В процессе</option>
          <option value="completed">Завершено</option>
          <option value="cancelled">Отменено</option>
        </select>
      </div>
    </div>

    <div class="bg-white rounded-lg border border-slate-200 overflow-hidden">
      <table class="w-full">
        <thead class="bg-slate-50 border-b border-slate-200">
          <tr>
            <th class="px-6 py-4 text-left text-sm font-semibold text-slate-900">Номер партии</th>
            <th class="px-6 py-4 text-left text-sm font-semibold text-slate-900">Продукт</th>
            <th class="px-6 py-4 text-left text-sm font-semibold text-slate-900">Количество</th>
            <th class="px-6 py-4 text-left text-sm font-semibold text-slate-900">Текущий этап</th>
            <th class="px-6 py-4 text-left text-sm font-semibold text-slate-900">Статус</th>
            <th class="px-6 py-4 text-left text-sm font-semibold text-slate-900">Действия</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-200">
          <tr v-for="batch in filteredBatches" :key="batch.id" class="hover:bg-slate-50 transition">
            <td class="px-6 py-4 text-sm font-medium text-slate-900">{{ batch.batchNumber }}</td>
            <td class="px-6 py-4 text-sm text-slate-600">
              <div>
                <p class="font-medium text-slate-900">{{ batch.productName }}</p>
                <p class="text-xs text-slate-500">{{ batch.category }}</p>
              </div>
            </td>
            <td class="px-6 py-4 text-sm text-slate-900 font-semibold">{{ batch.quantity }} шт</td>
            <td class="px-6 py-4 text-sm">
              <span class="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                {{ batch.currentStage }}/5: {{ getCurrentStageName(batch) }}
              </span>
            </td>
            <td class="px-6 py-4 text-sm">
              <span :class="getStatusBadge(batch.status)">
                {{ getStatusLabel(batch.status) }}
              </span>
            </td>
            <td class="px-6 py-4 text-sm">
              <div class="flex gap-2">
                <button
                  @click="openEditModal(batch, 'batch')"
                  class="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded font-medium transition"
                >
                  Редактировать
                </button>
                <button
                  @click="openViewModal(batch, 'batch')"
                  class="px-3 py-1 text-slate-600 hover:bg-slate-100 rounded font-medium transition"
                >
                  Подробнее
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="filteredBatches.length === 0">
            <td colspan="7" class="px-6 py-12 text-center text-slate-600">
              <p class="text-lg font-medium">Нет найденных партий</p>
              <p class="text-sm mt-1">Попробуйте изменить фильтры или создайте новую партию</p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <ModalBase
      :is-open="modal.isOpen.value && modal.contentType.value === 'batch'"
      :title="
        modal.isCreateModal.value
          ? 'Создать партию'
          : modal.isEditModal.value
            ? 'Редактировать партию'
            : 'Информация о партии'
      "
      :show-actions="true"
      :show-save-button="modal.isCreateModal.value || modal.isEditModal.value"
      @close="modal.closeModal"
      @save="saveBatch"
    >
      <div v-if="modal.isViewModal.value" class="space-y-6">
        <div class="grid grid-cols-2 gap-6">
          <div>
            <p class="text-sm text-gray-700">Номер партии</p>
            <p class="text-lg font-semibold text-slate-900">
              {{ modal.selectedItem.value?.batchNumber }}
            </p>
          </div>
          <div>
            <p class="text-sm text-gray-700">Статус</p>
            <span :class="getStatusBadge(modal.selectedItem.value?.status)">
              {{ getStatusLabel(modal.selectedItem.value?.status) }}
            </span>
          </div>
          <div>
            <p class="text-sm text-gray-700">Продукт</p>
            <p class="text-lg font-semibold text-slate-900">
              {{ modal.selectedItem.value?.productName }}
            </p>
          </div>
          <div>
            <p class="text-sm text-gray-700">Категория</p>
            <p class="text-lg font-semibold text-slate-900">
              {{ modal.selectedItem.value?.category }}
            </p>
          </div>
          <div>
            <p class="text-sm text-gray-700">Количество</p>
            <p class="text-lg font-semibold text-slate-900">
              {{ modal.selectedItem.value?.quantity }} шт
            </p>
          </div>
          <div>
            <p class="text-sm text-gray-700">Дата начала</p>
            <p class="text-lg font-semibold text-slate-900">
              {{ formatDate(modal.selectedItem.value?.startDate) }}
            </p>
          </div>
          <div>
            <p class="text-sm text-gray-700">Дата завершения</p>
            <p class="text-lg font-semibold text-slate-900">
              {{ formatDate(modal.selectedItem.value?.endDate) }}
            </p>
          </div>
          <div>
            <p class="text-sm text-gray-700">Дата создания</p>
            <p class="text-lg font-semibold text-slate-900">
              {{ formatDate(modal.selectedItem.value?.createdDate) }}
            </p>
          </div>
        </div>

        <div class="border-t border-slate-200 pt-6">
          <p class="text-sm font-semibold text-gray-700 mb-4">Этапы производства</p>
          <div class="space-y-3">
            <div
              v-for="stage in modal.selectedItem.value?.stages"
              :key="stage.stageNumber"
              class="flex items-center gap-4 p-4 rounded-lg"
              :class="[
                stage.completed
                  ? 'bg-green-50 border border-green-200'
                  : stage.stageNumber === modal.selectedItem.value?.currentStage
                    ? 'bg-blue-50 border border-blue-200'
                    : 'bg-slate-50 border border-slate-200',
              ]"
            >
              <div class="flex-shrink-0">
                <div
                  class="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-white"
                  :class="[
                    stage.completed
                      ? 'bg-green-600'
                      : stage.stageNumber === modal.selectedItem.value?.currentStage
                        ? 'bg-blue-600'
                        : 'bg-slate-400',
                  ]"
                >
                  {{ stage.stageNumber }}
                </div>
              </div>
              <div class="flex-1">
                <p class="font-medium text-slate-900 capitalize">{{ stage.stageName }}</p>
                <p v-if="stage.completedDate" class="text-sm text-slate-600">
                  Завершено: {{ formatDate(stage.completedDate) }}
                </p>
              </div>
              <div v-if="stage.completed" class="flex-shrink-0 text-green-600">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>

          <button
            v-if="
              modal.selectedItem.value?.currentStage &&
              modal.selectedItem.value.currentStage < 5 &&
              modal.selectedItem.value?.status !== 'completed'
            "
            @click="advanceStage"
            class="mt-4 w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition"
          >
            Перейти к следующему этапу ({{ (modal.selectedItem.value?.currentStage || 0) + 1 }}/5)
          </button>
        </div>

        <div class="flex gap-2 pt-4 border-t border-slate-200">
          <button
            @click="
              () => {
                modal.openEditModal(modal.selectedItem, 'batch')
              }
            "
            class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition"
          >
            Редактировать
          </button>
          <button
            @click="modal.openDeleteModal(modal.selectedItem.value, 'batch')"
            class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition"
          >
            Удалить
          </button>
        </div>
      </div>

      <div v-else class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Номер партии</label>
          <input
            v-model="formData.batchNumber"
            type="text"
            class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            placeholder="BATCH-2024-001"
            :disabled="!modal.isCreateModal.value"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Продукт</label>
          <select
            v-model="formData.productId"
            class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
          >
            <option value="">Выберите продукт</option>
            <option v-for="product in products" :key="product.id" :value="product.id">
              {{ product.name }} ({{ product.category }})
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Количество (шт)</label>
          <input
            v-model.number="formData.quantity"
            type="number"
            class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            placeholder="500"
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Дата начала</label>
            <input
              v-model="formData.startDate"
              type="date"
              class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Дата завершения</label>
            <input
              v-model="formData.endDate"
              type="date"
              class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Статус</label>
          <select
            v-model="formData.status"
            class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
          >
            <option value="planning">Планирование</option>
            <option value="in_progress">В процессе</option>
            <option value="completed">Завершено</option>
            <option value="cancelled">Отменено</option>
          </select>
        </div>
      </div>
    </ModalBase>

    <ModalBase
      v-if="modal.modalType.value === 'delete'"
      :is-open="modal.isOpen.value && modal.contentType.value === 'batch'"
      title="Подтвердить удаление"
      :show-actions="true"
      @close="modal.closeModal"
    >
      <div class="space-y-4">
        <p class="text-slate-700">
          Вы уверены, что хотите удалить партию
          <strong>{{ modal.selectedItem.value?.batchNumber }}</strong
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
            @click="deleteBatch"
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
import { ref, computed } from 'vue'
import { useModal } from '../composables/useModal'
import { useAppState } from '../composables/useAppState'
import ModalBase from '../components/ModalBase.vue'
import type { ProductionBatch, ProductionStage } from '../types'

const modal = useModal()
const { products, productionBatches } = useAppState()

const searchQuery = ref('')
const statusFilter = ref('')

const PRODUCTION_STAGES_LIST: ProductionStage[] = [
  { stageNumber: 1, stageName: 'подготовка сырья', completed: false },
  { stageNumber: 2, stageName: 'формовка', completed: false },
  { stageNumber: 3, stageName: 'обжиг/обработка', completed: false },
  { stageNumber: 4, stageName: 'упаковка', completed: false },
  { stageNumber: 5, stageName: 'готовность', completed: false },
]

const formData = ref<Partial<ProductionBatch>>({
  batchNumber: '',
  productId: '',
  quantity: 0,
  startDate: '',
  endDate: '',
  status: 'planning',
  currentStage: 1,
  stages: [],
})

const filteredBatches = computed(() => {
  return productionBatches.value.filter((batch) => {
    const matchesSearch =
      batch.batchNumber.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      batch.productName.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesStatus = !statusFilter.value || batch.status === statusFilter.value
    return matchesSearch && matchesStatus
  })
})

const initializeStages = (): ProductionStage[] => {
  return JSON.parse(JSON.stringify(PRODUCTION_STAGES_LIST))
}

const openCreateModal = (type: any) => {
  const nextBatchNumber = `BATCH-2024-${String(productionBatches.value.length + 1).padStart(3, '0')}`
  formData.value = {
    batchNumber: nextBatchNumber,
    productId: '',
    quantity: 0,
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    status: 'planning',
    currentStage: 1,
    stages: initializeStages(),
  }
  modal.openCreateModal(type)
}

const openEditModal = (batch: ProductionBatch, type: any) => {
  formData.value = { ...batch }
  modal.openEditModal(batch, type)
}

const openViewModal = (batch: ProductionBatch, type: any) => {
  modal.openViewModal(batch, type)
}

const saveBatch = () => {
  if (!formData.value.batchNumber || !formData.value.productId || !formData.value.quantity) {
    alert('Пожалуйста, заполните обязательные поля')
    return
  }

  if (formData.value.startDate && formData.value.endDate) {
    if (new Date(formData.value.startDate) > new Date(formData.value.endDate)) {
      alert('Дата начала не может быть позже даты завершения')
      return
    }
  }

  if (modal.isCreateModal.value) {
    const selectedProduct = products.value.find((p) => p.id === formData.value.productId)
    const newBatch: ProductionBatch = {
      id: Math.random().toString(36).substr(2, 9),
      batchNumber: formData.value.batchNumber || '',
      productId: formData.value.productId || '',
      productName: selectedProduct?.name || '',
      quantity: formData.value.quantity || 0,
      status: (formData.value.status as any) || 'planning',
      startDate: formData.value.startDate || '',
      endDate: formData.value.endDate || '',
      createdDate: new Date().toISOString().split('T')[0],
      category: selectedProduct?.category || '',
      currentStage: 1,
      stages: initializeStages(),
    }
    productionBatches.value.push(newBatch)
  } else if (modal.isEditModal.value && modal.selectedItem.value) {
    const index = productionBatches.value.findIndex((b) => b.id === modal.selectedItem.value?.id)
    if (index !== -1) {
      const selectedProduct = products.value.find((p) => p.id === formData.value.productId)
      productionBatches.value[index] = {
        ...modal.selectedItem.value,
        ...formData.value,
        productName: selectedProduct?.name || modal.selectedItem.value.productName,
        category: selectedProduct?.category || modal.selectedItem.value.category,
      } as ProductionBatch
    }
  }
  modal.closeModal()
}

const deleteBatch = () => {
  const index = productionBatches.value.findIndex((b) => b.id === modal.selectedItem.value?.id)
  if (index !== -1) {
    productionBatches.value.splice(index, 1)
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

const getStatusBadge = (status: string | undefined) => {
  const badges: Record<string, string> = {
    planning: 'px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium',
    in_progress: 'px-3 py-1 bg-orange-100 text-orange-700 rounded-lg text-xs font-medium',
    completed: 'px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-medium',
    cancelled: 'px-3 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-medium',
  }
  return (
    badges[status || 'planning'] ||
    'px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium'
  )
}

const getStatusLabel = (status: string | undefined) => {
  const labels: Record<string, string> = {
    planning: 'Планирование',
    in_progress: 'В процессе',
    completed: 'Завершено',
    cancelled: 'Отменено',
  }
  return labels[status || 'planning'] || 'Неизвестно'
}

const getCurrentStageName = (batch: ProductionBatch | undefined): string => {
  if (!batch) return ''
  const currentStage = batch.stages?.find((s) => s.stageNumber === batch.currentStage)
  return currentStage ? currentStage.stageName : ''
}

const advanceStage = () => {
  if (!modal.selectedItem.value) return

  const batch = modal.selectedItem.value
  if (batch.currentStage >= 5) return

  const index = productionBatches.value.findIndex((b) => b.id === batch.id)
  if (index === -1) return

  const nextStageNumber = batch.currentStage + 1
  const stageIndex = batch.stages.findIndex((s) => s.stageNumber === batch.currentStage)

  if (stageIndex !== -1) {
    productionBatches.value[index].stages[stageIndex].completed = true
    productionBatches.value[index].stages[stageIndex].completedDate = new Date()
      .toISOString()
      .split('T')[0]
  }

  productionBatches.value[index].currentStage = nextStageNumber

  if (nextStageNumber === 5) {
    productionBatches.value[index].status = 'completed'
  }

  modal.selectedItem.value = productionBatches.value[index]
}
</script>
