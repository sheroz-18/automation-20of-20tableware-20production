<template>
  <div class="space-y-8">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-4xl font-bold text-slate-900">Управление заказами</h1>
        <p class="text-slate-600 mt-2">Отслеживание и управление заказами клиентов</p>
      </div>
      <button
        @click="modal.openCreateModal('order')"
        class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition"
      >
        + Новый заказ
      </button>
    </div>

    <div class="flex gap-4 flex-wrap">
      <div class="flex-1 min-w-64 bg-white rounded-lg border border-slate-200 p-4">
        <label class="text-sm font-medium text-slate-700 block mb-2">Поиск заказа</label>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Поиск по номеру или клиенту..."
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
          <option value="принят">Принят</option>
          <option value="в производстве">В производстве</option>
          <option value="на складе">На складе</option>
          <option value="отправлен">Отправлен</option>
        </select>
      </div>
      <div class="bg-white rounded-lg border border-slate-200 p-4">
        <label class="text-sm font-medium text-slate-700 block mb-2">Тип клиента</label>
        <select
          v-model="customerTypeFilter"
          class="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Все типы</option>
          <option value="shop">Магазин</option>
          <option value="wholesale">Оптовик</option>
        </select>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
      <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-sm">
        <p class="text-blue-100 text-sm mb-1">Всего заказов</p>
        <p class="text-3xl font-bold">{{ orders.length }}</p>
      </div>
      <div
        class="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-sm"
      >
        <p class="text-orange-100 text-sm mb-1">В производстве</p>
        <p class="text-3xl font-bold">{{ ordersByStatus('в производстве').length }}</p>
      </div>
      <div
        class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-sm"
      >
        <p class="text-purple-100 text-sm mb-1">На складе</p>
        <p class="text-3xl font-bold">{{ ordersByStatus('на складе').length }}</p>
      </div>
      <div
        class="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-sm"
      >
        <p class="text-green-100 text-sm mb-1">Общая сумма</p>
        <p class="text-3xl font-bold">ЅМ{{ totalOrderValue.toFixed(0) }}</p>
      </div>
    </div>

    <div class="space-y-4">
      <div
        v-for="order in filteredOrders"
        :key="order.id"
        class="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition"
      >
        <div class="flex items-start justify-between mb-4">
          <div>
            <h3 class="font-semibold text-slate-900 text-lg">{{ order.orderNumber }}</h3>
            <p class="text-slate-600 text-sm mt-1">
              {{ order.customerName }}
              <span
                class="ml-2 px-2 py-1 rounded text-xs font-medium"
                :class="
                  order.customerType === 'wholesale'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'bg-amber-100 text-amber-700'
                "
              >
                {{ order.customerType === 'wholesale' ? 'Оптовик' : 'Магазин' }}
              </span>
            </p>
          </div>
          <div class="text-right">
            <p class="font-bold text-slate-900 text-lg">ЅМ{{ order.totalAmount.toFixed(2) }}</p>
            <span :class="getStatusBadge(order.status)">
              {{ order.status }}
            </span>
          </div>
        </div>

        <div class="mb-4 pb-4 border-b border-slate-200">
          <p class="text-sm text-slate-600 mb-3">Товары ({{ order.items.length }}):</p>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <div
              v-for="item in order.items"
              :key="item.productId"
              class="p-3 rounded-lg bg-slate-50"
            >
              <p class="text-sm font-medium text-slate-900">{{ item.productName }}</p>
              <p class="text-xs text-gray-700 mt-1">
                {{ item.quantity }} × ЅМ{{ item.unitPrice.toFixed(2) }}
              </p>
              <p class="text-sm font-semibold text-slate-900 mt-2">
                ЅМ{{ item.subtotal.toFixed(2) }}
              </p>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="space-y-1">
            <p class="text-xs text-slate-600">
              <span class="font-medium">Создан:</span> {{ order.createdDate }}
            </p>
            <p class="text-xs text-slate-600">
              <span class="font-medium">Срок:</span> {{ order.dueDate }}
            </p>
          </div>
          <div class="flex gap-2">
            <button
              @click="modal.openViewModal(order, 'order')"
              class="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 text-sm font-medium transition"
            >
              Просмотр
            </button>
            <button
              @click="modal.openEditModal(order, 'order')"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition"
            >
              Редактировать
            </button>
            <button
              @click="generateInvoice(order)"
              class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium transition"
            >
              Накладная
            </button>
          </div>
        </div>
      </div>
    </div>

    <ModalBase
      :is-open="modal.isOpen.value && modal.contentType.value === 'order'"
      :title="modal.isEditModal.value ? 'Редактировать заказ' : 'Информация о заказе'"
      :show-actions="true"
      :show-save-button="modal.isEditModal.value"
      @close="modal.closeModal"
      @save="saveOrder"
    >
      <div v-if="modal.isViewModal.value" class="space-y-6">
        <div class="grid grid-cols-2 gap-6">
          <div>
            <p class="text-sm text-gray-700">Номер заказа</p>
            <p class="text-lg font-semibold text-slate-900">
              {{ modal.selectedItem.value?.orderNumber }}
            </p>
          </div>
          <div>
            <p class="text-sm text-gray-700">Клиент</p>
            <p class="text-lg font-semibold text-slate-900">
              {{ modal.selectedItem.value?.customerName }}
            </p>
          </div>
          <div>
            <p class="text-sm text-gray-700">Тип клиента</p>
            <span
              class="inline-block px-2 py-1 rounded text-xs font-medium"
              :class="
                modal.selectedItem.value?.customerType === 'wholesale'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'bg-amber-100 text-amber-700'
              "
            >
              {{ modal.selectedItem.value?.customerType === 'wholesale' ? 'Оптовик' : 'Магазин' }}
            </span>
          </div>
          <div>
            <p class="text-sm text-gray-700">Статус</p>
            <span :class="getStatusBadge(modal.selectedItem.value?.status)">
              {{ modal.selectedItem.value?.status }}
            </span>
          </div>
          <div>
            <p class="text-sm text-gray-700">Сумма</p>
            <p class="text-lg font-semibold text-slate-900">
              ЅМ{{ modal.selectedItem.value?.totalAmount.toFixed(2) }}
            </p>
          </div>
          <div>
            <p class="text-sm text-gray-700">Создан</p>
            <p class="text-lg font-semibold text-slate-900">
              {{ modal.selectedItem.value?.createdDate }}
            </p>
          </div>
          <div>
            <p class="text-sm text-gray-700">Срок</p>
            <p class="text-lg font-semibold text-slate-900">
              {{ modal.selectedItem.value?.dueDate }}
            </p>
          </div>
        </div>

        <div>
          <p class="text-sm font-semibold text-gray-700 mb-3">Товары ({{ modal.selectedItem.value?.items.length }}):</p>
          <div class="space-y-2">
            <div
              v-for="item in modal.selectedItem.value?.items"
              :key="item.productId"
              class="p-3 rounded-lg bg-slate-50"
            >
              <div class="flex items-center justify-between">
                <div>
                  <p class="font-medium text-slate-900">{{ item.productName }}</p>
                  <p class="text-sm text-gray-700">
                    {{ item.quantity }} × ЅМ{{ item.unitPrice.toFixed(2) }}
                  </p>
                </div>
                <p class="font-semibold text-slate-900">ЅМ{{ item.subtotal.toFixed(2) }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="flex gap-2 pt-4 border-t border-slate-200">
          <button
            @click="generateInvoice(modal.selectedItem.value)"
            class="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition"
          >
            Сгенерировать накладную
          </button>
          <button
            @click="
              () => {
                modal.openEditModal(modal.selectedItem, 'order')
              }
            "
            class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition"
          >
            Редактировать
          </button>
          <button
            @click="modal.openDeleteModal(modal.selectedItem.value, 'order')"
            class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition"
          >
            Удалить
          </button>
        </div>
      </div>

      <div v-else class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Номер заказа</label>
            <input
              v-model="formData.orderNumber"
              type="text"
              class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
              placeholder="ORD-2024-001"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Имя клиента</label>
            <input
              v-model="formData.customerName"
              type="text"
              class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
              placeholder="Введите имя клиента"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Тип клиента</label>
          <select
            v-model="formData.customerType"
            class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
          >
            <option value="shop">Магазин</option>
            <option value="wholesale">Оптовик</option>
          </select>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Дата создания</label>
            <input
              v-model="formData.createdDate"
              type="date"
              class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Срок выполнения</label>
            <input
              v-model="formData.dueDate"
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
            <option value="принят">Принят</option>
            <option value="в производстве">В производстве</option>
            <option value="на складе">На складе</option>
            <option value="отправлен">Отправлен</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Общая сумма (ЅМ)</label>
          <input
            v-model.number="formData.totalAmount"
            type="number"
            step="0.01"
            class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            placeholder="0.00"
          />
        </div>
      </div>
    </ModalBase>

    <ModalBase
      v-if="modal.modalType.value === 'delete'"
      :is-open="modal.isOpen.value && modal.contentType.value === 'order'"
      title="Подтвердить удаление"
      :show-actions="true"
      @close="modal.closeModal"
    >
      <div class="space-y-4">
        <p class="text-slate-700">
          Вы уверены, что хотите удалить заказ
          <strong>{{ modal.selectedItem.value?.orderNumber }}</strong
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
            @click="deleteOrder"
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
import type { Order } from '../types'

const modal = useModal()
const { orders } = useAppState()

const searchQuery = ref('')
const statusFilter = ref('')
const customerTypeFilter = ref('')

const formData = ref<Partial<Order>>({
  orderNumber: '',
  customerName: '',
  customerType: 'shop',
  status: 'принят',
  createdDate: new Date().toISOString().split('T')[0],
  dueDate: new Date().toISOString().split('T')[0],
  totalAmount: 0,
  items: [],
})

const filteredOrders = computed(() => {
  return orders.value.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesStatus = !statusFilter.value || order.status === statusFilter.value
    const matchesCustomerType =
      !customerTypeFilter.value || order.customerType === customerTypeFilter.value
    return matchesSearch && matchesStatus && matchesCustomerType
  })
})

const totalOrderValue = computed(() => {
  return orders.value.reduce((sum, order) => sum + order.totalAmount, 0)
})

const ordersByStatus = (status: string) => {
  return orders.value.filter((o) => o.status === status)
}

const saveOrder = () => {
  if (!formData.value.orderNumber || !formData.value.customerName) {
    alert('Пожалуйста, заполните обязательные поля')
    return
  }

  if (modal.isEditModal.value && modal.selectedItem.value) {
    const index = orders.value.findIndex((o) => o.id === modal.selectedItem.value?.id)
    if (index !== -1) {
      orders.value[index] = {
        ...modal.selectedItem.value,
        ...formData.value,
      } as Order
    }
  }
  modal.closeModal()
}

const deleteOrder = () => {
  const index = orders.value.findIndex((o) => o.id === modal.selectedItem.value?.id)
  if (index !== -1) {
    orders.value.splice(index, 1)
  }
  modal.closeModal()
}

const getStatusBadge = (status: string) => {
  const badges: Record<string, string> = {
    принят: 'px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium',
    'в производстве':
      'px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium',
    'на складе': 'px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium',
    отправлен: 'px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium',
  }
  return (
    badges[status] || 'px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium'
  )
}

const generateInvoice = (order: Order | undefined) => {
  if (!order) return

  const invoiceNumber = `НАК-${order.orderNumber.split('-')[1]}-${new Date().getTime()}`
  const currentDate = new Date().toLocaleDateString('ru-RU')

  let invoiceContent = `
╔════════════════════════════════════════════════════════════════╗
║                        НАКЛАДНАЯ                               ║
║                   (Delivery Note)                              ║
╚════════════════════════════════════════════════════════════════╝

Номер накладной: ${invoiceNumber}
Дата выдачи: ${currentDate}
Номер заказа: ${order.orderNumber}

─────────────────────────────────────────────────────────────────

ПОЛУЧАТЕЛЬ:
${order.customerName}
Тип: ${order.customerType === 'wholesale' ? 'Оптовик' : 'Магазин'}

─────────────────────────────────────────────────────────────────

ТОВАРЫ И УСЛУГИ:

`

  order.items.forEach((item, index) => {
    invoiceContent += `
${index + 1}. ${item.productName}
   Кол-во: ${item.quantity} шт
   Цена за единицу: ЅМ${item.unitPrice.toFixed(2)}
   Сумма: ЅМ${item.subtotal.toFixed(2)}
`
  })

  invoiceContent += `
─────────────────────────────────────────────────────────────────

ИТОГО:
Количество позиций: ${order.items.length}
Общее количество товара: ${order.items.reduce((sum, item) => sum + item.quantity, 0)} шт
Сумма к оплате: ЅМ${order.totalAmount.toFixed(2)}

─────────────────────────────────────────────────────────────────

СТАТУС ЗАКАЗА: ${order.status}
Дата создания заказа: ${order.createdDate}
Срок выполнения: ${order.dueDate}

─────────────────────────────────────────────────────────────────

Подпись ответственного лица: _________________
Дата подписи: _________________

═════════════════════════════════════════════════════════════════
`

  const element = document.createElement('a')
  const file = new Blob([invoiceContent], { type: 'text/plain;charset=utf-8' })
  element.href = URL.createObjectURL(file)
  element.download = `Nakladnaya_${invoiceNumber}.txt`
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
}
</script>
