import { ref } from 'vue'

export interface ShippingRegion {
  id: string
  name: string
  cost: number
  deliveryDays: string
  description: string
}

export interface ShippingMethod {
  id: string
  name: string
  cost: number
  deliveryDays: string
}

// Shipping regions in Tajikistan
export const SHIPPING_REGIONS: ShippingRegion[] = [
  {
    id: 'dushanbe',
    name: 'Душанбе (столица)',
    cost: 50,
    deliveryDays: '1-2 дня',
    description: 'Доставка в столицу Республики Таджикистан',
  },
  {
    id: 'khujand',
    name: 'Худжанд (Согдская область)',
    cost: 100,
    deliveryDays: '2-3 дня',
    description: 'Доставка в Худжанд и прилегающие районы Согдской области',
  },
  {
    id: 'tursunzade',
    name: 'Турсунзаде',
    cost: 80,
    deliveryDays: '1-2 дня',
    description: 'Доставка в город Турсунзаде и окрестности',
  },
  {
    id: 'khorog',
    name: 'Хорог (ГБАО)',
    cost: 200,
    deliveryDays: '4-5 дней',
    description: 'Доставка в Горно-Бадахшанскую автономную область',
  },
  {
    id: 'khatlon',
    name: 'Хатлонская область',
    cost: 120,
    deliveryDays: '2-3 дня',
    description: 'Доставка в города и районы Хатлонской области',
  },
  {
    id: 'rpc',
    name: 'РПЦ (Регионы подчиняющиеся центру)',
    cost: 150,
    deliveryDays: '3-4 дня',
    description: 'Доставка в регионы, подчиняющиеся центру',
  },
]

// Shipping methods
export const SHIPPING_METHODS: ShippingMethod[] = [
  {
    id: 'standard',
    name: 'Стандартная доставка',
    cost: 0,
    deliveryDays: 'По региону',
  },
  {
    id: 'express',
    name: 'Срочная доставка',
    cost: 100,
    deliveryDays: 'В тот же день (для Душанбе)',
  },
]

const selectedRegion = ref<ShippingRegion | null>(null)
const selectedMethod = ref<ShippingMethod>(SHIPPING_METHODS[0])

// Get all regions
function getShippingRegions(): ShippingRegion[] {
  return SHIPPING_REGIONS
}

// Get region by ID
function getRegionById(id: string): ShippingRegion | undefined {
  return SHIPPING_REGIONS.find((r) => r.id === id)
}

// Select region
function selectRegion(region: ShippingRegion) {
  selectedRegion.value = region
}

// Get selected region
function getSelectedRegion(): ShippingRegion | null {
  return selectedRegion.value
}

// Get shipping cost
function getShippingCost(): number {
  if (!selectedRegion.value) return 0

  let cost = selectedRegion.value.cost

  // Add express delivery cost if selected
  if (selectedMethod.value.id === 'express') {
    cost += selectedMethod.value.cost
  }

  return cost
}

// Calculate total with shipping
function calculateTotal(subtotal: number): number {
  return subtotal + getShippingCost()
}

// Get delivery estimate
function getDeliveryEstimate(): string {
  if (!selectedRegion.value) return 'Выберите регион'
  return selectedRegion.value.deliveryDays
}

// Validate shipping info
function validateShippingInfo(address: {
  name: string
  phone: string
  address: string
  regionId: string
}): { valid: boolean; error?: string } {
  if (!address.name || address.name.trim() === '') {
    return { valid: false, error: 'Введите полное имя' }
  }

  if (!address.phone || address.phone.trim() === '') {
    return { valid: false, error: 'Введите номер телефона' }
  }

  if (!address.address || address.address.trim() === '') {
    return { valid: false, error: 'Введите адрес доставки' }
  }

  if (!address.regionId) {
    return { valid: false, error: 'Выберите регион доставки' }
  }

  return { valid: true }
}

export function useShipping() {
  return {
    // State
    selectedRegion,
    selectedMethod,

    // Methods
    getShippingRegions,
    getRegionById,
    selectRegion,
    getSelectedRegion,
    getShippingCost,
    calculateTotal,
    getDeliveryEstimate,
    validateShippingInfo,
  }
}
