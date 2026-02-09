<template>
  <form @submit.prevent="handleRegister" class="space-y-4">
    <div>
      <label for="name" class="block text-sm font-medium text-slate-700 mb-1">
        Полное имя
      </label>
      <input
        id="name"
        v-model="name"
        type="text"
        required
        class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-black"
        placeholder="Иван Петров"
      />
    </div>

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
        class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-black"
        placeholder="Минимум 6 символов"
      />
      <p class="text-xs text-slate-500 mt-1">Минимум 6 символов</p>
    </div>

    <div>
      <label for="confirm-password" class="block text-sm font-medium text-slate-700 mb-1">
        Подтверждение пароля
      </label>
      <input
        id="confirm-password"
        v-model="confirmPassword"
        type="password"
        required
        class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-black"
        placeholder="Повторите пароль"
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
      <span v-if="isLoading">Регистрация...</span>
      <span v-else>Зарегистрироваться</span>
    </button>

    <p class="text-center text-sm text-slate-600">
      Уже есть аккаунт?
      <router-link to="/login" class="text-blue-600 hover:text-blue-700 font-semibold">
        Войти
      </router-link>
    </p>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { register } = useAuth()

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const error = ref('')
const isLoading = ref(false)

const handleRegister = () => {
  error.value = ''

  // Validation
  if (!name.value.trim()) {
    error.value = 'Пожалуйста, введите имя'
    return
  }

  if (!email.value.trim()) {
    error.value = 'Пожалуйста, введите email'
    return
  }

  if (password.value.length < 6) {
    error.value = 'Пароль должен быть не менее 6 символов'
    return
  }

  if (password.value !== confirmPassword.value) {
    error.value = 'Пароли не совпадают'
    return
  }

  isLoading.value = true

  // Simulate network delay
  setTimeout(() => {
    const result = register(email.value, password.value, name.value)

    if (result.success) {
      router.push('/store')
    } else {
      error.value = result.error || 'Ошибка регистрации'
    }

    isLoading.value = false
  }, 300)
}
</script>
