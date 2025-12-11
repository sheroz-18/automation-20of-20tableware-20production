<template>
  <div class="space-y-8">
    <div>
      <h1 class="text-4xl font-bold text-slate-900">Панель управления производством</h1>
      <p class="text-slate-600 mt-2">Контролируйте процесс производства посуды в реальном времени</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard
        icon="trending-up"
        label="Общая выручка"
        value="₽4,651"
        change="+12.5%"
        changeType="positive"
      />
      <MetricCard
        icon="package"
        label="Активные заказы"
        value="5"
        change="+8.3%"
        changeType="positive"
      />
      <MetricCard
        icon="box"
        label="На складе единиц"
        value="3,815"
        change="-5.2%"
        changeType="negative"
      />
      <MetricCard
        icon="zap"
        label="Произведено сегодня"
        value="2,420"
        change="+15.7%"
        changeType="positive"
      />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-semibold text-slate-900">Статус заказов</h2>
          <router-link to="/orders" class="text-blue-600 hover:text-blue-700 text-sm font-medium">Все заказы →</router-link>
        </div>
        
        <div class="space-y-3">
          <div class="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:border-blue-300 transition">
            <div>
              <p class="font-medium text-slate-900">ORD-2024-004</p>
              <p class="text-sm text-slate-600">Розничная сеть "Кухня" - 200 обеденных тарелок + еще 2 товара</p>
            </div>
            <span class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">Отправлено</span>
          </div>
          
          <div class="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:border-orange-300 transition">
            <div>
              <p class="font-medium text-slate-900">ORD-2024-003</p>
              <p class="text-sm text-slate-600">Café "Ароматный мир" - 120 фарфоровых чашек</p>
            </div>
            <span class="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">Ожидание</span>
          </div>
          
          <div class="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:border-purple-300 transition">
            <div>
              <p class="font-medium text-slate-900">ORD-2024-001</p>
              <p class="text-sm text-slate-600">ООО Ресторан "Гурман" - 50 обеденных тарелок + приборы</p>
            </div>
            <span class="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">Обработка</span>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-semibold text-slate-900">Критические остатки</h2>
          <router-link to="/inventory" class="text-blue-600 hover:text-blue-700 text-sm font-medium">Все →</router-link>
        </div>
        
        <div class="space-y-4">
          <div class="p-3 rounded-lg bg-red-50 border border-red-200">
            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium text-red-900">Стеклянный стакан</p>
                <p class="text-sm text-red-700">0 единиц</p>
              </div>
              <span class="text-2xl font-bold text-red-600">0</span>
            </div>
          </div>
          
          <div class="p-3 rounded-lg bg-orange-50 border border-orange-200">
            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium text-orange-900">Фарфоровая чашка</p>
                <p class="text-sm text-orange-700">45 единиц (нужно 200)</p>
              </div>
              <span class="text-2xl font-bold text-orange-600">45</span>
            </div>
          </div>

          <button class="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition">
            Создать заказ на пополнение
          </button>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 class="text-lg font-semibold text-slate-900 mb-6">Производительность по категориям</h2>
        
        <div class="space-y-4">
          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium text-slate-700">Тарелки</span>
              <span class="text-sm font-semibold text-slate-900">1,270 шт</span>
            </div>
            <div class="w-full bg-slate-200 rounded-full h-2">
              <div class="bg-blue-600 h-2 rounded-full" style="width: 85%"></div>
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium text-slate-700">Приборы</span>
              <span class="text-sm font-semibold text-slate-900">860 шт</span>
            </div>
            <div class="w-full bg-slate-200 rounded-full h-2">
              <div class="bg-blue-600 h-2 rounded-full" style="width: 58%"></div>
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium text-slate-700">Миски</span>
              <span class="text-sm font-semibold text-slate-900">320 шт</span>
            </div>
            <div class="w-full bg-slate-200 rounded-full h-2">
              <div class="bg-blue-600 h-2 rounded-full" style="width: 22%"></div>
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium text-slate-700">Кухонная утварь</span>
              <span class="text-sm font-semibold text-slate-900">180 шт</span>
            </div>
            <div class="w-full bg-slate-200 rounded-full h-2">
              <div class="bg-blue-600 h-2 rounded-full" style="width: 12%"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 class="text-lg font-semibold text-slate-900 mb-6">Финансовый обзор (текущий месяц)</h2>
        
        <div class="space-y-4">
          <div class="flex items-center justify-between p-4 rounded-lg bg-green-50 border border-green-200">
            <div>
              <p class="text-sm text-green-700">Доход от продаж</p>
              <p class="font-semibold text-green-900">₽3,681</p>
            </div>
            <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
          </div>

          <div class="flex items-center justify-between p-4 rounded-lg bg-red-50 border border-red-200">
            <div>
              <p class="text-sm text-red-700">Расходы</p>
              <p class="font-semibold text-red-900">₽6,650</p>
            </div>
            <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>

          <div class="flex items-center justify-between p-4 rounded-lg bg-slate-100 border border-slate-300">
            <div>
              <p class="text-sm text-slate-700">Баланс</p>
              <p class="font-semibold text-slate-900">-₽2,969</p>
            </div>
            <svg class="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-8 text-white">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-2xl font-bold mb-2">Готовы оптимизировать производство?</h3>
          <p class="text-blue-100">Используйте аналитику и отчеты для принятия лучших решений</p>
        </div>
        <button class="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition">
          Открыть аналитику
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import MetricCard from '../components/MetricCard.vue'
</script>
