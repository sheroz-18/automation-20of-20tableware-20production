import { ref, computed } from 'vue'
import { Product } from './useStoreProducts'

export interface CartItem {
  productId: string
  name: string
  price: number
  quantity: number
  image: string
}

const cartItems = ref<CartItem[]>(loadCart())

function loadCart(): CartItem[] {
  const stored = localStorage.getItem('cart')
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch (e) {
      return []
    }
  }
  return []
}

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cartItems.value))
}

// Add product to cart
function addToCart(product: Product, quantity: number = 1) {
  if (quantity <= 0) return

  const existingItem = cartItems.value.find((item) => item.productId === product.id)

  if (existingItem) {
    existingItem.quantity += quantity
  } else {
    cartItems.value.push({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.image,
    })
  }

  saveCart()
}

// Remove product from cart
function removeFromCart(productId: string) {
  const index = cartItems.value.findIndex((item) => item.productId === productId)
  if (index !== -1) {
    cartItems.value.splice(index, 1)
    saveCart()
  }
}

// Update quantity
function updateQuantity(productId: string, quantity: number) {
  if (quantity <= 0) {
    removeFromCart(productId)
    return
  }

  const item = cartItems.value.find((i) => i.productId === productId)
  if (item) {
    item.quantity = quantity
    saveCart()
  }
}

// Clear cart
function clearCart() {
  cartItems.value = []
  saveCart()
}

// Get cart total
function getCartTotal(): number {
  return cartItems.value.reduce((total, item) => total + item.price * item.quantity, 0)
}

// Get item count
function getItemCount(): number {
  return cartItems.value.reduce((count, item) => count + item.quantity, 0)
}

// Get cart items
function getCartItems(): CartItem[] {
  return cartItems.value
}

export function useCart() {
  return {
    // State
    items: computed(() => cartItems.value),
    itemCount: computed(() => getItemCount()),
    total: computed(() => getCartTotal()),

    // Methods
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getItemCount,
    getCartItems,
  }
}
