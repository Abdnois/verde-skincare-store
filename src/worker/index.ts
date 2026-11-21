import { Hono } from 'hono'

// The Worker in front of the storefront. The catalogue ships with the app;
// these routes validate what a real store would send to a server. Replace the
// bodies with Stripe Checkout, a mailer or D1 writes when you connect them.
type Env = { ASSETS: Fetcher }

const app = new Hono<{ Bindings: Env }>()

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const str = (v: unknown, max = 500) => (typeof v === 'string' ? v.trim().slice(0, max) : '')

async function body(c: { req: { json: <T>() => Promise<T> } }): Promise<Record<string, unknown> | null> {
  const data = await c.req.json<unknown>().catch(() => null)
  return data && typeof data === 'object' && !Array.isArray(data) ? (data as Record<string, unknown>) : null
}

app.get('/api/health', (c) => c.json({ ok: true }))

app.post('/api/orders', async (c) => {
  const b = await body(c)
  if (!b) return c.json({ error: 'Send the order as JSON.' }, 400)
  const fields: Record<string, string> = {}
  if (!EMAIL.test(str(b.email))) fields.email = 'Enter a valid email address.'
  if (str(b.name).length < 2) fields.name = 'Enter your full name.'
  if (str(b.address).length < 5) fields.address = 'Enter your street address.'
  if (str(b.city).length < 2) fields.city = 'Enter your city.'
  if (!/^[A-Za-z0-9 -]{3,10}$/.test(str(b.postcode))) fields.postcode = 'Enter a valid ZIP or postcode.'
  if (!['standard', 'express'].includes(str(b.shipping))) fields.shipping = 'Choose a delivery option.'
  const items = Array.isArray(b.items) ? b.items : []
  const validItems = items.filter(
    (i): i is { slug: string; quantity: number } =>
      !!i && typeof i === 'object' && typeof (i as { slug?: unknown }).slug === 'string' && Number.isInteger((i as { quantity?: unknown }).quantity) && (i as { quantity: number }).quantity > 0 && (i as { quantity: number }).quantity <= 20,
  )
  if (!items.length) return c.json({ error: 'Your bag is empty.' }, 400)
  if (validItems.length !== items.length) return c.json({ error: 'One of the items in your bag is not valid.' }, 400)
  if (Object.keys(fields).length) return c.json({ error: 'Check the highlighted fields.', fields }, 422)
  const reference = `DL-${Date.now().toString(36).toUpperCase().slice(-6)}`
  return c.json({ reference }, 201)
})

app.post('/api/newsletter', async (c) => {
  const b = await body(c)
  if (!b || !EMAIL.test(str(b.email))) return c.json({ error: 'Enter a valid email address.', fields: { email: 'Enter a valid email address.' } }, 422)
  return c.json({ ok: true }, 201)
})

app.post('/api/contact', async (c) => {
  const b = await body(c)
  if (!b) return c.json({ error: 'Send the message as JSON.' }, 400)
  const fields: Record<string, string> = {}
  if (str(b.name).length < 2) fields.name = 'Tell us your name.'
  if (!EMAIL.test(str(b.email))) fields.email = 'Enter a valid email address.'
  if (!str(b.topic)) fields.topic = 'Choose a topic.'
  if (str(b.message, 4000).length < 10) fields.message = 'Write at least 10 characters.'
  if (Object.keys(fields).length) return c.json({ error: 'Check the highlighted fields.', fields }, 422)
  return c.json({ ok: true, ticket: `T-${Math.floor(10000 + Math.random() * 89999)}` }, 201)
})

app.post('/api/reviews', async (c) => {
  const b = await body(c)
  if (!b) return c.json({ error: 'Send the review as JSON.' }, 400)
  const fields: Record<string, string> = {}
  const rating = Number(b.rating)
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) fields.rating = 'Choose a rating from 1 to 5.'
  if (str(b.name).length < 2) fields.name = 'Add the name to show.'
  if (str(b.title).length < 3) fields.title = 'Give your review a short title.'
  if (str(b.body, 2000).length < 20) fields.body = 'Write at least 20 characters.'
  if (!str(b.product)) fields.product = 'Missing product.'
  if (Object.keys(fields).length) return c.json({ error: 'Check the highlighted fields.', fields }, 422)
  return c.json({ ok: true, id: crypto.randomUUID() }, 201)
})

app.all('/api/*', (c) => c.json({ error: 'Not found' }, 404))

app.all('*', (c) => c.env.ASSETS.fetch(c.req.raw))

export default app
