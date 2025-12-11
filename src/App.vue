<template>
  <div class="min-h-screen bg-slate-50">
    <nav class="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center"
          >
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19.428 15.428a2 2 0 00-1.414-.586h-.028a2 2 0 00-1.414.586m0 0L21 21m-2.428-2.428l6.868-6.868a2 2 0 00-2.828-2.828l-6.868 6.868m0 0L9 12m0 0l2.428 2.428m0 0l6.868-6.868"
              />
            </svg>
          </div>
          <div>
            <h1 class="text-xl font-bold text-slate-900">ProduceFlow</h1>
            <p class="text-xs text-slate-500">Автоматизация производства посуды</p>
          </div>
        </div>

        <div class="flex items-center gap-8">
          <div class="hidden md:flex gap-1">
            <router-link
              v-for="nav in navItems"
              :key="nav.path"
              :to="nav.path"
              :class="[
                'px-4 py-2 rounded-lg font-medium transition-colors',
                $route.path === nav.path
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100',
              ]"
            >
              {{ nav.label }}
            </router-link>
          </div>

          <div class="flex items-center gap-3">
            <button
              class="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <button class="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>

            <button
              class="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg md:hidden"
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

    <main class="max-w-7xl mx-auto px-6 py-8">
      <router-view />
    </main>

    <footer class="border-t border-slate-200 mt-16 bg-white">
      <div class="max-w-7xl mx-auto px-6 py-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 class="font-semibold text-slate-900 mb-4">ProduceFlow</h3>
            <p class="text-sm text-slate-600">
              Полная автоматизация производства посуды и кухонной утвари
            </p>
          </div>
          <div>
            <h4 class="font-semibold text-slate-900 mb-4">Продукт</h4>
            <ul class="space-y-2 text-sm text-slate-600">
              <li><a href="#" class="hover:text-blue-600">Особенности</a></li>
              <li><a href="#" class="hover:text-blue-600">Цены</a></li>
              <li><a href="#" class="hover:text-blue-600">Демо</a></li>
            </ul>
          </div>
          <div>
            <h4 class="font-semibold text-slate-900 mb-4">Компания</h4>
            <ul class="space-y-2 text-sm text-slate-600">
              <li><a href="#" class="hover:text-blue-600">О нас</a></li>
              <li><a href="#" class="hover:text-blue-600">Блог</a></li>
              <li><a href="#" class="hover:text-blue-600">Контакты</a></li>
            </ul>
          </div>
          <div>
            <h4 class="font-semibold text-slate-900 mb-4">Поддержка</h4>
            <ul class="space-y-2 text-sm text-slate-600">
              <li><a href="#" class="hover:text-blue-600">Справка</a></li>
              <li><a href="#" class="hover:text-blue-600">Документация</a></li>
              <li><a href="#" class="hover:text-blue-600">API</a></li>
            </ul>
          </div>
        </div>
        <div class="border-t border-slate-200 pt-8 flex items-center justify-between">
          <p class="text-sm text-slate-600">&copy; 2024 ProduceFlow. Все права защищены.</p>
          <div class="flex gap-6">
            <a href="#" class="text-slate-600 hover:text-blue-600">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const navItems = [
  { path: '/', label: 'Панель управления' },
  { path: '/inventory', label: 'Инвентаризация' },
  { path: '/products', label: 'Товары' },
  { path: '/orders', label: 'Заказы' },
  { path: '/finance', label: 'Финансы' },
  { path: '/analytics', label: 'Аналитика' },
  { path: '/production-planning', label: 'Производство' },
  { path: '/warehouse', label: 'Склад' },
]
</script>
