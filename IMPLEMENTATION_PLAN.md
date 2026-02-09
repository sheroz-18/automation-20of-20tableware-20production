# План трансформации в E-commerce платформу с Админ-панелью

## 1. АРХИТЕКТУРА

### 1.1 Структура приложения
```
Главная страница (/)
├── Если не авторизирован → Логин/Регистрация
├── Если авторизирован как покупатель → Магазин (Store)
└── Если авторизирован как админ → Админ-панель

Роли пользователей:
- guest (без авторизации - может смотреть, но не покупать)
- customer (покупатель - может покупать)
- admin (администратор - полный доступ)
```

### 1.2 Новые маршруты
```
/                          → Главная страница (зависит от статуса)
/login                     → Форма входа
/register                  → Регистрация
/store                     → Магазин товаров (публичный)
/store/product/:id         → Деталь товара
/cart                      → Корзина
/checkout                  → Оформление заказа
/order-success/:orderId    → Подтверждение заказа
/admin                     → Админ-панель (защищенная)
/admin/*                   → Все текущие админ страницы (Dashboard, Orders, etc)
/profile                   → Профиль пользователя
/orders                    → Мои заказы (клиента)
```

## 2. СОЗДАНИЕ НОВЫХ КОМПОНЕНТОВ И СТРАНИЦ

### 2.1 Компоненты аутентификации
```
src/components/auth/
├── LoginForm.vue           - Форма входа (email + пароль)
├── RegisterForm.vue        - Регистрация
├── AuthLayout.vue          - Макет для страниц логина
└── LogoutButton.vue        - Кнопка выхода
```

### 2.2 Компоненты магазина
```
src/components/store/
├── ProductCard.vue         - Карточка товара
├── ProductGrid.vue         - Сетка товаров
├── CartIcon.vue            - Иконка корзины с счетчиком
├── SearchFilter.vue        - Поиск и фильтры
├── CategoryFilter.vue      - Фильтр по категориям
└── RatingStars.vue         - Оценки товаров
```

### 2.3 Компоненты корзины и оформления
```
src/components/checkout/
├── CartSummary.vue         - Итоговая стоимость
├── ShippingSelector.vue    - Выбор доставки
├── ShippingCalculator.vue  - Калькулятор доставки
├── OrderSummary.vue        - Итоговый заказ
└── CheckoutStepper.vue     - Шаги оформления
```

### 2.4 Новые страницы (views)
```
src/views/
├── auth/
│   ├── LoginPage.vue       - Страница входа
│   ├── RegisterPage.vue    - Страница регистрации
│   └── LandingPage.vue     - Главная/лендинг
├── store/
│   ├── StorePage.vue       - Каталог магазина
│   ├── ProductDetailPage.vue - Страница товара
│   ├── CartPage.vue        - Корзина
│   └── CheckoutPage.vue    - Оформление заказа
├── customer/
│   ├── OrderSuccessPage.vue - Подтверждение
│   ├── CustomerOrdersPage.vue - Мои заказы
│   └── ProfilePage.vue     - Профиль
└── admin/
    ├── AdminLayout.vue     - Макет админ-панели
    ├── AdminDashboard.vue  - Дашборд (обновленная Dashboard.vue)
    └── (остальные как есть)
```

## 3. СИСТЕМА УПРАВЛЕНИЯ СОСТОЯНИЕМ (State Management)

### 3.1 Новые composables
```
src/composables/
├── useAuth.ts              - Управление авторизацией
│   ├── login(email, password)
│   ├── register(email, password, name)
│   ├── logout()
│   ├── getCurrentUser()
│   └── isAdmin(), isCustomer()
│
├── useCart.ts              - Управление корзиной
│   ├── addToCart(product, quantity)
│   ├── removeFromCart(productId)
│   ├── updateQuantity(productId, quantity)
│   ├── clearCart()
│   ├── getCartTotal()
│   └── getCartItems()
│
├── useShipping.ts          - Расчет доставки
│   ├── calculateShipping(items, region)
│   ├── getShippingRegions()
│   └── getShippingMethods()
│
├── useStoreProducts.ts     - Товары для магазина
│   ├── getPublishedProducts()
│   ├── getProductById(id)
│   ├── searchProducts(query)
│   └── filterByCategory(category)
│
└── useCustomerOrders.ts    - Заказы клиента
    ├── getMyOrders()
    ├── createOrder(cartItems, shippingInfo)
    └── getOrderDetails(orderId)
```

### 3.2 LocalStorage структура
```
localStorage: {
  auth: {
    currentUser: { id, email, name, role, createdAt },
    isLoggedIn: boolean,
    token: string (для демо)
  },
  cart: [
    { productId, quantity, price }
  ],
  users: [
    { id, email, password (хеш), name, role, orders: [] }
  ],
  customerOrders: [
    { id, userId, items, total, shippingAddress, date }
  ],
  storeProducts: [
    { id, name, price, category, description, image, published: true, rating, reviews }
  ]
}
```

## 4. НОВЫЕ ДАННЫЕ

### 4.1 Товары для магазина
```
Создать публичные товары из существующих inventory items:
- Выбрать те, что помечены как "опубликованы"
- Добавить: фото, описание, категорию, рейтинг, отзывы
- Разделить на категории: Сковороды, Кастрюли, Нож, Доски, Столовые приборы

Пример товара:
{
  id: "prod_001",
  name: "Классическая стальная сковорода",
  category: "Сковороды",
  price: 2500,
  oldPrice: 3500,
  image: "https://...",
  description: "Профессиональная сковорода...",
  rating: 4.5,
  reviews: 42,
  inStock: true,
  sku: "SKU-001",
  material: "Нержавеющая сталь",
  dimensions: "30x10x8 см"
}
```

### 4.2 Регионы доставки
```
Москва: 300 руб, 1-2 дня
МО: 500 руб, 2-3 дня
Санкт-Петербург: 400 руб, 2-3 дня
Регионы РФ: 1500-3000 руб, 5-10 дней
```

## 5. ЗАЩИТА И МАРШРУТЫ

### 5.1 Route Guards (защита маршрутов)
```typescript
// Административные маршруты
beforeEach((to, from, next) => {
  if (to.meta.requiresAdmin && !isAdmin()) {
    redirect to /login
  }
  if (to.meta.requiresAuth && !isLoggedIn()) {
    redirect to /login
  }
})
```

### 5.2 Роли и доступ
- **Гость** → Только просмотр магазина
- **Клиент** → Магазин + корзина + покупка + профиль
- **Админ** → Все админ-функции + может просматривать заказы

## 6. ДИЗАЙН И UI

### 6.1 Стилизация
- Использовать текущую схему цветов (синий #3b82f6)
- TailwindCSS для стилей
- Единый дизайн: магазин + админ-панель
- Адаптивный дизайн для мобильных

### 6.2 Страницы стиля

**Магазин:**
- Герой-секция с категориями
- Сетка товаров с фильтрами
- Страница товара с фото, описанием, отзывами
- Красивая корзина с итогами
- Чекаут с пошаговым процессом

**Админ-панель:**
- Сохранить текущую структуру
- Добавить управление товарами (публикация)
- Панель заказов с фильтрацией

## 7. ПОРЯДОК РЕАЛИЗАЦИИ

### Фаза 1: Аутентификация (1-2 часа)
1. Создать useAuth.ts composable
2. Создать LoginPage.vue, RegisterPage.vue
3. Создать LoginForm.vue, RegisterForm.vue
4. Добавить route guards
5. Обновить App.vue с логикой навигации

### Фаза 2: Магазин (2-3 часа)
1. Создать useStoreProducts.ts с демо-товарами
2. Создать StorePage.vue, ProductGrid.vue, ProductCard.vue
3. Создать ProductDetailPage.vue с полной информацией
4. Добавить SearchFilter.vue, CategoryFilter.vue
5. Создать RatingStars.vue для отзывов

### Фаза 3: Корзина (1-2 часа)
1. Создать useCart.ts composable
2. Создать CartIcon.vue для навбара
3. Создать CartPage.vue
4. Создать CartSummary.vue

### Фаза 4: Оформление заказа (2-3 часа)
1. Создать useShipping.ts с регионами
2. Создать ShippingCalculator.vue, ShippingSelector.vue
3. Создать CheckoutPage.vue с пошаговым процессом
4. Создать OrderSuccessPage.vue
5. Создать useCustomerOrders.ts

### Фаза 5: Профиль и мои заказы (1 час)
1. Создать ProfilePage.vue
2. Создать CustomerOrdersPage.vue
3. Добавить ссылки в навбаре

### Фаза 6: Админ-панель (1-2 часа)
1. Создать AdminLayout.vue
2. Переместить текущие маршруты в /admin/*
3. Добавить ProductManagementPage.vue (управление товарами)
4. Добавить OrderManagementPage.vue (продажи)

### Фаза 7: Полировка и тестирование (1 час)
1. Проверить все переходы
2. Добавить валидацию форм
3. Улучшить UX/UI
4. Добавить обработку ошибок

## 8. ПРИМЕР ИСПОЛЬЗОВАНИЯ

### Для покупателя:
1. Открывает https://site.com/
2. Видит форму входа или кнопку "Магазин"
3. Переходит на /store (если гость) или видит магазин сразу (если авторизирован)
4. Выбирает товары → добавляет в корзину
5. Переходит на /checkout
6. Вводит адрес доставки (выбирает регион)
7. Калькулятор считает доставку
8. Подтверждает заказ
9. Видит страницу успеха с номером заказа

### Для администратора:
1. Заходит на /admin (защищенный маршрут)
2. Видит дашборд с статистикой покупок
3. Может управлять товарами (публиковать/снимать с продажи)
4. Видит список заказов клиентов
5. Может отслеживать статус заказов

## 9. КЛЮЧЕВЫЕ ВОПРОСЫ

- Данные хранятся в localStorage (для демо)
- Пароли НЕ будут по-настоящему хешированы (демо-версия)
- Оплата - просто эмуляция (нет реального API платежей)
- Коммуникация с админом происходит через заказы

## 10. ТЕСТОВЫЕ УЧЕТНЫЕ ДАННЫЕ (после реализации)
```
Админ:
- Email: admin@posudapro.ru
- Пароль: admin123

Клиент:
- Email: customer@example.com
- Пароль: customer123
```
