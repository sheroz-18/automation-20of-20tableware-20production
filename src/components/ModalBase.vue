<template>
  <transition name="modal">
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="fixed inset-0 bg-black/50" @click="closeModal"></div>
      <div class="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 class="text-2xl font-bold text-slate-900">{{ title }}</h2>
          <button
            @click="closeModal"
            class="text-slate-500 hover:text-slate-700 transition"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div class="p-6">
          <slot></slot>
        </div>

        <div v-if="showActions" class="flex gap-3 justify-end p-6 border-t border-slate-200">
          <button
            @click="closeModal"
            class="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition"
          >
            Закрыть
          </button>
          <button
            v-if="showSaveButton"
            @click="$emit('save')"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition"
          >
            Сохранить
          </button>
          <button
            v-if="showDeleteButton"
            @click="$emit('delete')"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition"
          >
            Удалить
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
interface Props {
  isOpen: boolean
  title: string
  showActions?: boolean
  showSaveButton?: boolean
  showDeleteButton?: boolean
}

withDefaults(defineProps<Props>(), {
  showActions: true,
  showSaveButton: false,
  showDeleteButton: false,
})

const emit = defineEmits<{
  close: []
  save: []
  delete: []
}>()

const closeModal = () => {
  emit('close')
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
