import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react'

import { brand, bySlug, type Product, type Review } from '../content'
import { usePersistent } from './persist'

// Cart, wishlist, orders and the reader's own reviews. All in localStorage:
// swap these setters for API calls when you connect a database.

export interface CartLine {
  slug: string
  size: string
  quantity: number
}
export interface CartItem extends CartLine {
  product: Product
  price: number
  oz: string
}
export interface Order {
  reference: string
  createdAt: string
  email: string
  name: string
  address: string
  shipping: string
  shippingCost: number
  discount: number
  subtotal: number
  total: number
  items: { slug: string; name: string; size: string; quantity: number; price: number }[]
}
export interface Toast {
  id: number
  message: string
  tone?: 'default' | 'success' | 'error'
}

interface StoreState {
  items: CartItem[]
  count: number
  subtotal: number
  add: (product: Product, size?: string, quantity?: number, openDrawer?: boolean) => void
  addMany: (products: Product[]) => void
  addOrderLines: (lines: { slug: string; size: string; quantity: number }[]) => void
  setQuantity: (slug: string, size: string, quantity: number) => void
  remove: (slug: string, size: string) => void
  clearCart: () => void
  cartOpen: boolean
  setCartOpen: (open: boolean) => void
  wishlist: string[]
  toggleWish: (slug: string) => void
  isWished: (slug: string) => boolean
  orders: Order[]
  addOrder: (order: Order) => void
  reviews: Review[]
  addReview: (review: Review) => void
  promo: string | null
  setPromo: (code: string | null) => void
  toasts: Toast[]
  toast: (message: string, tone?: Toast['tone']) => void
  dismissToast: (id: number) => void
}

const Ctx = createContext<StoreState | null>(null)
const isArray = (v: unknown): v is never[] => Array.isArray(v)
const same = (l: CartLine, slug: string, size: string) => l.slug === slug && l.size === size

export function StoreProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = usePersistent<CartLine[]>('verde-cart', [], isArray, 'dewlab-cart')
  const [wishlist, setWishlist] = usePersistent<string[]>('verde-wishlist', ['centella-facial-serum', 'daily-sheer-spf'], isArray, 'dewlab-wishlist')
  const [orders, setOrders] = usePersistent<Order[]>('verde-orders', [], isArray, 'dewlab-orders')
  const [reviews, setReviews] = usePersistent<Review[]>('verde-reviews', [], isArray, 'dewlab-reviews')
  const [promo, setPromo] = usePersistent<string | null>('verde-promo', null, undefined, 'dewlab-promo')
  const [cartOpen, setCartOpen] = useState(false)
  const [toasts, setToasts] = useState<Toast[]>([])
  const nextId = useRef(1)

  const dismissToast = useCallback((id: number) => setToasts((t) => t.filter((x) => x.id !== id)), [])
  const toast = useCallback(
    (message: string, tone: Toast['tone'] = 'default') => {
      const id = nextId.current++
      setToasts((t) => [...t.slice(-2), { id, message, tone }])
      window.setTimeout(() => dismissToast(id), 3600)
    },
    [dismissToast],
  )

  const add = useCallback(
    (product: Product, size = product.sizes[0].label, quantity = 1, openDrawer = true) => {
      setLines((prev) => {
        const hit = prev.find((l) => same(l, product.slug, size))
        if (hit) return prev.map((l) => (l === hit ? { ...l, quantity: Math.min(20, l.quantity + quantity) } : l))
        return [...prev, { slug: product.slug, size, quantity }]
      })
      if (openDrawer) setCartOpen(true)
      else toast(`${product.name} added to your bag`, 'success')
    },
    [setLines, toast],
  )
  const addMany = useCallback(
    (list: Product[]) => {
      setLines((prev) => {
        const next = [...prev]
        for (const p of list) {
          const size = p.sizes[0].label
          const i = next.findIndex((l) => same(l, p.slug, size))
          if (i >= 0) next[i] = { ...next[i], quantity: next[i].quantity + 1 }
          else next.push({ slug: p.slug, size, quantity: 1 })
        }
        return next
      })
      setCartOpen(true)
    },
    [setLines],
  )
  const addOrderLines = useCallback(
    (incoming: { slug: string; size: string; quantity: number }[]) => {
      setLines((prev) => {
        const next = [...prev]
        for (const line of incoming) {
          const i = next.findIndex((l) => same(l, line.slug, line.size))
          if (i >= 0) next[i] = { ...next[i], quantity: Math.min(20, next[i].quantity + line.quantity) }
          else next.push({ slug: line.slug, size: line.size, quantity: Math.min(20, line.quantity) })
        }
        return next
      })
      setCartOpen(true)
    },
    [setLines],
  )
  const setQuantity = useCallback(
    (slug: string, size: string, quantity: number) =>
      setLines((prev) => (quantity <= 0 ? prev.filter((l) => !same(l, slug, size)) : prev.map((l) => (same(l, slug, size) ? { ...l, quantity: Math.min(20, quantity) } : l)))),
    [setLines],
  )
  const remove = useCallback((slug: string, size: string) => setLines((prev) => prev.filter((l) => !same(l, slug, size))), [setLines])
  const clearCart = useCallback(() => setLines([]), [setLines])

  const toggleWish = useCallback(
    (slug: string) => {
      const on = wishlist.includes(slug)
      setWishlist((w) => (on ? w.filter((s) => s !== slug) : [...w.filter((s) => s !== slug), slug]))
      toast(on ? 'Removed from your wishlist' : 'Saved to your wishlist')
    },
    [wishlist, setWishlist, toast],
  )

  const addOrder = useCallback((o: Order) => setOrders((prev) => [o, ...prev]), [setOrders])
  const addReview = useCallback((r: Review) => setReviews((prev) => [r, ...prev]), [setReviews])

  const value = useMemo<StoreState>(() => {
    const items: CartItem[] = []
    for (const l of lines) {
      const product = bySlug(l.slug)
      const size = product?.sizes.find((s) => s.label === l.size)
      if (product && size) items.push({ ...l, product, price: size.price, oz: size.oz })
    }
    return {
      items,
      count: items.reduce((n, i) => n + i.quantity, 0),
      subtotal: Math.round(items.reduce((n, i) => n + i.quantity * i.price, 0) * 100) / 100,
      add,
      addMany,
      addOrderLines,
      setQuantity,
      remove,
      clearCart,
      cartOpen,
      setCartOpen,
      wishlist: wishlist.filter((s) => bySlug(s)),
      toggleWish,
      isWished: (slug) => wishlist.includes(slug),
      orders,
      addOrder,
      reviews,
      addReview,
      promo,
      setPromo,
      toasts,
      toast,
      dismissToast,
    }
  }, [lines, wishlist, orders, reviews, promo, cartOpen, toasts, add, addMany, addOrderLines, setQuantity, remove, clearCart, toggleWish, addOrder, addReview, setPromo, toast, dismissToast])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useStore(): StoreState {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useStore outside StoreProvider')
  return ctx
}

export function totals(subtotal: number, promo: string | null, shippingCost: number) {
  const discount = promo === brand.promo.code ? Math.round(subtotal * brand.promo.percent) / 100 : 0
  const ship = subtotal - discount >= brand.freeShippingFrom || subtotal === 0 ? 0 : shippingCost
  return { discount, ship, total: Math.round((subtotal - discount + ship) * 100) / 100 }
}
