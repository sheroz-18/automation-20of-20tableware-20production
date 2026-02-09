<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-3xl font-bold text-slate-900 mb-2">Оформление заказа</h1>
      <p class="text-slate-600">Завершите покупку в несколько шагов</p>
    </div>

    <!-- Steps indicator -->
    <div class="bg-white rounded-lg shadow p-6">
      <div class="flex items-center justify-between">
        <div
          v-for="(s, index) in steps"
          :key="index"
          class="flex flex-col items-center flex-1"
        >
          <div
            :class="[
              'w-10 h-10 rounded-full flex items-center justify-center font-bold mb-2 transition',
              currentStep > index
                ? 'bg-green-500 text-white'
                : currentStep === index
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-200 text-slate-600',
            ]"
          >
            {{ currentStep > index ? '✓' : index + 1 }}
          </div>
          <span class="text-sm font-medium text-slate-700 text-center">{{ s }}</span>
          <div
            v-if="index < steps.length - 1"
            :class="[
              'absolute w-12 h-1 top-5 left-1/2 transition',
              currentStep > index ? 'bg-green-500' : 'bg-slate-200',
            ]"
          ></div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main form -->
      <div class="lg:col-span-2">
        <!-- Shipping info -->
        <div class="bg-white rounded-lg shadow p-6 mb-6">
          <h2 class="text-xl font-bold text-slate-900 mb-4">Информация о доставке</h2>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Полное имя</label>
              <input
                v-model="shippingInfo.name"
                type="text"
                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Иван Петров"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Номер телефона</label>
              <input
                v-model="shippingInfo.phone"
                type="tel"
                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="+992 XX XXX XX XX"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Адрес доставки</label>
              <input
                v-model="shippingInfo.address"
                type="text"
                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="ул. Центральная, д. 10, кв. 5"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Регион доставки</label>
              <select
                v-model="shippingInfo.regionId"
                @change="selectRegionHandler"
                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              >
                <option value="">Выберите регион</option>
                <option v-for="region in regions" :key="region.id" :value="region.id">
                  {{ region.name }} - {{ region.cost }} сом ({{ region.deliveryDays }})
                </option>
              </select>
            </div>

            <div v-if="selectedRegion" class="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p class="text-sm text-blue-800">
                <strong>{{ selectedRegion.name }}:</strong> {{ selectedRegion.description }}
              </p>
            </div>
          </div>
        </div>

        <!-- Summary before confirm -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-bold text-slate-900 mb-4">Проверка заказа</h2>

          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-slate-600">Товаров:</span>
              <span class="font-semibold">{{ itemCount }} шт.</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-600">Подитог:</span>
              <span class="font-semibold">{{ formatPrice(subtotal) }} сом</span>
            </div>
            <div v-if="shippingCost > 0" class="flex justify-between">
              <span class="text-slate-600">Доставка:</span>
              <span class="font-semibold">{{ formatPrice(shippingCost) }} сом</span>
            </div>
            <div class="flex justify-between text-lg font-bold pt-2 border-t border-slate-200">
              <span>Итого:</span>
              <span class="text-blue-600">{{ formatPrice(totalPrice) }} сом</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Order summary sidebar -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-lg shadow p-6 sticky top-24">
          <h2 class="text-lg font-bold text-slate-900 mb-4">Товары в заказе</h2>

          <div class="space-y-3 mb-6 pb-6 border-b border-slate-200 max-h-96 overflow-y-auto">
            <div v-for="item in items" :key="item.productId" class="flex justify-between text-sm">
              <div>
                <p class="font-semibold text-slate-900">{{ item.name }}</p>
                <p class="text-xs text-slate-600">x{{ item.quantity }}</p>
              </div>
              <span class="font-semibold text-slate-900">{{ formatPrice(item.price * item.quantity) }} сом</span>
            </div>
          </div>

          <div class="space-y-2 mb-6 pb-6 border-b border-slate-200">
            <div class="flex justify-between text-slate-600">
              <span>Подитог:</span>
              <span class="font-semibold">{{ formatPrice(subtotal) }} сом</span>
            </div>
            <div v-if="shippingCost > 0" class="flex justify-between text-slate-600">
              <span>Доставка:</span>
              <span class="font-semibold">{{ formatPrice(shippingCost) }} сом</span>
            </div>
          </div>

          <div class="mb-6">
            <div class="flex justify-between text-lg font-bold">
              <span>Итого:</span>
              <span class="text-blue-600">{{ formatPrice(totalPrice) }} сом</span>
            </div>
          </div>

          <button
            @click="placeOrder"
            :disabled="!canPlaceOrder || isSubmitting"
            :class="[
              'w-full px-4 py-3 font-semibold rounded-lg transition',
              canPlaceOrder && !isSubmitting
                ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-300'
                : 'bg-slate-300 text-slate-600 cursor-not-allowed',
            ]"
          >
            <span v-if="!isSubmitting">Подтвердить заказ</span>
            <span v-else>Обработка...</span>
          </button>

          <button
            @click="$router.back()"
            class="w-full px-4 py-2 mt-3 text-slate-600 hover:text-slate-900 border border-slate-300 rounded-lg transition hover:bg-slate-50"
          >
            Вернуться
          </button>
        </div>
      </div>
    </div>

    <!-- Error message -->
    <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCart } from '@/composables/useCart'
import { useShipping } from '@/composables/useShipping'
import { useCustomerOrders } from '@/composables/useCustomerOrders'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { items, total: subtotal, itemCount, clearCart } = useCart()
const { getShippingRegions, getRegionById, selectRegion, getSelectedRegion, getShippingCost, validateShippingInfo } = useShipping()
const { createOrder } = useCustomerOrders()
const { currentUser } = useAuth()

const steps = ['Доставка', 'Проверка', 'Завершено']
const currentStep = ref(0)

const shippingInfo = ref({
  name: '',
  phone: '',
  address: '',
  regionId: '',
})

const regions = getShippingRegions()
const selectedRegion = ref(getSelectedRegion())
const error = ref('')
const isSubmitting = ref(false)

const shippingCost = computed(() => {
  return shippingInfo.value.regionId ? getShippingCost() : 0
})

const totalPrice = computed(() => subtotal.value + shippingCost.value)

const canPlaceOrder = computed(() => {
  return (
    shippingInfo.value.name.trim() !== '' &&
    shippingInfo.value.phone.trim() !== '' &&
    shippingInfo.value.address.trim() !== '' &&
    shippingInfo.value.regionId !== ''
  )
})

const formatPrice = (price: number) => {
  return price.toLocaleString('ru-RU')
}

const selectRegionHandler = () => {
  const region = getRegionById(shippingInfo.value.regionId)
  if (region) {
    selectRegion(region)
    selectedRegion.value = region
  }
}

const placeOrder = () => {
  error.value = ''

  const validation = validateShippingInfo({
    ...shippingInfo.value,
    regionId: shippingInfo.value.regionId,
  })

  if (!validation.valid) {
    error.value = validation.error || 'Ошибка валидации'
    return
  }

  if (!currentUser.value) {
    error.value = 'Вы не авторизированы'
    router.push('/login')
    return
  }

  isSubmitting.value = true

  setTimeout(() => {
    const region = getRegionById(shippingInfo.value.regionId)
    if (!region) {
      error.value = 'Регион не найден'
      isSubmitting.value = false
      return
    }

    const order = createOrder(
      currentUser.value!.id,
      items.value,
      subtotal.value,
      shippingCost.value,
      {
        name: shippingInfo.value.name,
        phone: shippingInfo.value.phone,
        address: shippingInfo.value.address,
        regionId: region.id,
        regionName: region.name,
      },
    )

    clearCart()
    isSubmitting.value = false

    // Redirect to success page
    router.push(`/order-success/${order.id}`)
  }, 1000)
}
</script>
