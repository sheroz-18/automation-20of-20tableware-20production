<template>
  <form @submit.prevent="handleLogin" class="space-y-4">
    <div>
      <label for="email" class="block text-sm font-medium text-slate-700 mb-1">
        Email адрес
      </label>
      <input
        id="email"
        v-model="email"
        type="email"
        required
        class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-black"
        placeholder="вы@пример.com"
      />
    </div>

    <div>
      <label for="password" class="block text-sm font-medium text-slate-700 mb-1">
        Пароль
      </label>
      <input
        id="password"
        v-model="password"
        type="password"
        required
        class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
        placeholder="••••••"
      />
    </div>

    <div v-if="error" class="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
      {{ error }}
    </div>

    <button
      type="submit"
      :disabled="isLoading"
      class="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <span v-if="isLoading">Вход...</span>
      <span v-else>Войти</span>
    </button>

    <p class="text-center text-sm text-slate-600">
      Нет аккаунта?
      <router-link to="/register" class="text-blue-600 hover:text-blue-700 font-semibold">
        Зарегистрироваться
      </router-link>
    </p>

    <div class="border-t border-slate-300 pt-4">
      <p class="text-xs text-slate-500 text-center mb-2">Демо учетные данные:</p>
      <button
        type="button"
        @click="fillAdminDemo"
        class="w-full px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition mb-2"
      >
        Админ: admin@posudapro.ru / admin123
      </button>
      <button
        type="button"
        @click="fillCustomerDemo"
        class="w-full px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition"
      >
        Покупатель: customer@example.com / customer123
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { login } = useAuth()

const email = ref('')
const password = ref('')
const error = ref('')
const isLoading = ref(false)

const handleLogin = () => {
  error.value = ''
  isLoading.value = true

  // Simulate network delay
  setTimeout(() => {
    const result = login(email.value, password.value)

    if (result.success) {
      // Redirect based on user role
      router.push('/store')
    } else {
      error.value = result.error || 'Ошибка входа'
    }

    isLoading.value = false
  }, 300)
}

const fillAdminDemo = () => {
  email.value = 'admin@posudapro.ru'
  password.value = 'admin123'
}

const fillCustomerDemo = () => {
  email.value = 'customer@example.com'
  password.value = 'customer123'
}
</script>
