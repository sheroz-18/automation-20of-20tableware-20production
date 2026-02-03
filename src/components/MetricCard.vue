<template>
  <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition">
    <div class="flex items-start justify-between mb-4">
      <div :class="['w-12 h-12 rounded-lg flex items-center justify-center', iconBgColor]">
        <!-- Revenue Icon -->
        <svg
          v-if="icon === 'trending-up'"
          :class="['w-6 h-6', iconColor]"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 17"></polyline>
          <polyline points="17 6 23 6 23 12"></polyline>
        </svg>

        <!-- Orders Icon -->
        <svg
          v-else-if="icon === 'package'"
          :class="['w-6 h-6', iconColor]"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>

        <!-- Inventory Icon -->
        <svg
          v-else-if="icon === 'box'"
          :class="['w-6 h-6', iconColor]"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
          <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
          <line x1="12" y1="22.08" x2="12" y2="12"></line>
        </svg>

        <!-- Production Icon -->
        <svg
          v-else-if="icon === 'zap'"
          :class="['w-6 h-6', iconColor]"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
        </svg>
      </div>
      <div
        :class="['text-xs font-semibold px-2 py-1 rounded-full', changeBgColor, changeTextColor]"
      >
        {{ change }}
      </div>
    </div>

    <p class="text-sm text-slate-600 mb-1">{{ label }}</p>
    <p class="text-2xl font-bold text-slate-900">{{ value }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed, defineComponent } from 'vue'

interface Props {
  icon: string
  label: string
  value: string
  change: string
  changeType: 'positive' | 'negative'
}

const props = defineProps<Props>()

const iconBgColor = computed(() => {
  const colors: Record<string, string> = {
    'trending-up': 'bg-blue-100',
    package: 'bg-green-100',
    box: 'bg-orange-100',
    zap: 'bg-purple-100',
  }
  return colors[props.icon] || 'bg-blue-100'
})

const iconColor = computed(() => {
  const colors: Record<string, string> = {
    'trending-up': 'text-blue-600',
    package: 'text-green-600',
    box: 'text-orange-600',
    zap: 'text-purple-600',
  }
  return colors[props.icon] || 'text-blue-600'
})

const changeBgColor = computed(() => {
  return props.changeType === 'positive' ? 'bg-green-100' : 'bg-red-100'
})

const changeTextColor = computed(() => {
  return props.changeType === 'positive' ? 'text-green-700' : 'text-red-700'
})

const IconComponent = computed(() => {
  const icons: Record<string, any> = {
    // Revenue - Trending Up Chart
    'trending-up': defineComponent({
      template:
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 17"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>',
    }),
    // Orders - Shopping Bag
    package: defineComponent({
      template:
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>',
    }),
    // Inventory - Warehouse/Box Stack
    box: defineComponent({
      template:
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>',
    }),
    // Production - Zap/Lightning
    zap: defineComponent({
      template:
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>',
    }),
  }
  return icons[props.icon] || icons['trending-up']
})
</script>
