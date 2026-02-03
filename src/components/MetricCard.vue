<template>
  <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition">
    <div class="flex items-start justify-between mb-4">
      <div :class="['w-12 h-12 rounded-lg flex items-center justify-center', iconBgColor]">
        <component :is="IconComponent" :class="['w-6 h-6', iconColor]" />
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
        '<svg fill="currentColor" viewBox="0 0 24 24"><path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/></svg>',
    }),
    // Orders - Shopping Bag
    package: defineComponent({
      template:
        '<svg fill="currentColor" viewBox="0 0 24 24"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-0.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-0.16 0.28-0.25 0.61-0.25 0.96 0 1.1 0.9 2 2 2h12v-2H7.42c-0.14 0-0.25-0.11-0.25-0.25l0.03-0.12 0.9-1.63h7.45c0.75 0 1.41-0.41 1.75-1.03l3.58-6.49c0.08-0.16 0.12-0.33 0.12-0.5 0-0.55-0.45-1-1-1H5.21l-0.94-2H1zm16 16c-1.1 0-1.99 0.9-1.99 2s0.89 2 1.99 2 2-0.9 2-2-0.9-2-2-2z"/></svg>',
    }),
    // Inventory - Warehouse/Box Stack
    box: defineComponent({
      template:
        '<svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>',
    }),
    // Production - Zap/Lightning
    zap: defineComponent({
      template:
        '<svg fill="currentColor" viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>',
    }),
  }
  return icons[props.icon] || icons['trending-up']
})
</script>
