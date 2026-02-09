<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
      <div class="p-6 border-b border-slate-200">
        <h2 class="text-lg font-semibold text-slate-900">Подтвердить очистку</h2>
      </div>

      <div class="p-6 space-y-4">
        <div class="flex items-start gap-3">
          <svg class="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4v2m0-12a9 9 0 110 18 9 9 0 010-18z" />
          </svg>
          <div>
            <p class="font-medium text-slate-900">{{ title }}</p>
            <p class="text-sm text-slate-600 mt-1">{{ message }}</p>
          </div>
        </div>

        <div class="bg-red-50 border border-red-200 rounded-lg p-3">
          <p class="text-xs font-semibold text-red-900">⚠️ ВАЖНО</p>
          <p class="text-xs text-red-700 mt-1">
            Это действие нельзя отменить. Все данные будут безвозвратно удалены.
          </p>
        </div>

        <div>
          <label class="text-sm font-medium text-slate-700 block mb-2">
            Введите "<span class="font-bold text-red-600">{{ confirmText }}</span>" для подтверждения:
          </label>
          <input
            v-model="confirmInput"
            type="text"
            placeholder="Введите текст подтверждения"
            class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-700"
          />
        </div>
      </div>

      <div class="p-6 border-t border-slate-200 flex gap-3 justify-end">
        <button
          @click="onCancel"
          class="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition"
        >
          Отмена
        </button>
        <button
          @click="onConfirm"
          :disabled="confirmInput !== confirmText"
          :class="[
            'px-4 py-2 rounded-lg font-medium transition',
            confirmInput === confirmText
              ? 'bg-red-600 text-white hover:bg-red-700'
              : 'bg-red-300 text-red-50 cursor-not-allowed',
          ]"
        >
          Удалить все данные
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  isOpen: boolean
  title: string
  message: string
  confirmText?: string
}

interface Emits {
  (e: 'confirm'): void
  (e: 'cancel'): void
}

withDefaults(defineProps<Props>(), {
  confirmText: 'УДАЛИТЬ',
})

const emit = defineEmits<Emits>()

const confirmInput = ref('')

const onCancel = () => {
  confirmInput.value = ''
  emit('cancel')
}

const onConfirm = () => {
  confirmInput.value = ''
  emit('confirm')
}
</script>
