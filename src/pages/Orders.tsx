import { CheckCircle2, Package } from 'lucide-react'
import { Link, useParams } from 'react-router'

import { ProductArt } from '../components/ProductArt'
import { Badge, Button, ButtonLink, Card, Container, EmptyState, SectionHeading } from '../components/ui'
import { bySlug } from '../content'
import { money } from '../lib/money'
import { useStore, type Order } from '../lib/store'
import { useTitle } from '../lib/title'

const date = (iso: string) => new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

export function OrderConfirmed() {
  const { reference = '' } = useParams()
  const { orders } = useStore()
  const order = orders.find((o) => o.reference === reference)
  useTitle(order ? `Order ${order.reference}` : 'Order not found')
  if (!order)
    return (
      <Container className="mt-12">
        <Card>
          <EmptyState icon={<Package aria-hidden />} title="We could not find that order" body="Orders are saved in this browser. Check the link, or see every order you placed here." action={<ButtonLink to="/orders">Your orders</ButtonLink>} />
        </Card>
      </Container>
    )
  return (
    <Container className="mt-10">
      <Card className="mx-auto max-w-3xl p-6 text-center sm:p-12">
        <CheckCircle2 className="mx-auto size-14 text-success" strokeWidth={1.5} aria-hidden />
        <h1 className="mt-5 text-balance text-[36px] font-semibold tracking-[-0.035em] sm:text-[48px]">Thank you, {order.name.split(' ')[0]}</h1>
        <p className="mx-auto mt-3 max-w-md text-pretty text-muted">
          Order <strong className="font-semibold text-ink">{order.reference}</strong> is confirmed. This is a demo checkout — no payment is taken, no receipt is emailed, and your order is stored locally in this browser only.
        </p>
        <OrderBody order={order} />
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink to="/orders">View all orders</ButtonLink>
          <ButtonLink to="/shop" variant="secondary">
            Keep shopping
          </ButtonLink>
        </div>
      </Card>
    </Container>
  )
}

function OrderBody({ order }: { order: Order }) {
  return (
    <div className="mt-8 text-left">
      <ul className="divide-y divide-line border-y border-line">
        {order.items.map((i) => {
          const p = bySlug(i.slug)
          return (
            <li key={`${i.slug}-${i.size}`} className="flex items-center gap-4 py-3">
              <div className="grid size-14 shrink-0 place-items-center rounded-[14px] bg-surface-2 p-1.5">{p && <ProductArt product={p} />}</div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{i.name}</p>
                <p className="text-[13px] text-muted">
                  {i.size} / qty {i.quantity}
                </p>
              </div>
              <span className="tabular-nums">{money(i.price * i.quantity)}</span>
            </li>
          )
        })}
      </ul>
      <dl className="mt-4 grid gap-1.5 text-[15px] sm:grid-cols-2">
        <div>
          <dt className="text-muted">Ship to</dt>
          <dd>{order.address}</dd>
        </div>
        <div className="space-y-1.5">
          <div className="flex justify-between">
            <dt className="text-muted">Subtotal</dt>
            <dd className="tabular-nums">{money(order.subtotal)}</dd>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-success">
              <dt>Discount</dt>
              <dd className="tabular-nums">-{money(order.discount)}</dd>
            </div>
          )}
          <div className="flex justify-between">
            <dt className="text-muted">{order.shipping} delivery</dt>
            <dd className="tabular-nums">{order.shippingCost ? money(order.shippingCost) : 'Free'}</dd>
          </div>
          <div className="flex items-baseline justify-between border-t border-line pt-1.5">
            <dt className="font-medium">Total</dt>
            <dd className="text-[22px] font-semibold tabular-nums">{money(order.total)}</dd>
          </div>
        </div>
      </dl>
    </div>
  )
}

export function Orders() {
  useTitle('Your orders')
  const { orders, addOrderLines } = useStore()
  return (
    <Container className="mt-12">
      <SectionHeading as="h1" eyebrow="Your account" title="Orders" body="Orders placed in this browser are stored locally here. Status is illustrative; nothing is shipped." />
      {orders.length === 0 ? (
        <Card className="mt-8">
          <EmptyState icon={<Package aria-hidden />} title="No orders yet" body="When you check out, your orders appear here." action={<ButtonLink to="/shop">Shop products</ButtonLink>} />
        </Card>
      ) : (
        <ul className="mt-8 space-y-4">
          {orders.map((o) => {
            const products = o.items.map((i) => bySlug(i.slug)).filter((p) => !!p)
            return (
              <li key={o.reference}>
                <Card as="article" className="p-6 sm:p-8">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h2 className="text-[20px] font-medium tracking-[-0.02em]">
                        <Link to={`/order/${o.reference}`} className="hover:underline">
                          {o.reference}
                        </Link>
                      </h2>
                      <p className="text-[14px] text-muted">
                        {date(o.createdAt)} / {o.items.reduce((n, i) => n + i.quantity, 0)} items / {money(o.total)}
                      </p>
                    </div>
                    <Badge>Demo order</Badge>
                  </div>
                  <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex -space-x-3">
                      {products.slice(0, 5).map((p, i) => (
                        <div key={`${p.slug}-${i}`} className="round grid size-14 place-items-center rounded-full bg-surface-2 p-2 ring-4 ring-white">
                          <ProductArt product={p} />
                        </div>
                      ))}
                    </div>
                    <Button variant="secondary" size="sm" onClick={() => addOrderLines(o.items.map((i) => ({ slug: i.slug, size: i.size, quantity: i.quantity })))}>
                      Reorder
                    </Button>
                  </div>
                </Card>
              </li>
            )
          })}
        </ul>
      )}
    </Container>
  )
}
