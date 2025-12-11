<template>
  <div class="bg-white rounded-lg shadow border border-slate-200 p-6">
    <div class="mb-4">
      <h3 class="text-lg font-semibold text-slate-900">Прогресс производства</h3>
      <p class="text-sm text-slate-600">Этапы производственных партий</p>
    </div>

    <div class="space-y-4">
      <div v-for="batch in batches" :key="batch.id" class="border border-slate-200 rounded-lg p-4">
        <div class="flex items-center justify-between mb-2">
          <div>
            <h4 class="font-semibold text-slate-900">{{ batch.batchNumber }}</h4>
            <p class="text-xs text-slate-600">{{ batch.productName }}</p>
          </div>
          <span :class="getStatusBadge(batch.status)" class="px-2 py-1 rounded text-xs font-medium">
            {{ getStatusLabel(batch.status) }}
          </span>
        </div>

        <div class="mb-3">
          <div class="flex justify-between text-xs text-slate-600 mb-1">
            <span>Прогресс</span>
            <span>{{ completedStages }}/{{ batch.stages.length }} этапов</span>
          </div>
          <div class="w-full bg-slate-200 rounded-full h-2">
            <div
              :style="{ width: getProgressPercentage(batch) + '%' }"
              class="bg-blue-500 h-2 rounded-full transition-all"
            ></div>
          </div>
        </div>

        <div class="grid grid-cols-5 gap-2">
          <div
            v-for="(stage, index) in batch.stages"
            :key="index"
            :class="[
              'p-2 rounded text-center text-xs',
              stage.completed
                ? 'bg-green-100 text-green-700 font-medium'
                : index < batch.currentStage
                  ? 'bg-slate-100 text-slate-700'
                  : index === batch.currentStage
                    ? 'bg-blue-100 text-blue-700 font-medium'
                    : 'bg-slate-50 text-slate-500',
            ]"
          >
            <div class="truncate">{{ index + 1 }}</div>
            <div class="text-xs opacity-75">{{ stage.stageName.split('/')[0].slice(0, 4) }}</div>
          </div>
        </div>
      </div>

      <div v-if="batches.length === 0" class="text-center py-8 text-slate-500">
        <p>Нет активных партий</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ProductionBatch } from '../../types'

interface Props {
  batches: ProductionBatch[]
}

const props = defineProps<Props>()

const completedStages = computed(() => {
  const batch = props.batches[0]
  if (!batch) return 0
  return batch.stages.filter((s) => s.completed).length
})

const getProgressPercentage = (batch: ProductionBatch) => {
  const completed = batch.stages.filter((s) => s.completed).length
  return (completed / batch.stages.length) * 100
}

const getStatusBadge = (status: string) => {
  const badges: Record<string, string> = {
    planning: 'bg-slate-100 text-slate-700',
    in_progress: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  }
  return badges[status] || 'bg-slate-100 text-slate-700'
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    planning: 'Планирование',
    in_progress: 'В процессе',
    completed: 'Завершено',
    cancelled: 'Отменено',
  }
  return labels[status] || status
}
</script>
