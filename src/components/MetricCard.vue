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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const icons: Record<string, any> = {
    'trending-up': defineComponent({
      template:
        '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>',
    }),
    package: defineComponent({
      template:
        '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 005.646 5.646 9 9 0 0120.354 15.354z" /></svg>',
    }),
    box: defineComponent({
      template:
        '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>',
    }),
    zap: defineComponent({
      template:
        '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>',
    }),
  }
  return icons[props.icon] || icons['trending-up']
})
</script>
