<template>
  <div class="space-y-8">
    <div>
      <h1 class="text-4xl font-bold text-slate-900">Панель управления производством</h1>
      <p class="text-slate-600 mt-2">
        Контролируйте процесс производства посуды в реальном времени
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard
        icon="trending-up"
        label="Общая выручка"
        value="₽4,651"
        change="+12.5%"
        changeType="positive"
      />
      <MetricCard
        icon="package"
        label="Активные заказы"
        value="5"
        change="+8.3%"
        changeType="positive"
      />
      <MetricCard
        icon="box"
        label="На складе единиц"
        value="3,815"
        change="-5.2%"
        changeType="negative"
      />
      <MetricCard
        icon="zap"
        label="Произведено сегодня"
        value="2,420"
        change="+15.7%"
        changeType="positive"
      />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-semibold text-slate-900">Статус заказов</h2>
          <router-link to="/orders" class="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >Все заказы →</router-link
          >
        </div>

        <div class="space-y-3">
          <div
            v-for="order in recentOrders"
            :key="order.id"
            class="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:border-blue-300 transition cursor-pointer"
            @click="modal.openViewModal(order, 'order')"
          >
            <div>
              <p class="font-medium text-slate-900">{{ order.orderNumber }}</p>
              <p class="text-sm text-slate-600">
                {{ order.customerName }} - {{ getTotalItems(order) }} товаров
              </p>
            </div>
            <span :class="getOrderStatusBadge(order.status)">{{
              getOrderStatusLabel(order.status)
            }}</span>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-semibold text-slate-900">Критические остатки</h2>
          <router-link to="/inventory" class="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >Все →</router-link
          >
        </div>

        <div class="space-y-4">
          <div
            v-for="product in criticalStock"
            :key="product.id"
            class="p-3 rounded-lg border cursor-pointer transition hover:shadow-md"
            :class="
              product.quantity === 0 ? 'bg-red-50 border-red-200' : 'bg-orange-50 border-orange-200'
            "
            @click="modal.openViewModal(product, 'product')"
          >
            <div class="flex items-center justify-between">
              <div>
                <p
                  :class="[
                    'font-medium',
                    product.quantity === 0 ? 'text-red-900' : 'text-orange-900',
                  ]"
                >
                  {{ product.name }}
                </p>
                <p
                  :class="['text-sm', product.quantity === 0 ? 'text-red-700' : 'text-orange-700']"
                >
                  {{ product.quantity }} единиц
                </p>
              </div>
              <span
                :class="[
                  'text-2xl font-bold',
                  product.quantity === 0 ? 'text-red-600' : 'text-orange-600',
                ]"
              >
                {{ product.quantity }}
              </span>
            </div>
          </div>

          <button
            @click="modal.openCreateModal('order')"
            class="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition"
          >
            Создать заказ на пополнение
          </button>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 class="text-lg font-semibold text-slate-900 mb-6">Производительность по категориям</h2>

        <div class="space-y-4">
          <div
            v-for="category in categories"
            :key="category.name"
            class="cursor-pointer hover:bg-slate-50 p-2 rounded transition"
            @click="navigateToCategory(category.name)"
          >
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium text-slate-700">{{ category.name }}</span>
              <span class="text-sm font-semibold text-slate-900">{{ category.quantity }} шт</span>
            </div>
            <div class="w-full bg-slate-200 rounded-full h-2">
              <div
                class="bg-blue-600 h-2 rounded-full"
                :style="{ width: getProgressPercent(category.quantity) + '%' }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 class="text-lg font-semibold text-slate-900 mb-6">Финансовый обзор (текущий месяц)</h2>

        <div class="space-y-4">
          <div
            class="flex items-center justify-between p-4 rounded-lg bg-green-50 border border-green-200 cursor-pointer hover:shadow-md transition"
            @click="navigateToFinance('income')"
          >
            <div>
              <p class="text-sm text-green-700">Доход от продаж</p>
              <p class="font-semibold text-green-900">₽3,681</p>
            </div>
            <svg
              class="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>

          <div
            class="flex items-center justify-between p-4 rounded-lg bg-red-50 border border-red-200 cursor-pointer hover:shadow-md transition"
            @click="navigateToFinance('expense')"
          >
            <div>
              <p class="text-sm text-red-700">Расходы</p>
              <p class="font-semibold text-red-900">₽6,650</p>
            </div>
            <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <div
            class="flex items-center justify-between p-4 rounded-lg bg-slate-100 border border-slate-300 cursor-pointer hover:shadow-md transition"
            @click="navigateToFinance('balance')"
          >
            <div>
              <p class="text-sm text-slate-700">Баланс</p>
              <p class="font-semibold text-slate-900">-₽2,969</p>
            </div>
            <svg
              class="w-8 h-8 text-slate-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-8 text-white">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-2xl font-bold mb-2">Готовы оптимизировать производство?</h3>
          <p class="text-blue-100">Используйте аналитику и отчеты для принятия лучших решений</p>
        </div>
        <router-link
          to="/analytics"
          class="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition"
        >
          Открыть аналитику
        </router-link>
      </div>
    </div>

    <ModalBase
      :is-open="modal.isOpen.value"
      :title="getModalTitle()"
      :show-actions="true"
      :show-save-button="modal.isEditModal.value || modal.isCreateModal.value"
      @close="modal.closeModal"
      @save="modal.closeModal"
    >
      <div v-if="modal.contentType.value === 'order' && modal.selectedItem.value" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-sm text-slate-600">Номер заказа</p>
            <p class="font-semibold text-slate-900">{{ modal.selectedItem.value?.orderNumber }}</p>
          </div>
          <div>
            <p class="text-sm text-slate-600">Клиент</p>
            <p class="font-semibold text-slate-900">{{ modal.selectedItem.value?.customerName }}</p>
          </div>
          <div>
            <p class="text-sm text-slate-600">Статус</p>
            <span :class="getOrderStatusBadge(modal.selectedItem.value?.status)">
              {{ getOrderStatusLabel(modal.selectedItem.value?.status) }}
            </span>
          </div>
          <div>
            <p class="text-sm text-slate-600">Сумма</p>
            <p class="font-semibold text-slate-900">
              ₽{{ modal.selectedItem.value?.totalAmount?.toFixed(2) }}
            </p>
          </div>
        </div>
        <div class="pt-4 border-t border-slate-200">
          <router-link to="/orders" class="text-blue-600 hover:text-blue-700 font-medium">
            Перейти к заказам →
          </router-link>
        </div>
      </div>

      <div v-else-if="modal.contentType.value === 'product' && modal.selectedItem.value" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-sm text-slate-600">Товар</p>
            <p class="font-semibold text-slate-900">{{ modal.selectedItem.value?.name }}</p>
          </div>
          <div>
            <p class="text-sm text-slate-600">Статус</p>
            <span :class="getProductStatusBadge(modal.selectedItem.value?.status)">
              {{ getProductStatusLabel(modal.selectedItem.value?.status) }}
            </span>
          </div>
        </div>
        <div class="pt-4 border-t border-slate-200">
          <router-link to="/products" class="text-blue-600 hover:text-blue-700 font-medium">
            Перейти к товарам →
          </router-link>
        </div>
      </div>
    </ModalBase>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { orders as mockOrders, products as mockProducts } from '../data/mockData'
import { useModal } from '../composables/useModal'
import { useStorage } from '../composables/useStorage'
import MetricCard from '../components/MetricCard.vue'
import ModalBase from '../components/ModalBase.vue'

const router = useRouter()
const modal = useModal()
const storage = useStorage()

const orders = ref([...mockOrders])
const products = ref([...mockProducts])

onMounted(() => {
  const emptyArray = ref<any[]>([])
  storage.initializeStorage(products, orders, emptyArray, emptyArray)
})

const recentOrders = computed(() => orders.value.slice(0, 3))

const criticalStock = computed(() => {
  return products.value.filter((p) => p.quantity === 0 || p.quantity < p.reorderLevel).slice(0, 2)
})

const categories = computed(() => [
  { name: 'Тарелки', quantity: 1270 },
  { name: 'Приборы', quantity: 860 },
  { name: 'Миски', quantity: 320 },
  { name: 'Кухонная утварь', quantity: 180 },
])

const getProgressPercent = (quantity: number) => {
  return Math.min((quantity / 1500) * 100, 100)
}

const getTotalItems = (order: any) => {
  return order.items?.length || 0
}

const getOrderStatusBadge = (status: string) => {
  const badges: Record<string, string> = {
    pending: 'px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium',
    processing: 'px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium',
    completed: 'px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium',
    shipped: 'px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium',
  }
  return badges[status] || 'px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium'
}

const getOrderStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    pending: 'Ожидание',
    processing: 'Обработка',
    completed: 'Завершено',
    shipped: 'Отправлено',
  }
  return labels[status] || 'Неизвестно'
}

const getProductStatusBadge = (status: string) => {
  const badges: Record<string, string> = {
    in_stock: 'px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium',
    low_stock: 'px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-medium',
    out_of_stock: 'px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium',
  }
  return badges[status] || 'px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-medium'
}

const getProductStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    in_stock: 'В наличии',
    low_stock: 'Низкий запас',
    out_of_stock: 'Нет в наличии',
  }
  return labels[status] || 'Неизвестно'
}

const navigateToCategory = (category: string) => {
  router.push(`/products?category=${category}`)
}

const navigateToFinance = (type: string) => {
  router.push(`/finance?type=${type}`)
}

const getModalTitle = () => {
  if (modal.contentType.value === 'order') return 'Информация о заказе'
  if (modal.contentType.value === 'product') return 'Информация о товаре'
  return 'Информация'
}
</script>
