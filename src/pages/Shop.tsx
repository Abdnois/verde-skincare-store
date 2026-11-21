import { Search, SlidersHorizontal } from 'lucide-react'
import { useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router'

import { ProductCard } from '../components/ProductCard'
import { Button, Chip, Container, EmptyState, Input, SectionHeading, Select } from '../components/ui'
import { categories, concerns, products, skinTypes, sortOptions, type Category, type Concern, type SkinType } from '../content'
import { useTitle } from '../lib/title'

export function Shop() {
  useTitle('Shop all products')
  const [params, setParams] = useSearchParams()
  const navigate = useNavigate()
  const clear = () => navigate({ pathname: "/shop", search: "" }, { replace: true, preventScrollReset: true })
  const category = params.get('category') as Category | null
  const concern = params.get('concern') as Concern | null
  const skin = params.get('skin') as SkinType | null
  const sort = params.get('sort') ?? 'featured'
  const q = params.get('q') ?? ''

  const set = (key: string, value: string | null) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next, { replace: true, preventScrollReset: true })
  }

  const list = useMemo(() => {
    const term = q.trim().toLowerCase()
    const out = products.filter(
      (p) =>
        (!category || p.category === category) &&
        (!concern || p.concerns.includes(concern)) &&
        (!skin || p.skinTypes.includes(skin)) &&
        (!term || `${p.name} ${p.short} ${p.ingredients.map((i) => i.name).join(' ')}`.toLowerCase().includes(term)),
    )
    if (sort === 'rating') out.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews)
    if (sort === 'price-asc') out.sort((a, b) => a.sizes[0].price - b.sizes[0].price)
    if (sort === 'price-desc') out.sort((a, b) => b.sizes[0].price - a.sizes[0].price)
    return out
  }, [category, concern, skin, sort, q])

  const filtered = !!(category || concern || skin || q)

  return (
    <Container className="mt-12">
      <SectionHeading as="h1" eyebrow={`${products.length} formulas, all made in small batches`} title="Everything we make" />

      <div className="mt-8 flex flex-col gap-4 rounded-card bg-surface p-4 shadow-card sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <label htmlFor="shop-search" className="sr-only">
              Search products or ingredients
            </label>
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden />
            <Input id="shop-search" type="search" placeholder="Search products or ingredients" value={q} onChange={(e) => set('q', e.target.value || null)} className="rounded-pill pl-11" />
          </div>
          <div className="grid grid-cols-2 gap-3 lg:w-[420px]">
            <div>
              <label htmlFor="shop-skin" className="sr-only">
                Skin type
              </label>
              <Select id="shop-skin" value={skin ?? ''} onChange={(e) => set('skin', e.target.value || null)} className="rounded-pill">
                <option value="">All skin types</option>
                {skinTypes.map((s) => (
                  <option key={s} value={s}>
                    {s} skin
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <label htmlFor="shop-sort" className="sr-only">
                Sort by
              </label>
              <Select id="shop-sort" value={sort} onChange={(e) => set('sort', e.target.value === 'featured' ? null : e.target.value)} className="rounded-pill">
                {sortOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div role="group" aria-label="Category" className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 scrollbar-none">
            <Chip selected={!category} onClick={() => set('category', null)}>
              All
            </Chip>
            {categories.map((c) => (
              <Chip key={c} selected={category === c} onClick={() => set('category', category === c ? null : c)}>
                {c}
              </Chip>
            ))}
          </div>
          <div role="group" aria-label="Concern" className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 scrollbar-none">
            {concerns.map((c) => (
              <Chip key={c} selected={concern === c} onClick={() => set('concern', concern === c ? null : c)}>
                {c}
              </Chip>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-3">
        <p className="text-[15px] text-muted" aria-live="polite">
          {list.length} {list.length === 1 ? 'product' : 'products'}
        </p>
        {filtered && (
          <Button variant="ghost" size="sm" onClick={clear}>
            Clear filters
          </Button>
        )}
      </div>

      {list.length ? (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {list.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      ) : (
        <div className="mt-4 rounded-card bg-surface shadow-card">
          <EmptyState
            icon={<SlidersHorizontal aria-hidden />}
            title="Nothing matches those filters"
            body="Try a different concern or skin type, or clear the filters to see everything."
            action={<Button onClick={clear}>Clear filters</Button>}
          />
        </div>
      )}
    </Container>
  )
}
