import { ref } from 'vue'
import type { Notification } from '../types'

const notifications = ref<Notification[]>([])
const toastQueue = ref<Notification[]>([])

export function useNotification() {
  const addNotification = (
    type: 'success' | 'error' | 'warning' | 'info',
    title: string,
    message: string,
    options?: { autoClose?: number; actionUrl?: string },
  ) => {
    const id = `notif-${Date.now()}-${Math.random()}`
    const notification: Notification = {
      id,
      type,
      title,
      message,
      timestamp: new Date().toLocaleString('ru-RU'),
      read: false,
      actionUrl: options?.actionUrl,
    }

    notifications.value.unshift(notification)
    toastQueue.value.push(notification)

    if (options?.autoClose !== false) {
      const duration = options?.autoClose || 4000
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }

    return id
  }

  const removeToast = (id: string) => {
    const index = toastQueue.value.findIndex((n) => n.id === id)
    if (index !== -1) {
      toastQueue.value.splice(index, 1)
    }
  }

  const markAsRead = (id: string) => {
    const notification = notifications.value.find((n) => n.id === id)
    if (notification) {
      notification.read = true
    }
  }

  const clearNotifications = () => {
    notifications.value = []
  }

  const deleteNotification = (id: string) => {
    const index = notifications.value.findIndex((n) => n.id === id)
    if (index !== -1) {
      notifications.value.splice(index, 1)
    }
  }

  const getUnreadCount = () => {
    return notifications.value.filter((n) => !n.read).length
  }

  return {
    notifications,
    toastQueue,
    addNotification,
    removeToast,
    markAsRead,
    clearNotifications,
    deleteNotification,
    getUnreadCount,
  }
}
