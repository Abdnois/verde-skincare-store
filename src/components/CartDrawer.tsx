import { ShoppingBag, Trash2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router'

import { brand, bySlug, hero } from '../content'
import { money } from '../lib/money'
import { useStore } from '../lib/store'
import { Drawer } from './Drawer'
import { ProductArt } from './ProductArt'
import { Button, ButtonLink, EmptyState, IconButton, Stepper } from './ui'

export function CartDrawer() {
  const { cartOpen, setCartOpen, items, subtotal, count } = useStore()
  const navigate = useNavigate()
  const left = Math.max(0, brand.freeShippingFrom - subtotal)
  const close = () => setCartOpen(false)
  return (
    <Drawer
      open={cartOpen}
      onClose={close}
      title={count ? `Your bag (${count})` : 'Your bag'}
      footer={
        items.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-baseline justify-between">
              <span className="text-muted">Subtotal</span>
              <span className="text-[22px] font-semibold tracking-[-0.02em] tabular-nums">{money(subtotal)}</span>
            </div>
            <Button
              size="lg"
              className="w-full"
              onClick={() => {
                close()
                navigate('/checkout')
              }}
            >
              Checkout
            </Button>
          </div>
        )
      }
    >
      {items.length === 0 ? (
        <EmptyState
          icon={<ShoppingBag aria-hidden />}
          title="Your bag is empty"
          body="Start with the serum most people come back for, or let the quiz build a routine for you."
          action={
            <div className="flex flex-wrap justify-center gap-3">
              <ButtonLink to={`/product/${hero.cards[2]}`} onClick={close}>
                See the serum
              </ButtonLink>
              <ButtonLink to="/quiz" variant="secondary" onClick={close}>
                Take the quiz
              </ButtonLink>
            </div>
          }
        />
      ) : (
        <div className="space-y-5">
          <div className="rounded-field bg-surface px-4 py-3 text-[14px]">
            {left > 0 ? (
              <>
                Add <strong className="font-semibold">{money(left)}</strong> more for free shipping.
              </>
            ) : (
              <>You have free shipping.</>
            )}
            <div className="mt-2 h-1.5 overflow-hidden rounded-pill bg-surface-2">
              <div className="h-full rounded-pill bg-amber transition-[width] duration-500" style={{ width: `${Math.min(100, (subtotal / brand.freeShippingFrom) * 100)}%` }} />
            </div>
          </div>
          <ul className="space-y-3">
            {items.map((item) => (
              <CartLineRow key={`${item.slug}-${item.size}`} slug={item.slug} size={item.size} onNavigate={close} />
            ))}
          </ul>
        </div>
      )}
    </Drawer>
  )
}

export function CartLineRow({ slug, size, onNavigate }: { slug: string; size: string; onNavigate?: () => void }) {
  const { items, setQuantity, remove } = useStore()
  const item = items.find((i) => i.slug === slug && i.size === size)
  const product = bySlug(slug)
  if (!item || !product) return null
  return (
    <li className="flex gap-4 rounded-[24px] bg-surface p-3">
      <Link to={`/product/${slug}`} onClick={onNavigate} className="grid size-[84px] shrink-0 place-items-center rounded-[18px] bg-surface-2 p-2" aria-label={product.name}>
        <ProductArt product={product} />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link to={`/product/${slug}`} onClick={onNavigate} className="line-clamp-2 font-medium leading-snug hover:underline">
              {product.name}
            </Link>
            <p className="text-[13px] text-muted">
              {item.size} / {item.oz}
            </p>
          </div>
          <IconButton label={`Remove ${product.name}`} tone="plain" size="sm" className="-mr-1 -mt-1 text-muted" onClick={() => remove(slug, size)}>
            <Trash2 aria-hidden />
          </IconButton>
        </div>
        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <Stepper size="sm" label={`${product.name} quantity`} value={item.quantity} onChange={(q) => setQuantity(slug, size, q)} />
          <span className="font-semibold tabular-nums">{money(item.price * item.quantity)}</span>
        </div>
      </div>
    </li>
  )
}
