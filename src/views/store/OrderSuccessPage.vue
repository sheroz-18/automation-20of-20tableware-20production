<template>
  <div class="space-y-6">
    <div class="text-center py-12">
      <!-- Success icon -->
      <div class="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
        <svg class="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      <h1 class="text-4xl font-bold text-slate-900 mb-2">Спасибо за заказ!</h1>
      <p class="text-xl text-slate-600 mb-4">Ваш заказ успешно размещен</p>

      <div class="bg-blue-50 border border-blue-200 rounded-lg p-6 inline-block mb-6">
        <p class="text-sm text-slate-600">Номер заказа:</p>
        <p class="text-2xl font-bold text-blue-600">{{ orderId }}</p>
      </div>
    </div>

    <!-- Order details -->
    <div v-if="order" class="bg-white rounded-lg shadow p-6">
      <h2 class="text-2xl font-bold text-slate-900 mb-6">Детали заказа</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Order info -->
        <div class="space-y-4">
          <div>
            <h3 class="text-sm font-semibold text-slate-700 uppercase mb-2">
              Информация о доставке
            </h3>
            <div class="space-y-2 text-slate-600">
              <p><strong>Имя:</strong> {{ order.shippingAddress.name }}</p>
              <p><strong>Телефон:</strong> {{ order.shippingAddress.phone }}</p>
              <p><strong>Адрес:</strong> {{ order.shippingAddress.address }}</p>
              <p><strong>Регион:</strong> {{ order.shippingAddress.regionName }}</p>
            </div>
          </div>

          <div>
            <h3 class="text-sm font-semibold text-slate-700 uppercase mb-2">Статус заказа</h3>
            <div
              class="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold"
            >
              {{ getStatusLabel(order.status) }}
            </div>
          </div>

          <div>
            <h3 class="text-sm font-semibold text-slate-700 uppercase mb-2">Дата заказа</h3>
            <p class="text-slate-600">{{ formatDate(order.createdAt) }}</p>
          </div>
        </div>

        <!-- Items -->
        <div>
          <h3 class="text-sm font-semibold text-slate-700 uppercase mb-4">Товары в заказе</h3>
          <div class="space-y-3 mb-6 pb-6 border-b border-slate-200">
            <div v-for="item in order.items" :key="item.productId" class="flex justify-between">
              <div>
                <p class="font-semibold text-slate-900">{{ item.name }}</p>
                <p class="text-sm text-slate-600">x{{ item.quantity }}</p>
              </div>
              <span class="font-semibold text-slate-900"
                >{{ formatPrice(item.price * item.quantity) }} сом</span
              >
            </div>
          </div>

          <div class="space-y-2">
            <div class="flex justify-between text-slate-600">
              <span>Подитог:</span>
              <span class="font-semibold">{{ formatPrice(order.subtotal) }} сом</span>
            </div>
            <div class="flex justify-between text-slate-600">
              <span>Доставка:</span>
              <span class="font-semibold">{{ formatPrice(order.shippingCost) }} сом</span>
            </div>
            <div class="flex justify-between text-lg font-bold pt-2 border-t border-slate-200">
              <span>Итого:</span>
              <span class="text-blue-600">{{ formatPrice(order.total) }} сом</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Next steps -->
    <div class="bg-blue-50 border border-blue-200 rounded-lg p-6">
      <h2 class="text-lg font-bold text-slate-900 mb-4">Что дальше?</h2>
      <ul class="space-y-3 text-slate-700">
        <li class="flex gap-3">
          <span class="text-blue-600 font-bold flex-shrink-0">1.</span>
          <span>Ожидайте подтверждения заказа по телефону или SMS</span>
        </li>
        <li class="flex gap-3">
          <span class="text-blue-600 font-bold flex-shrink-0">2.</span>
          <span>Мы упакуем и отправим ваш заказ</span>
        </li>
        <li class="flex gap-3">
          <span class="text-blue-600 font-bold flex-shrink-0">3.</span>
          <span>Отследите доставку по номеру заказа</span>
        </li>
        <li class="flex gap-3">
          <span class="text-blue-600 font-bold flex-shrink-0">4.</span>
          <span>Получите товар в указанном регионе</span>
        </li>
      </ul>
    </div>

    <!-- Actions -->
    <div class="flex flex-col sm:flex-row gap-4">
      <router-link
        to="/store"
        class="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg text-center hover:bg-blue-700 transition focus:ring-4 focus:ring-blue-300"
      >
        Продолжить покупки
      </router-link>
      <button
        @click="downloadOrder"
        class="flex-1 px-6 py-3 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition"
      >
        Скачать заказ
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useCustomerOrders } from '@/composables/useCustomerOrders'

const route = useRoute()
const { getOrderById } = useCustomerOrders()

const orderId = computed(() => route.params.orderId as string)
const order = computed(() => getOrderById(orderId.value))

const formatPrice = (price: number) => {
  return price.toLocaleString('ru-RU')
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    pending: 'В ожидании подтверждения',
    confirmed: 'Подтвержден',
    shipped: 'Отправлен',
    delivered: 'Доставлен',
    cancelled: 'Отменен',
  }
  return labels[status] || status
}

const downloadOrder = () => {
  if (!order.value) return

  let content = `ЗАКАЗ #${order.value.id}\n`
  content += `Дата: ${formatDate(order.value.createdAt)}\n`
  content += `Статус: ${getStatusLabel(order.value.status)}\n\n`

  content += `ИНФОРМАЦИЯ О ДОСТАВКЕ:\n`
  content += `Имя: ${order.value.shippingAddress.name}\n`
  content += `Телефон: ${order.value.shippingAddress.phone}\n`
  content += `Адрес: ${order.value.shippingAddress.address}\n`
  content += `Регион: ${order.value.shippingAddress.regionName}\n\n`

  content += `ТОВАРЫ:\n`
  for (const item of order.value.items) {
    content += `- ${item.name} x${item.quantity} = ${formatPrice(item.price * item.quantity)} сом\n`
  }

  content += `\nПодитог: ${formatPrice(order.value.subtotal)} сом\n`
  content += `Доставка: ${formatPrice(order.value.shippingCost)} сом\n`
  content += `ИТОГО: ${formatPrice(order.value.total)} сом\n`

  const element = document.createElement('a')
  element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(content)}`)
  element.setAttribute('download', `Order-${order.value.id}.txt`)
  element.style.display = 'none'
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
}
</script>
