import { create } from 'zustand'
import type { ProductItem } from '../utils/request'

export interface CartItem {
  id: number
  name: string
  category: string
  originalPrice: number
  discountedPrice: number
  quantity: number
  image: string
  isHotPromotion?: boolean
}

interface CartState {
  items: CartItem[]
  setItems: (items: CartItem[]) => void
  addItem: (product: ProductItem) => void
  updateQuantity: (id: number, quantity: number) => void
  removeItem: (id: number) => void
  clearCart: () => void
  cartCount: number
}

const CART_STORAGE_KEY = 'zhikang_cart_items'

const parsePrice = (value: string) => Number.parseFloat(value.replace(/[^\d.]/g, '')) || 0

const calcCartCount = (items: CartItem[]) => items.reduce((sum, item) => sum + item.quantity, 0)

const saveCart = (items: CartItem[]) => {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
}

const loadCart = (): CartItem[] => {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as CartItem[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

const initialCartItems = loadCart()

export const useCartStore = create<CartState>((set, get) => ({
  items: initialCartItems,
  cartCount: calcCartCount(initialCartItems),
  setItems: (items) => {
    saveCart(items)
    set({
      items,
      cartCount: calcCartCount(items),
    })
  },
  addItem: (product) => {
    const currentItems = get().items
    const existingItem = currentItems.find((item) => item.id === product.id)

    const nextItems = existingItem
      ? currentItems.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
      : [
          ...currentItems,
          {
            id: product.id,
            name: product.name,
            category: product.category,
            originalPrice: parsePrice(product.originalPrice),
            discountedPrice: parsePrice(product.finalPrice),
            quantity: 1,
            image: product.image,
            isHotPromotion: product.isHotPromotion,
          },
        ]

    saveCart(nextItems)
    set({
      items: nextItems,
      cartCount: calcCartCount(nextItems),
    })
  },
  updateQuantity: (id, quantity) => {
    const nextQuantity = Math.max(1, quantity)
    const items = get().items.map((item) => (item.id === id ? { ...item, quantity: nextQuantity } : item))
    saveCart(items)
    set({
      items,
      cartCount: calcCartCount(items),
    })
  },
  removeItem: (id) => {
    const items = get().items.filter((item) => item.id !== id)
    saveCart(items)
    set({
      items,
      cartCount: calcCartCount(items),
    })
  },
  clearCart: () => {
    localStorage.removeItem(CART_STORAGE_KEY)
    set({ items: [], cartCount: 0 })
  },
}))
