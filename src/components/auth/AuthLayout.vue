<template>
  <div
    class="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 flex items-center justify-center p-4"
  >
    <!-- Background pattern -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        class="absolute top-0 left-0 w-96 h-96 bg-white rounded-full opacity-10 blur-3xl -translate-x-1/2 -translate-y-1/2"
      ></div>
      <div
        class="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full opacity-10 blur-3xl translate-x-1/2 translate-y-1/2"
      ></div>
    </div>

    <!-- Card -->
    <div class="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 sm:p-10">
      <!-- Logo -->
      <div class="flex justify-center mb-8">
        <div
          class="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-lg"
        >
          <svg class="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24">
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
      </div>

      <!-- Title -->
      <h1 class="text-2xl sm:text-3xl font-bold text-center text-slate-900 mb-2">ПосудаПро</h1>
      <p class="text-center text-slate-500 text-sm mb-8">
        {{ subtitle }}
      </p>

      <!-- Form slot -->
      <slot />

      <!-- Footer -->
      <p class="text-center text-xs text-slate-500 mt-8 pt-6 border-t border-slate-200">
        &copy; 2024 ПосудаПро. Все права защищены.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  subtitle?: string
}

withDefaults(defineProps<Props>(), {
  subtitle: 'Премиум посуда и кухонная утварь',
})
</script>
