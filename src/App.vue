<template>
  <div v-if="isAuthPage" class="w-full">
    <router-view />
  </div>

  <div v-else class="min-h-screen bg-slate-50 flex flex-col">
    <!-- Navbar -->
    <nav class="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div class="max-w-7xl mx-auto px-3 sm:px-6 py-4 flex items-center justify-between">
        <!-- Logo -->
        <router-link to="/store" class="flex items-center gap-2 sm:gap-3 flex-shrink-0 hover:opacity-80 transition">
          <div
            class="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center flex-shrink-0 relative overflow-hidden shadow-md"
          >
            <svg class="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" viewBox="0 0 24 24">
              <ellipse cx="12" cy="12" rx="8" ry="7.5" fill="currentColor" opacity="0.15" />
              <circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="1.3" />
              <g transform="translate(5, 9)">
                <path
                  d="M 2 0 L 2 4 M 3.5 0 L 3.5 4"
                  stroke="currentColor"
                  stroke-width="1.1"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M 1.5 4 L 4 4 Q 2.75 5.2 2.75 6.5"
                  stroke="currentColor"
                  stroke-width="1.1"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </g>
              <g transform="translate(13, 8.5)">
                <path
                  d="M 0.5 0 L 2 3 L 2.2 5 Q 1.2 5.5 0.5 5.5 Q 0.3 3.5 0.5 0"
                  stroke="currentColor"
                  stroke-width="1.1"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <line
                  x1="0.5"
                  y1="0"
                  x2="2"
                  y2="3"
                  stroke="currentColor"
                  stroke-width="1.1"
                  stroke-linecap="round"
                />
              </g>
              <circle cx="12" cy="12" r="0.9" fill="currentColor" opacity="0.7" />
            </svg>
          </div>
          <div class="min-w-0">
            <h1 class="text-lg sm:text-xl font-bold text-slate-900 truncate">ПосудаПро</h1>
            <p class="text-xs text-slate-500 hidden sm:block">{{ headerSubtitle }}</p>
          </div>
        </router-link>

        <!-- Navigation and user menu -->
        <div class="flex items-center gap-2 sm:gap-8">
          <!-- Admin/Store nav -->
          <div class="hidden lg:flex gap-1">
            <template v-if="isAdmin">
              <router-link
                v-for="nav in adminNavItems"
                :key="nav.path"
                :to="nav.path"
                :class="[
                  'px-3 py-2 text-sm rounded-lg font-medium transition-colors whitespace-nowrap',
                  $route.path === nav.path || $route.path.startsWith(nav.path + '/')
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100',
                ]"
              >
                {{ nav.label }}
              </router-link>
            </template>
            <template v-else>
              <router-link
                to="/store"
                :class="[
                  'px-3 py-2 text-sm rounded-lg font-medium transition-colors whitespace-nowrap',
                  $route.path === '/store'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100',
                ]"
              >
                Магазин
              </router-link>
            </template>
          </div>

          <!-- Right side buttons -->
          <div class="flex items-center gap-1 sm:gap-3">
            <!-- Cart (customer only) -->
            <router-link
              v-if="!isAdmin"
              to="/cart"
              class="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              :class="{ 'bg-blue-100 text-blue-700': $route.path === '/cart' }"
              title="Корзина"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span
                v-if="cartItemCount > 0"
                class="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center"
              >
                {{ cartItemCount > 9 ? '9+' : cartItemCount }}
              </span>
            </router-link>

            <!-- Notifications (admin only) -->
            <button
              v-if="isAdmin"
              @click="showNotificationPanel = !showNotificationPanel"
              class="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              :class="{ 'bg-blue-100 text-blue-700': showNotificationPanel }"
              title="Уведомления"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              <span
                v-if="isAdmin && unreadCount > 0"
                class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"
              ></span>
            </button>

            <!-- User menu -->
            <div class="relative">
              <button
                @click="showUserMenu = !showUserMenu"
                class="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                title="Профиль"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>

              <!-- User dropdown menu -->
              <div
                v-if="showUserMenu"
                class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 z-10"
              >
                <div class="px-4 py-3 border-b border-slate-200">
                  <p class="text-sm font-semibold text-slate-900">{{ currentUser?.name }}</p>
                  <p class="text-xs text-slate-600">{{ currentUser?.email }}</p>
                  <p v-if="isAdmin" class="text-xs text-blue-600 font-semibold">Администратор</p>
                  <p v-else class="text-xs text-slate-600">Покупатель</p>
                </div>
                <button
                  v-if="isAdmin"
                  @click="goToAdmin"
                  class="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition"
                >
                  Админ-панель
                </button>
                <button
                  v-if="!isAdmin"
                  @click="goToStore"
                  class="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition"
                >
                  Магазин
                </button>
                <button
                  @click="handleLogout"
                  class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition border-t border-slate-200"
                >
                  Выход
                </button>
              </div>
            </div>

            <!-- Mobile menu button -->
            <button
              class="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg lg:hidden transition-colors"
              title="Меню"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main content -->
    <main class="flex-1 max-w-7xl mx-auto w-full px-3 sm:px-6 py-6 sm:py-8">
      <router-view />
    </main>

    <!-- Footer -->
    <footer v-if="!isAdmin" class="border-t border-slate-200 mt-12 sm:mt-16 bg-white">
      <div class="max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-8">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 mb-8">
          <div>
            <h3 class="font-semibold text-slate-900 mb-4">ПосудаПро</h3>
            <p class="text-sm text-slate-600">Премиум посуда и кухонная утварь высокого качества</p>
          </div>
          <div>
            <h4 class="font-semibold text-slate-900 mb-4">Продукт</h4>
            <ul class="space-y-2 text-sm text-slate-600">
              <li><a href="#" class="hover:text-blue-600">Каталог</a></li>
              <li><a href="#" class="hover:text-blue-600">Специальные предложения</a></li>
              <li><a href="#" class="hover:text-blue-600">О нас</a></li>
            </ul>
          </div>
          <div>
            <h4 class="font-semibold text-slate-900 mb-4">Помощь</h4>
            <ul class="space-y-2 text-sm text-slate-600">
              <li><a href="#" class="hover:text-blue-600">Доставка</a></li>
              <li><a href="#" class="hover:text-blue-600">Возвраты</a></li>
              <li><a href="#" class="hover:text-blue-600">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4 class="font-semibold text-slate-900 mb-4">Контакты</h4>
            <ul class="space-y-2 text-sm text-slate-600">
              <li>Email: info@posudapro.tj</li>
              <li>Телефон: +992 37 XXXXXX</li>
              <li>г. Душанбе, Таджикистан</li>
            </ul>
          </div>
        </div>
        <div
          class="border-t border-slate-200 pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <p class="text-xs sm:text-sm text-slate-600 text-center sm:text-left">
            &copy; 2024 ПосудаПро. Все права защищены.
          </p>
        </div>
      </div>
    </footer>

    <!-- Notification components (admin only) -->
    <NotificationToast v-if="isAdmin" />
    <NotificationPanel v-if="isAdmin" :is-open="showNotificationPanel" @close="showNotificationPanel = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useNotification } from './composables/useNotification'
import { useAppState } from './composables/useAppState'
import { useAuth } from './composables/useAuth'
import NotificationToast from './components/NotificationToast.vue'
import NotificationPanel from './components/NotificationPanel.vue'

const router = useRouter()
const route = useRoute()

// Initialize app state and auth
useAppState()
const { getUnreadCount } = useNotification()
const { isLoggedIn, isAdmin: checkIsAdmin, currentUser, logout } = useAuth()

const showNotificationPanel = ref(false)
const showUserMenu = ref(false)
const unreadCount = computed(() => getUnreadCount())
const isAdmin = computed(() => checkIsAdmin())

// Determine if we're on auth page
const isAuthPage = computed(() => {
  return route.path === '/login' || route.path === '/register'
})

// Header subtitle based on role
const headerSubtitle = computed(() => {
  if (isAdmin.value) {
    return 'Управление производством'
  }
  return 'Премиум посуда и кухонная утварь'
})

// Navigation items for admin
const adminNavItems = [
  { path: '/admin', label: 'Дашборд' },
  { path: '/admin/orders', label: 'Заказы' },
  { path: '/admin/products', label: 'Товары' },
  { path: '/admin/inventory', label: 'Склад' },
  { path: '/admin/finance', label: 'Финансы' },
  { path: '/admin/analytics', label: 'Аналитика' },
  { path: '/admin/production-planning', label: 'Производство' },
  { path: '/admin/warehouse', label: 'Хранилище' },
]

const handleLogout = () => {
  logout()
  showUserMenu.value = false
  router.push('/login')
}

const goToAdmin = () => {
  router.push('/admin')
  showUserMenu.value = false
}

const goToStore = () => {
  router.push('/store')
  showUserMenu.value = false
}
</script>
