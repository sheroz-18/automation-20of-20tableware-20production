<template>
  <div
    class="fixed right-0 top-0 h-screen w-96 bg-white shadow-xl border-l border-slate-200 flex flex-col z-40"
    :class="{ 'translate-x-full': !isOpen }"
  >
    <div class="border-b border-slate-200 p-4 flex items-center justify-between">
      <div>
        <h2 class="text-lg font-semibold text-slate-900">Уведомления</h2>
        <p class="text-sm text-slate-600">{{ unreadCount }} новых</p>
      </div>
      <button @click="$emit('close')" class="p-2 hover:bg-slate-100 rounded-lg transition">
        <svg class="w-5 h-5 text-slate-600" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </div>

    <div class="flex-1 overflow-y-auto">
      <div v-if="notifications.length === 0" class="p-6 text-center text-slate-500">
        <p>Нет уведомлений</p>
      </div>
      <div v-else class="divide-y divide-slate-200">
        <div
          v-for="notification in notifications"
          :key="notification.id"
          :class="[
            'p-4 border-l-4 cursor-pointer transition hover:bg-slate-50',
            getNotificationStyle(notification.type),
            !notification.read ? 'bg-blue-50' : '',
          ]"
          @click="markAsRead(notification.id)"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <h3 class="font-semibold text-sm text-slate-900">
                {{ notification.title }}
              </h3>
              <p class="text-sm text-slate-600 mt-1">{{ notification.message }}</p>
              <p class="text-xs text-slate-500 mt-2">{{ notification.timestamp }}</p>
            </div>
            <button
              @click.stop="deleteNotification(notification.id)"
              class="p-1 hover:bg-slate-300 rounded transition"
            >
              <svg class="w-4 h-4 text-slate-600" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="notifications.length > 0" class="border-t border-slate-200 p-4 space-y-2">
      <button
        @click="clearAll"
        class="w-full px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition"
      >
        Очистить все
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useNotification } from '../composables/useNotification'

defineProps<{
  isOpen: boolean
}>()

defineEmits<{
  close: []
}>()

const { notifications, markAsRead, deleteNotification, clearNotifications, getUnreadCount } =
  useNotification()

const unreadCount = computed(() => getUnreadCount())

const getNotificationStyle = (type: string) => {
  const styles: Record<string, string> = {
    success: 'border-l-green-500 bg-green-50',
    error: 'border-l-red-500 bg-red-50',
    warning: 'border-l-amber-500 bg-amber-50',
    info: 'border-l-blue-500 bg-blue-50',
  }
  return styles[type] || styles.info
}

const clearAll = () => {
  clearNotifications()
}
</script>

<style scoped>
@keyframes slideInFromRight {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

.fixed {
  animation: slideInFromRight 0.3s ease-out;
}
</style>
