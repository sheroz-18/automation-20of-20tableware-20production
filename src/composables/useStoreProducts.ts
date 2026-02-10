import { ref, computed } from 'vue'

export interface Product {
  id: string
  name: string
  category: string
  price: number
  oldPrice?: number
  description: string
  longDescription: string
  image: string
  inStock: boolean
  sku: string
  material: string
  dimensions: string
  weight: number
  rating: number
  reviewCount: number
  published: boolean
}

// Demo products
const DEMO_PRODUCTS: Product[] = [
  {
    id: 'prod_001',
    name: 'Классическая стальная сковорода',
    category: 'Сковороды',
    price: 2500,
    oldPrice: 3500,
    description: 'Профессиональная сковорода из нержавеющей стали',
    longDescription:
      'Высокопроизводительная сковорода, изготовленная из прочной нержавеющей стали. Отлично подходит как для домашнего, так и для профессионального использования. Равномерное распределение тепла обеспечивает идеальное приготовление пищи.',
    image: 'https://images.unsplash.com/photo-1593618998160-e34014e67546?w=400&h=400&fit=crop',
    inStock: true,
    sku: 'SKU-001',
    material: 'Нержавеющая сталь 18/10',
    dimensions: '30x10x8 см',
    weight: 1.2,
    rating: 4.8,
    reviewCount: 156,
    published: true,
  },
  {
    id: 'prod_002',
    name: 'Кастрюля с крышкой 5L',
    category: 'Кастрюли',
    price: 3200,
    oldPrice: 4500,
    description: 'Вместительная кастрюля с герметичной крышкой',
    longDescription:
      'Идеальна для приготовления супов, блюд и других продуктов, требующих длительного варения. Прочная конструкция и удобные ручки обеспечивают комфортное использование.',
    image: 'https://images.unsplash.com/photo-1590080876614-98f1855a195d?w=400&h=400&fit=crop',
    inStock: true,
    sku: 'SKU-002',
    material: 'Алюминий с тефлоновым покрытием',
    dimensions: '24x15x14 см',
    weight: 1.8,
    rating: 4.6,
    reviewCount: 89,
    published: true,
  },
  {
    id: 'prod_003',
    name: 'Набор кухонных ножей (6 штук)',
    category: 'Ножи',
    price: 4200,
    description: 'Профессиональный набор острых кухонных ножей',
    longDescription:
      'Набор включает ножи для различных кулинарных задач: шефа, для чистки, для нарезания. Изготовлены из высокоуглеродистой стали с удобными эргономичными ручками.',
    image: 'https://images.unsplash.com/photo-1593618898657-79a53ba1b2b5?w=400&h=400&fit=crop',
    inStock: true,
    sku: 'SKU-003',
    material: 'Высокоуглеродистая сталь',
    dimensions: 'Различные',
    weight: 0.8,
    rating: 4.9,
    reviewCount: 234,
    published: true,
  },
  {
    id: 'prod_004',
    name: 'Деревянная разделочная доска',
    category: 'Доски',
    price: 1800,
    description: 'Натуральная бамбуковая разделочная доска',
    longDescription:
      'Экологичная разделочная доска из натурального бамбука. Мягкая поверхность предотвращает повреждение ножей. Легко моется и долговечна.',
    image: 'https://images.unsplash.com/photo-1599599810694-b5ac4dd37e2b?w=400&h=400&fit=crop',
    inStock: true,
    sku: 'SKU-004',
    material: 'Натуральный бамбук',
    dimensions: '40x30x2 см',
    weight: 0.6,
    rating: 4.5,
    reviewCount: 78,
    published: true,
  },
  {
    id: 'prod_005',
    name: 'Столовые приборы из нержавеющей стали',
    category: 'Столовые приборы',
    price: 1500,
    oldPrice: 2000,
    description: 'Элегантный набор столовых приборов на 6 персон',
    longDescription:
      'Набор включает вилки, ножи и ложки из высокого качества нержавеющей стали. Универсальный дизайн подходит для любого интерьера кухни.',
    image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=400&h=400&fit=crop',
    inStock: true,
    sku: 'SKU-005',
    material: 'Нержавеющая сталь 18/10',
    dimensions: 'Стандартные',
    weight: 0.5,
    rating: 4.4,
    reviewCount: 120,
    published: true,
  },
  {
    id: 'prod_006',
    name: 'Чугунная сковорода премиум',
    category: 'Сковороды',
    price: 5500,
    description: 'Традиционная чугунная сковорода для идеального результата',
    longDescription:
      'Тяжелая чугунная сковорода, которая нагревается равномерно и сохраняет температуру. Идеальна для жарки мяса, овощей и других блюд. Может использоваться на любом типе плиты и в духовке.',
    image: 'https://images.unsplash.com/photo-1599599810694-b5ac4dd37e2b?w=400&h=400&fit=crop',
    inStock: true,
    sku: 'SKU-006',
    material: 'Чугун',
    dimensions: '28x6x10 см',
    weight: 2.5,
    rating: 4.7,
    reviewCount: 95,
    published: true,
  },
  {
    id: 'prod_007',
    name: 'Стеклянная посуда для микроволновки',
    category: 'Посуда',
    price: 900,
    description: 'Набор стеклянных контейнеров для хранения и разогрева',
    longDescription:
      'Три контейнера различных размеров с герметичными крышками. Безопасны для микроволновки, посудомоечной машины и морозильника. Не впитывают запахи и легко моются.',
    image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=400&h=400&fit=crop',
    inStock: true,
    sku: 'SKU-007',
    material: 'Боросиликатное стекло',
    dimensions: 'Различные',
    weight: 0.9,
    rating: 4.3,
    reviewCount: 67,
    published: true,
  },
  {
    id: 'prod_008',
    name: 'Кухонный скребок силиконовый',
    category: 'Аксессуары',
    price: 350,
    description: 'Мягкий силиконовый скребок для посуды',
    longDescription:
      'Универсальный скребок из пищевого силикона. Не повреждает антипригарное покрытие. Удобная ручка с отверстием для хранения на крюке.',
    image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=400&h=400&fit=crop',
    inStock: true,
    sku: 'SKU-008',
    material: 'Пищевой силикон',
    dimensions: '7x4x10 см',
    weight: 0.05,
    rating: 4.2,
    reviewCount: 45,
    published: true,
  },
  {
    id: 'prod_009',
    name: 'Кастрюля антипригарная 3L',
    category: 'Кастрюли',
    price: 2800,
    description: 'Удобная кастрюля с антипригарным покрытием',
    longDescription:
      'Легкая и удобная кастрюля с высокопрочным антипригарным покрытием. Подходит для всех видов плит. Поставляется с герметичной крышкой.',
    image: 'https://images.unsplash.com/photo-1590080876614-98f1855a195d?w=400&h=400&fit=crop',
    inStock: true,
    sku: 'SKU-009',
    material: 'Алюминий',
    dimensions: '22x13x12 см',
    weight: 0.8,
    rating: 4.6,
    reviewCount: 102,
    published: true,
  },
  {
    id: 'prod_010',
    name: 'Овощерезка многофункциональная',
    category: 'Аксессуары',
    price: 1200,
    description: 'Многофункциональная овощерезка с несколькими насадками',
    longDescription:
      'Удобный инструмент для нарезания, натирания и шинкования овощей и фруктов. Включает 4 различные насадки. Безопасная конструкция с защитой для рук.',
    image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=400&h=400&fit=crop',
    inStock: true,
    sku: 'SKU-010',
    material: 'Нержавеющая сталь',
    dimensions: '15x10x5 см',
    weight: 0.3,
    rating: 4.5,
    reviewCount: 87,
    published: true,
  },
]

const products = ref<Product[]>(loadProducts())

function loadProducts() {
  const stored = localStorage.getItem('storeProducts')
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch (e) {
      saveProducts(DEMO_PRODUCTS)
      return [...DEMO_PRODUCTS]
    }
  }
  saveProducts(DEMO_PRODUCTS)
  return [...DEMO_PRODUCTS]
}

function saveProducts(prods: Product[]) {
  localStorage.setItem('storeProducts', JSON.stringify(prods))
}

// Get all published products
function getPublishedProducts(): Product[] {
  return products.value.filter((p) => p.published)
}

// Get product by ID
function getProductById(id: string): Product | undefined {
  return products.value.find((p) => p.id === id)
}

// Search products
function searchProducts(query: string): Product[] {
  const q = query.toLowerCase()
  return getPublishedProducts().filter(
    (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q),
  )
}

// Get products by category
function getProductsByCategory(category: string): Product[] {
  if (!category) return getPublishedProducts()
  return getPublishedProducts().filter((p) => p.category === category)
}

// Get all unique categories
function getCategories(): string[] {
  const categories = new Set(products.value.map((p) => p.category))
  return Array.from(categories).sort()
}

// Get featured products (highest rated)
function getFeaturedProducts(limit: number = 4): Product[] {
  return getPublishedProducts()
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit)
}

// Update product
function updateProduct(id: string, updates: Partial<Product>) {
  const index = products.value.findIndex((p) => p.id === id)
  if (index !== -1) {
    products.value[index] = { ...products.value[index], ...updates }
    saveProducts(products.value)
  }
}

// Toggle product published status
function toggleProductPublished(id: string) {
  const product = getProductById(id)
  if (product) {
    product.published = !product.published
    saveProducts(products.value)
  }
}

export function useStoreProducts() {
  return {
    // State
    products: computed(() => products.value),

    // Methods
    getPublishedProducts,
    getProductById,
    searchProducts,
    getProductsByCategory,
    getCategories,
    getFeaturedProducts,
    updateProduct,
    toggleProductPublished,
  }
}

// Re-export types
export type { Product }
