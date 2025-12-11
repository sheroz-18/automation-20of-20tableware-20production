<template>
  <div class="bg-white rounded-lg shadow border border-slate-200 p-6">
    <div class="mb-4">
      <h3 class="text-lg font-semibold text-slate-900">Выполнение заказов</h3>
      <p class="text-sm text-slate-600">Статусы заказов за текущий период</p>
    </div>

    <div class="flex items-end justify-around h-64 gap-2">
      <div v-for="status in statusCounts" :key="status.label" class="flex flex-col items-center">
        <div class="text-sm font-semibold text-slate-900 mb-2">{{ status.count }}</div>
        <div
          :style="{ height: getBarHeight(status.count) }"
          :class="getBarColor(status.label)"
          class="w-12 rounded-t-lg transition"
        ></div>
        <div class="text-xs text-slate-600 text-center mt-2 w-14">{{ status.label }}</div>
      </div>
    </div>

    <div class="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
      <div
        v-for="status in statusCounts"
        :key="status.label"
        class="text-center p-3 rounded-lg bg-slate-50"
      >
        <div class="text-2xl font-bold text-slate-900">{{ status.count }}</div>
        <div class="text-xs text-slate-600 mt-1">{{ status.label }}</div>
        <div class="text-xs text-slate-500 mt-1">
          {{ ((status.count / totalOrders) * 100).toFixed(0) }}%
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

const maxCount = computed(() => Math.max(...statusCounts.value.map((s) => s.count), 5))

const getBarHeight = (count: number) => {
  const percentage = (count / maxCount.value) * 100
  return `${Math.max(percentage, 10)}%`
}

const getBarColor = (label: string) => {
  const colors: Record<string, string> = {
    Принят: 'bg-blue-500',
    'В производстве': 'bg-orange-500',
    'На складе': 'bg-purple-500',
    Отправлен: 'bg-green-500',
  }
  return colors[label] || 'bg-slate-500'
}
</script>
