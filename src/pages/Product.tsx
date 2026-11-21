import { Heart, PackageCheck, RotateCcw, ShoppingBag, Truck } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { useParams } from 'react-router'

import { Avatar } from '../components/Art'
import { ProductCard } from '../components/ProductCard'
import { ProductArt } from '../components/ProductArt'
import { Accordion, Alert, Badge, Breadcrumbs, Button, Card, Chip, Container, Field, Input, RatingInput, SectionHeading, Select, Stars, Stepper, Textarea } from '../components/ui'
import { brand, bySlug, products, seedReviews, skinTypes, type Review, type SkinType } from '../content'
import { fieldErrors, postJson, type FieldErrors } from '../lib/api'
import { money } from '../lib/money'
import { useStore } from '../lib/store'
import { useTitle } from '../lib/title'
import { NotFound } from './NotFound'

export function ProductPage() {
  const { slug = '' } = useParams()
  const product = bySlug(slug)
  return product ? <ProductView key={product.slug} slug={product.slug} /> : <NotFound />
}

function ProductView({ slug }: { slug: string }) {
  const product = bySlug(slug)!
  useTitle(product.name)
  const { add, toggleWish, isWished, reviews } = useStore()
  const [size, setSize] = useState(product.sizes[0].label)
  const [quantity, setQuantity] = useState(1)
  const chosen = product.sizes.find((s) => s.label === size)!
  const wished = isWished(product.slug)
  const all = [...reviews.filter((r) => r.product === slug), ...seedReviews.filter((r) => r.product === slug)]
  const pairs = products.filter((p) => p.slug !== slug && p.step !== product.step && p.concerns.some((c) => product.concerns.includes(c))).slice(0, 4)

  return (
    <>
      <Container className="mt-6">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Products', to: '/shop' }, { label: product.category, to: `/shop?category=${product.category}` }, { label: product.name }]} />
        <div className="mt-4 grid gap-6 lg:grid-cols-[1.15fr_1fr] lg:gap-12">
          <div className="hero-wall relative aspect-square overflow-hidden rounded-panel shadow-card lg:sticky lg:top-6 lg:aspect-auto lg:h-[680px]">
            <div className="absolute inset-[14%] animate-float">
              <ProductArt product={product} />
            </div>
            {product.badge && (
              <Badge tone="dark" className="absolute left-6 top-6">
                {product.badge}
              </Badge>
            )}
          </div>

          <div className="pb-4">
            <p className="text-[14px] font-medium text-muted">
              Step {product.step} / {product.category}
            </p>
            <h1 className="mt-2 text-balance text-[38px] font-semibold leading-[1.02] tracking-[-0.035em] sm:text-[52px]">{product.name}</h1>
            <a href="#reviews" className="mt-4 inline-flex min-h-10 items-center gap-2 text-[15px] text-muted hover:text-ink">
              <Stars value={product.rating} />
              <span className="tabular-nums">
                {product.rating.toFixed(1)} from {(product.reviews + reviews.filter((r) => r.product === slug).length).toLocaleString('en-US')} reviews
              </span>
            </a>
            <p className="mt-4 text-pretty text-[18px] leading-relaxed text-ink-2">{product.description}</p>

            <div className="mt-6 flex flex-wrap gap-2">
              {product.concerns.map((c) => (
                <Badge key={c}>{c}</Badge>
              ))}
            </div>

            <fieldset className="mt-8">
              <legend className="mb-3 text-[14px] font-medium text-ink-2">Size</legend>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <Chip key={s.label} selected={size === s.label} onClick={() => setSize(s.label)} className="h-12 px-5">
                    {s.label} / {s.oz}
                  </Chip>
                ))}
              </div>
            </fieldset>

            <div className="mt-8 flex items-baseline gap-3">
              <p className="text-[36px] font-semibold tracking-[-0.03em] tabular-nums">{money(chosen.price)}</p>
              <p className="text-[14px] text-muted">or 4 payments of {money(Math.round((chosen.price / 4) * 100) / 100)}</p>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Stepper label="Quantity" value={quantity} onChange={setQuantity} />
              <Button size="md" className="min-w-0 flex-1" onClick={() => add(product, size, quantity)}>
                <ShoppingBag aria-hidden /> Add to bag
              </Button>
              <Button variant="secondary" size="md" aria-pressed={wished} onClick={() => toggleWish(product.slug)} className="px-4" aria-label={wished ? 'Remove from wishlist' : 'Save to wishlist'}>
                <Heart className={wished ? 'fill-ink' : ''} aria-hidden />
              </Button>
            </div>

            <ul className="mt-6 grid gap-2 text-[14px] text-ink-2 sm:grid-cols-3">
              <li className="flex items-center gap-2 rounded-field bg-surface px-4 py-3">
                <Truck className="size-4 shrink-0" aria-hidden /> Free over {money(brand.freeShippingFrom)}
              </li>
              <li className="flex items-center gap-2 rounded-field bg-surface px-4 py-3">
                <RotateCcw className="size-4 shrink-0" aria-hidden /> 60-night trial
              </li>
              <li className="flex items-center gap-2 rounded-field bg-surface px-4 py-3">
                <PackageCheck className="size-4 shrink-0" aria-hidden /> Ships in 1 day
              </li>
            </ul>

            <div className="mt-8">
              <Accordion
                defaultOpen={0}
                items={[
                  {
                    q: 'Key ingredients',
                    a: (
                      <ul className="space-y-3">
                        {product.ingredients.map((i) => (
                          <li key={i.name}>
                            <span className="font-medium text-ink">{i.name}</span>
                            <span className="block">{i.role}</span>
                          </li>
                        ))}
                      </ul>
                    ),
                  },
                  { q: 'How to use', a: product.howTo },
                  { q: 'Full ingredient list', a: product.fullIngredients },
                  { q: 'Suits', a: `${product.skinTypes.join(', ')} skin.` },
                ]}
              />
            </div>
          </div>
        </div>
      </Container>

      <Reviews slug={slug} name={product.name} rating={product.rating} list={all} />

      {pairs.length > 0 && (
        <Container className="mt-24">
          <SectionHeading eyebrow="Complete the routine" title="Pairs well with" />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {pairs.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </Container>
      )}
    </>
  )
}

function Reviews({ slug, name, rating, list }: { slug: string; name: string; rating: number; list: Review[] }) {
  const [writing, setWriting] = useState(false)
  return (
    <Container className="mt-24">
      <section id="reviews" aria-labelledby="reviews-title" className="scroll-mt-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="mb-3 text-[14px] font-medium text-muted">Reviews</p>
            <h2 id="reviews-title" className="text-[34px] font-medium leading-[1.05] tracking-[-0.03em] sm:text-[48px]">
              {rating.toFixed(1)} out of 5
            </h2>
            <Stars value={rating} size={18} className="mt-3" />
          </div>
          {!writing && (
            <Button variant="secondary" onClick={() => setWriting(true)}>
              Write a review
            </Button>
          )}
        </div>
        {writing && <ReviewForm slug={slug} name={name} onDone={() => setWriting(false)} />}
        {list.length ? (
          <ul className="mt-8 grid gap-4 lg:grid-cols-2">
            {list.map((r) => (
              <li key={r.id}>
                <Card as="article" className="h-full p-6 sm:p-8">
                  <div className="flex items-center justify-between gap-4">
                    <Stars value={r.rating} />
                    <time dateTime={r.date} className="text-[13px] text-muted">
                      {new Date(r.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </time>
                  </div>
                  <h3 className="mt-4 text-[19px] font-medium tracking-[-0.01em]">{r.title}</h3>
                  <p className="mt-2 text-pretty leading-relaxed text-ink-2">{r.body}</p>
                  <div className="mt-5 flex items-center gap-3">
                    <Avatar index={r.avatar ?? r.name.length % 4} size={36} ring={false} />
                    <p className="text-[14px]">
                      <span className="font-medium">{r.name}</span>
                      <span className="text-muted"> / {r.skinType} skin</span>
                    </p>
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-8 rounded-card bg-surface p-8 text-muted shadow-card">No written reviews yet. Be the first to share how it went.</p>
        )}
      </section>
    </Container>
  )
}

function ReviewForm({ slug, name, onDone }: { slug: string; name: string; onDone: () => void }) {
  const { addReview, toast } = useStore()
  const [form, setForm] = useState({ rating: 0, name: '', title: '', body: '', skinType: 'Normal' as SkinType })
  const [errors, setErrors] = useState<FieldErrors>({})
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => {
    setForm((f) => ({ ...f, [k]: v }))
    setErrors((e) => ({ ...e, [k]: '' }))
  }
  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await postJson('/api/reviews', { ...form, product: slug })
      addReview({ id: `u-${Date.now()}`, product: slug, ...form, date: new Date().toISOString().slice(0, 10) })
      toast('Thanks, your review is live', 'success')
      onDone()
    } catch (err) {
      setErrors(fieldErrors(err))
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }
  return (
    <Card as="section" className="mt-8 p-6 sm:p-8">
      <h3 className="text-[22px] font-medium tracking-[-0.02em]">Review {name}</h3>
      <form onSubmit={submit} noValidate className="mt-6 grid gap-5 sm:grid-cols-2">
        <Field label="Your rating" error={errors.rating} className="sm:col-span-2">
          {(p) => <RatingInput id={p.id} value={form.rating} onChange={(v) => set('rating', v)} invalid={!!errors.rating} />}
        </Field>
        <Field label="Name to show" error={errors.name}>
          {(p) => <Input {...p} autoComplete="given-name" value={form.name} invalid={!!errors.name} onChange={(e) => set('name', e.target.value)} />}
        </Field>
        <Field label="Skin type">
          {(p) => (
            <Select {...p} value={form.skinType} onChange={(e) => set('skinType', e.target.value as SkinType)}>
              {skinTypes.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </Select>
          )}
        </Field>
        <Field label="Title" error={errors.title} className="sm:col-span-2">
          {(p) => <Input {...p} value={form.title} invalid={!!errors.title} onChange={(e) => set('title', e.target.value)} placeholder="Sum it up in a few words" />}
        </Field>
        <Field label="Your review" error={errors.body} hint="At least 20 characters." className="sm:col-span-2">
          {(p) => <Textarea {...p} value={form.body} invalid={!!errors.body} onChange={(e) => set('body', e.target.value)} placeholder="How did your skin feel after a week or two?" />}
        </Field>
        {error && (
          <div className="sm:col-span-2">
            <Alert>{error}</Alert>
          </div>
        )}
        <div className="flex gap-3 sm:col-span-2">
          <Button type="submit" loading={loading}>
            Post review
          </Button>
          <Button variant="ghost" onClick={onDone}>
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  )
}
