import { Lock, ShoppingBag, Tag } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router'

import { ProductArt } from '../components/ProductArt'
import { Alert, Breadcrumbs, Button, ButtonLink, Card, Container, EmptyState, Field, Input, OptionCard, Select } from '../components/ui'
import { brand, shipping } from '../content'
import { fieldErrors, postJson, type FieldErrors } from '../lib/api'
import { money } from '../lib/money'
import { totals, useStore, type Order } from '../lib/store'
import { useTitle } from '../lib/title'

const countries = ['United States', 'Canada', 'United Kingdom', 'Australia', 'Bangladesh']

export function Checkout() {
  useTitle('Checkout')
  const { items, subtotal, promo, setPromo, addOrder, clearCart } = useStore()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', name: '', address: '', city: '', postcode: '', country: countries[0], shipping: 'standard' })
  const [errors, setErrors] = useState<FieldErrors>({})
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [code, setCode] = useState(promo ?? '')
  const [codeError, setCodeError] = useState('')
  const method = shipping.find((s) => s.id === form.shipping)!
  const t = totals(subtotal, promo, method.price)

  const set = (k: keyof typeof form, v: string) => {
    setForm((f) => ({ ...f, [k]: v }))
    if (errors[k]) setErrors((e) => ({ ...e, [k]: '' }))
  }

  const applyCode = () => {
    if (code.trim().toUpperCase() === brand.promo.code) {
      setPromo(brand.promo.code)
      setCodeError('')
    } else {
      setCodeError('That code is not valid. Try VERDE10.')
    }
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { reference } = await postJson<{ reference: string }>('/api/orders', { ...form, items: items.map((i) => ({ slug: i.slug, quantity: i.quantity })) })
      const order: Order = {
        reference,
        createdAt: new Date().toISOString(),
        email: form.email,
        name: form.name,
        address: `${form.address}, ${form.city} ${form.postcode}, ${form.country}`,
        shipping: method.label,
        shippingCost: t.ship,
        discount: t.discount,
        subtotal,
        total: t.total,
        items: items.map((i) => ({ slug: i.slug, name: i.product.name, size: i.size, quantity: i.quantity, price: i.price })),
      }
      addOrder(order)
      clearCart()
      setPromo(null)
      navigate(`/order/${reference}`)
    } catch (err) {
      const f = fieldErrors(err)
      setErrors(f)
      setError((err as Error).message)
      const first = Object.keys(f)[0]
      if (first) document.getElementById(`checkout-${first}`)?.focus()
    } finally {
      setLoading(false)
    }
  }

  if (!items.length)
    return (
      <Container className="mt-12">
        <Card>
          <EmptyState icon={<ShoppingBag aria-hidden />} title="Your bag is empty" body="Add something you love and come back to check out." action={<ButtonLink to="/shop">Shop products</ButtonLink>} />
        </Card>
      </Container>
    )

  const text = (k: keyof typeof form, label: string, auto: string, type = 'text', className?: string) => (
    <Field label={label} error={errors[k]} id={`checkout-${k}`} className={className}>
      {(p) => <Input {...p} type={type} autoComplete={auto} value={form[k]} invalid={!!errors[k]} onChange={(e) => set(k, e.target.value)} />}
    </Field>
  )

  return (
    <Container className="mt-6">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Bag' }, { label: 'Checkout' }]} />
      <h1 className="mt-4 text-[40px] font-semibold tracking-[-0.035em] sm:text-[52px]">Checkout</h1>
      <form onSubmit={submit} noValidate className="mt-8 grid items-start gap-4 lg:grid-cols-[1.3fr_1fr]">
        <Card className="min-w-0 space-y-10 p-6 sm:p-10">
          <section aria-labelledby="co-contact" className="space-y-5">
            <h2 id="co-contact" className="text-[22px] font-medium tracking-[-0.02em]">
              Contact
            </h2>
            {text('email', 'Email', 'email', 'email')}
          </section>
          <section aria-labelledby="co-ship" className="space-y-5">
            <h2 id="co-ship" className="text-[22px] font-medium tracking-[-0.02em]">
              Shipping address
            </h2>
            {text('name', 'Full name', 'name')}
            {text('address', 'Street address', 'street-address')}
            <div className="grid gap-5 sm:grid-cols-2">
              {text('city', 'City', 'address-level2')}
              {text('postcode', 'ZIP or postcode', 'postal-code')}
            </div>
            <Field label="Country" id="checkout-country">
              {(p) => (
                <Select {...p} autoComplete="country-name" value={form.country} onChange={(e) => set('country', e.target.value)}>
                  {countries.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </Select>
              )}
            </Field>
          </section>
          <fieldset className="space-y-3">
            <legend className="mb-5 text-[22px] font-medium tracking-[-0.02em]">Delivery</legend>
            {shipping.map((s) => (
              <OptionCard key={s.id} name="shipping" value={s.id} checked={form.shipping === s.id} onChange={(v) => set('shipping', v)} title={s.label} detail={s.detail} aside={subtotal - t.discount >= brand.freeShippingFrom ? 'Free' : money(s.price)} />
            ))}
          </fieldset>
          <Alert tone="neutral">
            <span className="flex items-center gap-2">
              <Lock className="size-4 shrink-0" aria-hidden /> Demo checkout: no payment details are needed and nothing is charged.
            </span>
          </Alert>
        </Card>

        <Card as="aside" className="min-w-0 p-6 sm:p-8 lg:sticky lg:top-6">
          <h2 className="text-[22px] font-medium tracking-[-0.02em]">Order summary</h2>
          <ul className="mt-5 space-y-3">
            {items.map((i) => (
              <li key={`${i.slug}-${i.size}`} className="flex items-center gap-3">
                <div className="relative grid size-16 shrink-0 place-items-center rounded-[16px] bg-surface-2 p-1.5">
                  <ProductArt product={i.product} />
                  <span className="round absolute -right-1.5 -top-1.5 grid size-6 place-items-center rounded-full bg-ink text-[12px] font-medium text-white">{i.quantity}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{i.product.name}</p>
                  <p className="text-[13px] text-muted">{i.size}</p>
                </div>
                <span className="font-medium tabular-nums">{money(i.price * i.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <label htmlFor="promo" className="text-[14px] font-medium text-ink-2">
              Promo code
            </label>
            <div className="mt-2 flex gap-2">
              <Input
                id="promo"
                value={code}
                invalid={!!codeError}
                aria-invalid={!!codeError || undefined}
                aria-describedby={codeError ? 'promo-error' : promo ? 'promo-ok' : undefined}
                onChange={(e) => {
                  setCode(e.target.value)
                  setCodeError('')
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    applyCode()
                  }
                }}
                placeholder="Promo code"
                className="uppercase placeholder:normal-case"
              />
              <Button variant="secondary" onClick={applyCode} disabled={!code.trim()}>
                Apply
              </Button>
            </div>
            {codeError && (
              <p id="promo-error" className="mt-2 text-[13px] text-danger">
                {codeError}
              </p>
            )}
            {promo && !codeError && (
              <p id="promo-ok" className="mt-2 flex items-center gap-1.5 text-[13px] text-success">
                <Tag className="size-3.5" aria-hidden /> {promo} applied: {brand.promo.percent}% off
                <button type="button" className="ml-1 inline-flex min-h-10 items-center underline" onClick={() => { setPromo(null); setCode('') }}>
                  Remove
                </button>
              </p>
            )}
          </div>
          <dl className="mt-6 space-y-2 border-t border-line pt-5 text-[15px]">
            <div className="flex justify-between">
              <dt className="text-muted">Subtotal</dt>
              <dd className="tabular-nums">{money(subtotal)}</dd>
            </div>
            {t.discount > 0 && (
              <div className="flex justify-between text-success">
                <dt>Discount</dt>
                <dd className="tabular-nums">-{money(t.discount)}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-muted">Shipping</dt>
              <dd className="tabular-nums">{t.ship ? money(t.ship) : 'Free'}</dd>
            </div>
            <div className="flex items-baseline justify-between border-t border-line pt-4">
              <dt className="font-medium">Total</dt>
              <dd className="text-[28px] font-semibold tracking-[-0.03em] tabular-nums">{money(t.total)}</dd>
            </div>
          </dl>
          {error && (
            <div className="mt-5">
              <Alert>{error}</Alert>
            </div>
          )}
          <Button type="submit" size="lg" loading={loading} className="mt-6 w-full">
            Place order
          </Button>
        </Card>
      </form>
    </Container>
  )
}
