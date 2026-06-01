import { create } from 'zustand'

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
  updateQuantity: (id: number, quantity: number) => void
  removeItem: (id: number) => void
  cartCount: number
}

const initialCartItems: CartItem[] = [
  {
    id: 1,
    name: '成人复合维生素营养片',
    category: '维生素',
    originalPrice: 89,
    discountedPrice: 76,
    quantity: 1,
    image: 'https://picsum.photos/seed/cart-vitamin/400/400',
    isHotPromotion: true,
  },
  {
    id: 2,
    name: '中老年钙维D营养片',
    category: '钙片',
    originalPrice: 128,
    discountedPrice: 109,
    quantity: 2,
    image: 'https://picsum.photos/seed/cart-calcium/400/400',
  },
]

const calcCartCount = (items: CartItem[]) => items.reduce((sum, item) => sum + item.quantity, 0)

export const useCartStore = create<CartState>((set) => ({
  items: initialCartItems,
  cartCount: calcCartCount(initialCartItems),
  setItems: (items) =>
    set({
      items,
      cartCount: calcCartCount(items),
    }),
  updateQuantity: (id, quantity) =>
    set((state) => {
      const items = state.items.map((item) => (item.id === id ? { ...item, quantity } : item))
      return {
        items,
        cartCount: calcCartCount(items),
      }
    }),
  removeItem: (id) =>
    set((state) => {
      const items = state.items.filter((item) => item.id !== id)
      return {
        items,
        cartCount: calcCartCount(items),
      }
    }),
}))
