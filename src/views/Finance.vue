<template>
  <div class="space-y-8">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-4xl font-bold text-slate-900">Финансовый контроль</h1>
        <p class="text-slate-600 mt-2">Управление доходами, расходами и бюджетом</p>
      </div>
      <button
        @click="modal.openCreateModal('finance')"
        class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition"
      >
        + Новая операция
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div
        class="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-sm"
      >
        <p class="text-green-100 text-sm mb-2">Общий доход</p>
        <p class="text-4xl font-bold">₽{{ totalIncome.toFixed(2) }}</p>
        <p class="text-green-100 text-sm mt-2">+{{ incomeRecords.length }} операций</p>
      </div>

      <div class="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white shadow-sm">
        <p class="text-red-100 text-sm mb-2">Общие расходы</p>
        <p class="text-4xl font-bold">₽{{ totalExpense.toFixed(2) }}</p>
        <p class="text-red-100 text-sm mt-2">+{{ expenseRecords.length }} операций</p>
      </div>

      <div
        class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-sm"
        :class="{ 'from-slate-500 to-slate-600': netBalance < 0 }"
      >
        <p class="text-blue-100 text-sm mb-2">Чистый баланс</p>
        <p class="text-4xl font-bold">₽{{ netBalance.toFixed(2) }}</p>
        <p :class="['text-sm mt-2', netBalance >= 0 ? 'text-blue-100' : 'text-slate-100']">
          {{ netBalance >= 0 ? '✓ Прибыль' : '⚠ Убыток' }}
        </p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 class="text-lg font-semibold text-slate-900 mb-6">История транзакций</h2>

        <div class="space-y-3">
          <div
            v-for="record in financialRecords"
            :key="record.id"
            class="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition cursor-pointer"
            @click="modal.openViewModal(record, 'finance')"
          >
            <div class="flex items-center gap-4">
              <div
                :class="[
                  'w-12 h-12 rounded-lg flex items-center justify-center',
                  record.type === 'income' ? 'bg-green-100' : 'bg-red-100',
                ]"
              >
                <svg
                  v-if="record.type === 'income'"
                  class="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                <svg
                  v-else
                  class="w-6 h-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M20 12H4"
                  />
                </svg>
              </div>
              <div>
                <p class="font-medium text-slate-900">{{ record.description }}</p>
                <p class="text-xs text-slate-600 mt-1">{{ record.date }} • {{ record.category }}</p>
              </div>
            </div>
            <div class="text-right">
              <p
                :class="[
                  'font-bold text-lg',
                  record.type === 'income' ? 'text-green-600' : 'text-red-600',
                ]"
              >
                {{ record.type === 'income' ? '+' : '-' }}₽{{ record.amount.toFixed(2) }}
              </p>
              <p class="text-xs text-slate-600 mt-1">{{ record.reference }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="space-y-6">
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 class="text-lg font-semibold text-slate-900 mb-4">По категориям</h3>

          <div class="space-y-3">
            <div
              v-for="category in expenseCategories"
              :key="category.name"
              class="p-3 rounded-lg bg-slate-50 cursor-pointer hover:bg-slate-100 transition"
            >
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-medium text-slate-700">{{ category.name }}</span>
                <span class="font-semibold text-slate-900">₽{{ category.amount.toFixed(2) }}</span>
              </div>
              <div class="w-full bg-slate-200 rounded-full h-2">
                <div
                  class="bg-red-600 h-2 rounded-full"
                  :style="{ width: (category.amount / totalExpense) * 100 + '%' }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 class="text-lg font-semibold text-slate-900 mb-4">Источники дохода</h3>

          <div class="space-y-3">
            <div class="flex items-center justify-between p-3 rounded-lg bg-green-50">
              <span class="text-sm font-medium text-green-700">Продажи</span>
              <span class="font-semibold text-green-900">₽{{ totalIncome.toFixed(2) }}</span>
            </div>
            <div class="flex items-center justify-between p-3 rounded-lg bg-slate-100">
              <span class="text-sm font-medium text-slate-700">Прочее</span>
              <span class="font-semibold text-slate-900">₽0</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ModalBase
      :is-open="modal.isOpen.value && modal.contentType.value === 'finance'"
      :title="
        modal.isEditModal.value
          ? 'Редактировать операцию'
          : modal.isCreateModal.value
            ? 'Новая финансовая операция'
            : 'Информация об операции'
      "
      :show-actions="true"
      :show-save-button="modal.isEditModal.value || modal.isCreateModal.value"
      @close="modal.closeModal"
      @save="saveRecord"
    >
      <div v-if="modal.isViewModal.value" class="space-y-6">
        <div class="grid grid-cols-2 gap-6">
          <div>
            <p class="text-sm text-slate-600">Описание</p>
            <p class="text-lg font-semibold text-slate-900">
              {{ modal.selectedItem.value?.description }}
            </p>
          </div>
          <div>
            <p class="text-sm text-slate-600">Сумма</p>
            <p
              :class="[
                'text-lg font-semibold',
                modal.selectedItem.value?.type === 'income' ? 'text-green-600' : 'text-red-600',
              ]"
            >
              {{ modal.selectedItem.value?.type === 'income' ? '+' : '-' }}₽{{
                modal.selectedItem.value?.amount.toFixed(2)
              }}
            </p>
          </div>
          <div>
            <p class="text-sm text-slate-600">Категория</p>
            <p class="text-lg font-semibold text-slate-900">{{ modal.selectedItem.value?.category }}</p>
          </div>
          <div>
            <p class="text-sm text-slate-600">Тип</p>
            <p class="text-lg font-semibold text-slate-900">
              {{ modal.selectedItem.value?.type === 'income' ? 'Доход' : 'Расход' }}
            </p>
          </div>
          <div>
            <p class="text-sm text-slate-600">Дата</p>
            <p class="text-lg font-semibold text-slate-900">{{ modal.selectedItem.value?.date }}</p>
          </div>
          <div>
            <p class="text-sm text-slate-600">Ссылка</p>
            <p class="text-lg font-semibold text-slate-900">{{ modal.selectedItem.value?.reference }}</p>
          </div>
        </div>

        <div class="flex gap-2 pt-4 border-t border-slate-200">
          <button
            @click="
              () => {
                modal.openEditModal(modal.selectedItem.value, 'finance')
              }
            "
            class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition"
          >
            Редактировать
          </button>
          <button
            @click="modal.openDeleteModal(modal.selectedItem.value, 'finance')"
            class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition"
          >
            Удалить
          </button>
        </div>
      </div>

      <div v-else class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Описание</label>
          <input
            v-model="formData.description"
            type="text"
            class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Введите описание операции"
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Тип</label>
            <select
              v-model="formData.type"
              class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="income">Доход</option>
              <option value="expense">Расход</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Сумма (₽)</label>
            <input
              v-model.number="formData.amount"
              type="number"
              step="0.01"
              class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0.00"
            />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Категория</label>
            <select
              v-model="formData.category"
              class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Продажи">Продажи</option>
              <option value="Производство">Производство</option>
              <option value="Заработная плата">Заработная плата</option>
              <option value="Коммунальные услуги">Коммунальные услуги</option>
              <option value="Доставка">Доставка</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Дата</label>
            <input
              v-model="formData.date"
              type="date"
              class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1"
            >Ссылка/Ссылка (опционально)</label
          >
          <input
            v-model="formData.reference"
            type="text"
            class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="ORD-2024-001 или SUPP-001"
          />
        </div>
      </div>
    </ModalBase>

    <ModalBase
      v-if="modal.modalType.value === 'delete'"
      :is-open="modal.isOpen.value && modal.contentType.value === 'finance'"
      title="Подтвердить удаление"
      :show-actions="true"
      @close="modal.closeModal"
    >
      <div class="space-y-4">
        <p class="text-slate-700">
          Вы уверены, что хотите удалить операцию
          <strong>{{ modal.selectedItem.value?.description }}</strong
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
            @click="deleteRecord"
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
import { financialRecords as mockRecords } from '../data/mockData'
import { useModal } from '../composables/useModal'
import { useStorage } from '../composables/useStorage'
import ModalBase from '../components/ModalBase.vue'
import type { FinancialRecord } from '../types'

const modal = useModal()
const storage = useStorage()

const financialRecords = ref<FinancialRecord[]>([...mockRecords])

const formData = ref<Partial<FinancialRecord>>({
  date: new Date().toISOString().split('T')[0],
  description: '',
  type: 'income',
  amount: 0,
  category: 'Продажи',
  reference: '',
})

onMounted(() => {
  storage.initializeStorage([], [], [], financialRecords)
  storage.watchForChanges([], [], [], financialRecords)
})

const incomeRecords = computed(() => financialRecords.value.filter((r) => r.type === 'income'))
const expenseRecords = computed(() => financialRecords.value.filter((r) => r.type === 'expense'))

const totalIncome = computed(() => incomeRecords.value.reduce((sum, r) => sum + r.amount, 0))
const totalExpense = computed(() => expenseRecords.value.reduce((sum, r) => sum + r.amount, 0))
const netBalance = computed(() => totalIncome.value - totalExpense.value)

const expenseCategories = computed(() => {
  const categories: Record<string, number> = {}
  expenseRecords.value.forEach((record) => {
    categories[record.category] = (categories[record.category] || 0) + record.amount
  })
  return Object.entries(categories)
    .map(([name, amount]) => ({ name, amount }))
    .sort((a, b) => b.amount - a.amount)
})

const saveRecord = () => {
  if (!formData.value.description || !formData.value.amount) {
    alert('Пожалуйста, заполните обязательные поля')
    return
  }

  if (modal.isCreateModal) {
    const newRecord: FinancialRecord = {
      id: Math.random().toString(36).substr(2, 9),
      date: formData.value.date || new Date().toISOString().split('T')[0],
      description: formData.value.description || '',
      type: (formData.value.type as 'income' | 'expense') || 'income',
      amount: formData.value.amount || 0,
      category: formData.value.category || 'Продажи',
      reference: formData.value.reference || '',
    }
    financialRecords.value.push(newRecord)
  } else if (modal.isEditModal.value && modal.selectedItem.value) {
    const index = financialRecords.value.findIndex((r) => r.id === modal.selectedItem.value?.id)
    if (index !== -1) {
      financialRecords.value[index] = {
        ...modal.selectedItem.value,
        ...formData.value,
      }
    }
  }
  modal.closeModal()
}

const deleteRecord = () => {
  const index = financialRecords.value.findIndex((r) => r.id === modal.selectedItem.value?.id)
  if (index !== -1) {
    financialRecords.value.splice(index, 1)
  }
  modal.closeModal()
}
</script>
