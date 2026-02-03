<template>
  <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
    <div class="mb-6">
      <h3 class="text-lg font-semibold text-slate-900">Выполнение заказов</h3>
      <p class="text-sm text-slate-600">Статусы заказов за текущий период</p>
    </div>

    <!-- Progress Flow -->
    <div class="mb-8">
      <div class="flex items-center justify-between gap-2">
        <div
          v-for="(status, index) in statusCounts"
          :key="status.label"
          class="flex-1 flex flex-col items-center"
        >
          <!-- Circle with count -->
          <div class="relative mb-2">
            <div
              :class="getCircleClass(status.label)"
              class="w-16 h-16 rounded-full flex items-center justify-center border-4 transition relative"
            >
              <div class="text-center">
                <div class="text-xl font-bold text-slate-900">{{ status.count }}</div>
                <div class="text-xs text-slate-600">{{ getPercentage(status.count) }}%</div>
              </div>
            </div>
            <!-- Progress ring background -->
            <svg
              class="absolute inset-0 w-16 h-16 -rotate-90"
              viewBox="0 0 64 64"
            >
              <circle
                cx="32"
                cy="32"
                r="28"
                fill="none"
                :stroke="getCircleBackgroundColor(status.label)"
                stroke-width="4"
                opacity="0.2"
              />
              <circle
                cx="32"
                cy="32"
                r="28"
                fill="none"
                :stroke="getCircleColor(status.label)"
                stroke-width="4"
                :stroke-dasharray="`${getCircumference(status.count)} 175.93`"
                stroke-linecap="round"
                class="transition-all duration-500"
              />
            </svg>
          </div>

          <!-- Label -->
          <div class="text-center mt-2">
            <p class="text-xs font-medium text-slate-700">{{ status.label }}</p>
          </div>

          <!-- Connector arrow -->
          <svg
            v-if="index < statusCounts.length - 1"
            class="w-6 h-6 text-slate-300 mt-3"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </div>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div
        v-for="status in statusCounts"
        :key="status.label"
        :class="getCardClass(status.label)"
        class="rounded-lg p-4 transition hover:shadow-md"
      >
        <!-- Icon -->
        <div :class="getIconClass(status.label)" class="inline-block mb-3 p-2 rounded-lg">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <template v-if="status.label === 'Принят'">
              <path d="M9 11l3 3L22 4"></path>
              <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </template>
            <template v-else-if="status.label === 'В производстве'">
              <path d="M12 2v20m10-10H2"></path>
              <circle cx="12" cy="12" r="10"></circle>
            </template>
            <template v-else-if="status.label === 'На складе'">
              <path d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
            </template>
            <template v-else-if="status.label === 'Отправлен'">
              <path d="M18 8h-1V6c0-.55-.45-1-1-1H8c-.55 0-1 .45-1 1v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-3-2v2H9V6h6zM6 12h12v8H6v-8z"></path>
            </template>
          </svg>
        </div>

        <!-- Content -->
        <div class="text-left">
          <div class="text-2xl font-bold text-slate-900">{{ status.count }}</div>
          <p class="text-xs text-slate-600 mt-1">{{ status.label }}</p>
          <div
            :class="getProgressBarColor(status.label)"
            class="mt-3 h-1.5 rounded-full"
            :style="{ width: getPercentage(status.count) + '%' }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Order } from '../../types'

interface Props {
  orders: Order[]
}

const props = defineProps<Props>()

const statusCounts = computed(() => {
  const counts: Record<string, number> = {
    Принят: 0,
    'В производстве': 0,
    'На складе': 0,
    Отправлен: 0,
  }

  props.orders.forEach((order) => {
    const statusMap: Record<string, string> = {
      принят: 'Принят',
      'в производстве': 'В производстве',
      'на складе': 'На складе',
      отправлен: 'Отправлен',
    }
    const mappedStatus = statusMap[order.status]
    if (mappedStatus) {
      counts[mappedStatus]++
    }
  })

  return [
    { label: 'Принят', count: counts['Принят'] },
    { label: 'В производстве', count: counts['В производстве'] },
    { label: 'На складе', count: counts['На складе'] },
    { label: 'Отправлен', count: counts['Отправлен'] },
  ]
})

const totalOrders = computed(() => props.orders.length)

const getPercentage = (count: number) => {
  if (totalOrders.value === 0) return 0
  return Math.round((count / totalOrders.value) * 100)
}

const getCircumference = (count: number) => {
  const percentage = getPercentage(count)
  const circumference = 175.93
  return (percentage / 100) * circumference
}

const getCircleClass = (label: string) => {
  const colors: Record<string, string> = {
    Принят: 'border-blue-500 bg-blue-50',
    'В производстве': 'border-orange-500 bg-orange-50',
    'На складе': 'border-purple-500 bg-purple-50',
    Отправлен: 'border-green-500 bg-green-50',
  }
  return colors[label] || 'border-slate-500 bg-slate-50'
}

const getCircleColor = (label: string) => {
  const colors: Record<string, string> = {
    Принят: '#3b82f6',
    'В производстве': '#f97316',
    'На складе': '#a855f7',
    Отправлен: '#22c55e',
  }
  return colors[label] || '#64748b'
}

const getCircleBackgroundColor = (label: string) => {
  const colors: Record<string, string> = {
    Принят: '#3b82f6',
    'В производстве': '#f97316',
    'На складе': '#a855f7',
    Отправлен: '#22c55e',
  }
  return colors[label] || '#64748b'
}

const getCardClass = (label: string) => {
  const colors: Record<string, string> = {
    Принят: 'bg-blue-50 border border-blue-200',
    'В производстве': 'bg-orange-50 border border-orange-200',
    'На складе': 'bg-purple-50 border border-purple-200',
    Отправлен: 'bg-green-50 border border-green-200',
  }
  return colors[label] || 'bg-slate-50 border border-slate-200'
}

const getIconClass = (label: string) => {
  const colors: Record<string, string> = {
    Принят: 'bg-blue-200 text-blue-600',
    'В производстве': 'bg-orange-200 text-orange-600',
    'На складе': 'bg-purple-200 text-purple-600',
    Отправлен: 'bg-green-200 text-green-600',
  }
  return colors[label] || 'bg-slate-200 text-slate-600'
}

const getProgressBarColor = (label: string) => {
  const colors: Record<string, string> = {
    Принят: 'bg-blue-500',
    'В производстве': 'bg-orange-500',
    'На складе': 'bg-purple-500',
    Отправлен: 'bg-green-500',
  }
  return colors[label] || 'bg-slate-500'
}
</script>
