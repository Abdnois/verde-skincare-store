import { Heart, ShoppingBag } from 'lucide-react'
import { Link } from 'react-router'

import type { Product } from '../content'
import { cx } from '../lib/cx'
import { money } from '../lib/money'
import { useStore } from '../lib/store'
import { ProductArt } from './ProductArt'
import { Badge, Button, IconButton, Stars } from './ui'

/** The white floating card from the hero: packshot, price, name, size, Add. */
export function ProductCardCompact({ product, className, force }: { product: Product; className?: string; force?: string }) {
  const { add } = useStore()
  const size = product.sizes[0]
  return (
    <article data-force={force} className={cx('group relative flex flex-col rounded-card bg-surface border border-line-strong/80 p-4 pt-3 shadow-card transition-[transform,box-shadow,border-color] duration-300 ease-[var(--ease-soft)] hover:-translate-y-1 hover:shadow-float hover:border-faint data-[force~=hover]:-translate-y-1 data-[force~=hover]:shadow-float data-[force~=hover]:border-faint', className)}>
      <div className="mx-auto h-[122px] w-[132px] overflow-hidden rounded-[20px] bg-[rgba(206,211,192,0.34)] ring-1 ring-white/40 transition-transform duration-500 ease-[var(--ease-soft)] group-hover:scale-105 group-data-[force~=hover]:scale-105">
        <ProductArt product={product} />
      </div>
      <p className="mt-3.5 text-[24px] font-semibold leading-none tracking-[-0.02em] tabular-nums">{money(size.price)}</p>
      <h3 className="mt-2.5 text-[16px] font-medium leading-[1.25] tracking-[-0.01em] group-hover:text-ink-2 group-data-[force~=hover]:text-ink-2">
        <Link to={`/product/${product.slug}`} className="line-clamp-2 after:absolute after:inset-0 after:rounded-card after:content-['']">
          {product.name}
        </Link>
      </h3>
      <div className="mt-auto flex items-end justify-between gap-2 pt-3">
        <p className="text-[12px] leading-[1.3] text-muted">
          {size.label} /
          <br />
          {size.oz}
        </p>
        <Button size="sm" className="relative z-10" onClick={() => add(product)} aria-label={`Add ${product.name} to bag`}>
          Add
        </Button>
      </div>
    </article>
  )
}

/** Catalogue card: bigger packshot, rating, wishlist heart and add to bag. */
export function ProductCard({ product, className, force }: { product: Product; className?: string; force?: string }) {
  const { add, toggleWish, isWished } = useStore()
  const wished = isWished(product.slug)
  const size = product.sizes[0]
  return (
    <article data-force={force} className={cx('group relative flex flex-col rounded-card bg-surface border border-line-strong/80 p-3 shadow-card transition-[transform,box-shadow,border-color] duration-300 ease-[var(--ease-soft)] hover:-translate-y-1 hover:shadow-float hover:border-faint data-[force~=hover]:-translate-y-1 data-[force~=hover]:shadow-float data-[force~=hover]:border-faint', className)}>
      <div className="relative aspect-[5/4] overflow-hidden rounded-[22px] bg-[rgba(206,211,192,0.30)] ring-1 ring-white/40 transition-transform duration-500 ease-[var(--ease-soft)] group-hover:scale-[1.02] group-data-[force~=hover]:scale-[1.02]">
        <div className="absolute inset-[10%]">
          <ProductArt product={product} />
        </div>
        {product.badge && (
          <Badge tone="dark" className="absolute left-3 top-3">
            {product.badge}
          </Badge>
        )}
        <IconButton
          label={wished ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
          aria-pressed={wished}
          size="sm"
          className="absolute right-3 top-3 z-10 bg-white/70"
          onClick={() => toggleWish(product.slug)}
        >
          <Heart className={wished ? 'fill-ink' : ''} aria-hidden />
        </IconButton>
      </div>
      <div className="flex flex-1 flex-col px-2 pb-1 pt-4">
        <div className="flex items-center gap-2 text-[13px] text-muted">
          <Stars value={product.rating} size={13} />
          <span className="tabular-nums">
            {product.rating.toFixed(1)} ({product.reviews.toLocaleString('en-US')})
          </span>
        </div>
        <h3 className="mt-2.5 text-[17px] font-medium leading-snug tracking-[-0.01em] group-hover:text-ink-2 group-data-[force~=hover]:text-ink-2">
          <Link to={`/product/${product.slug}`} className="after:absolute after:inset-0 after:rounded-card after:content-['']">
            {product.name}
          </Link>
        </h3>
        <p className="mt-1.5 line-clamp-2 text-[14px] leading-relaxed text-muted">{product.short}</p>
        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          <p className="text-[20px] font-semibold tracking-[-0.02em] tabular-nums">
            {money(size.price)}
            <span className="ml-2 text-[13px] font-normal text-muted">{size.label}</span>
          </p>
          <IconButton label={`Add ${product.name} to bag`} tone="dark" size="sm" className="z-10" onClick={() => add(product)}>
            <ShoppingBag aria-hidden />
          </IconButton>
        </div>
      </div>
    </article>
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="rounded-card bg-surface p-3 shadow-card" aria-hidden>
      <div className="skeleton aspect-[5/4] rounded-[22px]" />
      <div className="space-y-3 px-2 pb-2 pt-4">
        <div className="skeleton h-3 w-24 rounded-pill" />
        <div className="skeleton h-5 w-4/5 rounded-pill" />
        <div className="skeleton h-3 w-full rounded-pill" />
        <div className="skeleton h-6 w-20 rounded-pill" />
      </div>
    </div>
  )
}
