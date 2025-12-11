<template>
  <div class="bg-white rounded-lg shadow border border-slate-200 p-6">
    <div class="mb-4">
      <h3 class="text-lg font-semibold text-slate-900">Остатки сырья</h3>
      <p class="text-sm text-slate-600">Уровни запасов сырьевых материалов</p>
    </div>

    <div class="space-y-3">
      <div
        v-for="material in materials"
        :key="material.id"
        class="border border-slate-200 rounded-lg p-3"
      >
        <div class="flex items-center justify-between mb-2">
          <div>
            <h4 class="font-medium text-slate-900">{{ material.name }}</h4>
            <p class="text-xs text-slate-600">{{ material.unit }}</p>
          </div>
          <span :class="getStatusColor(material)" class="px-2 py-1 rounded text-xs font-medium">
            {{ material.quantity }} / {{ material.minStockLevel }}
          </span>
        </div>

        <div class="w-full bg-slate-200 rounded-full h-3">
          <div
            :style="{ width: getPercentage(material) + '%' }"
            :class="getProgressColor(material)"
            class="h-3 rounded-full transition-all"
          ></div>
        </div>

        <div class="flex justify-between mt-2 text-xs text-slate-500">
          <span>{{ getStockStatus(material) }}</span>
          <span
            v-if="material.expiryDate"
            :class="isExpired(material) ? 'text-red-600 font-medium' : 'text-slate-600'"
          >
            Годен до: {{ material.expiryDate }}
          </span>
        </div>
      </div>

      <div v-if="materials.length === 0" class="text-center py-8 text-slate-500">
        <p>Нет данных о сырье</p>
      </div>
    </div>

    <div v-if="criticalMaterials.length > 0" class="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
      <h4 class="font-semibold text-red-900 mb-2">⚠️ Критический уровень запасов</h4>
      <ul class="text-sm text-red-800 space-y-1">
        <li v-for="material in criticalMaterials" :key="material.id">
          {{ material.name }} - {{ material.quantity }}/{{ material.minStockLevel }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { RawMaterial } from '../../types'

interface Props {
  materials: RawMaterial[]
}

const props = defineProps<Props>()

const criticalMaterials = computed(() => {
  return props.materials.filter((m) => m.quantity < m.minStockLevel * 0.5)
})

const getPercentage = (material: RawMaterial) => {
  const percentage = (material.quantity / material.minStockLevel) * 100
  return Math.min(percentage, 100)
}

const getProgressColor = (material: RawMaterial) => {
  if (material.quantity < material.minStockLevel * 0.25) {
    return 'bg-red-500'
  }
  if (material.quantity < material.minStockLevel * 0.75) {
    return 'bg-amber-500'
  }
  return 'bg-green-500'
}

const getStatusColor = (material: RawMaterial) => {
  if (material.quantity < material.minStockLevel * 0.25) {
    return 'bg-red-100 text-red-700'
  }
  if (material.quantity < material.minStockLevel * 0.75) {
    return 'bg-amber-100 text-amber-700'
  }
  return 'bg-green-100 text-green-700'
}

const getStockStatus = (material: RawMaterial) => {
  const percentage = (material.quantity / material.minStockLevel) * 100
  if (percentage < 25) return 'Критически низко'
  if (percentage < 75) return 'Низкий запас'
  return 'Норма'
}

const isExpired = (material: RawMaterial) => {
  if (!material.expiryDate) return false
  return new Date(material.expiryDate) < new Date()
}
</script>
