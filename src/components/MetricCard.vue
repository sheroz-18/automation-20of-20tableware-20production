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
    'trending-up': defineComponent({
      template:
        '<svg fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"/><path d="M20 3h-7v2h5.59L8 14.59v2.82h2.82l9.59-9.59V10h2V3z"/></svg>',
    }),
    package: defineComponent({
      template:
        '<svg fill="currentColor" viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>',
    }),
    box: defineComponent({
      template:
        '<svg fill="currentColor" viewBox="0 0 24 24"><path d="M21 16v-5h-1V4c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v7H3v5c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zm-2-7h-1V4h4v5zM6 4h4v5H6V4zm13 12H5v-5h14v5z"/><path d="M8 15h2v2H8zm4 0h2v2h-2zm4 0h2v2h-2z"/></svg>',
    }),
    zap: defineComponent({
      template:
        '<svg fill="currentColor" viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/><path d="M6 13l7-9-1 6h8l-9 11 1-8H6z"/></svg>',
    }),
  }
  return icons[props.icon] || icons['trending-up']
})
</script>
