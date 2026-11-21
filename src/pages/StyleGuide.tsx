import { Heart, Package, Play, ShoppingBag, ShoppingCart } from 'lucide-react'
import { motion } from 'motion/react'
import { useState, type ReactNode } from 'react'

import { Avatar, AvatarStack, HeroArt, Logo } from '../components/Art'
import { NewsletterForm } from '../components/Chrome'
import { Drawer } from '../components/Drawer'
import { ProductCard, ProductCardCompact, ProductCardSkeleton } from '../components/ProductCard'
import { Packshot, ProductArt } from '../components/ProductArt'
import {
  Accordion,
  ActionPill,
  Alert,
  Badge,
  Breadcrumbs,
  Button,
  Card,
  Chip,
  Container,
  CountBadge,
  EmptyState,
  Field,
  IconButton,
  Input,
  OptionCard,
  RatingInput,
  SectionHeading,
  Select,
  Skeleton,
  Spinner,
  Stars,
  Stepper,
  Textarea,
  TextLink,
  type ButtonVariant,
} from '../components/ui'
import { bySlug, products } from '../content'
import { useStore } from '../lib/store'
import { useTitle } from '../lib/title'
import { colorTokens, motionTokens, radii, shadows, spacing, typeScale } from '../lib/tokens'

const sections = [
  ['colours', 'Colours'],
  ['type', 'Type'],
  ['space', 'Space, radii, shadows'],
  ['motion', 'Motion'],
  ['buttons', 'Buttons'],
  ['fields', 'Fields'],
  ['selection', 'Chips and options'],
  ['feedback', 'Feedback'],
  ['products', 'Product cards'],
  ['identity', 'Brand and art'],
  ['overlays', 'Overlays'],
] as const

const states = [
  ['Default', undefined],
  ['Hover', 'hover'],
  ['Focus', 'focus'],
  ['Pressed', 'pressed'],
] as const

export function StyleGuide() {
  useTitle('Style guide')
  return (
    <Container className="mt-12">
      <SectionHeading as="h1" eyebrow="Design system" title="VERDÉ style guide" body="Every token and component the store is built from, rendered by the real components. Hover, focus and pressed states are pinned with data-force." />
      <nav aria-label="Style guide sections" className="sticky top-3 z-10 mt-8 -mx-1 flex gap-2 overflow-x-auto rounded-pill bg-page/85 p-1 backdrop-blur scrollbar-none">
        {sections.map(([id, label]) => (
          <a key={id} href={`#${id}`} className="inline-flex h-10 shrink-0 items-center rounded-pill px-4 text-[14px] font-medium text-ink-2 hover:bg-white">
            {label}
          </a>
        ))}
      </nav>

      <Section id="colours" title="Colours">
        {colorTokens.map((g) => (
          <div key={g.group} className="mb-8">
            <h3 className="mb-3 text-[15px] font-medium text-muted">{g.group}</h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {g.items.map((c) => (
                <div key={c.name} className="overflow-hidden rounded-[22px] bg-surface shadow-card">
                  <div className="h-20 border-b border-line" style={{ background: c.hex }} />
                  <div className="p-3">
                    <p className="font-medium">{c.name}</p>
                    <p className="text-[13px] uppercase tabular-nums text-muted">{c.hex}</p>
                    <p className="mt-1 text-[12px] leading-snug text-muted">{c.use}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            ['hero-wall', 'Light pool behind the product, darker edges for white copy.'],
            ['wall-calm', 'Even and darker, for text-heavy panels (AA for white body text).'],
          ].map(([name, use]) => (
            <div key={name} className="overflow-hidden rounded-[22px] bg-surface shadow-card">
              <div className={`h-28 ${name}`} />
              <div className="p-3">
                <p className="font-medium">{name} utility</p>
                <p className="text-[13px] text-muted">{use}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section id="type" title="Type: Outfit">
        <div className="divide-y divide-line">
          {typeScale.map((t) => (
            <div key={t.name} className="grid items-baseline gap-2 py-5 md:grid-cols-[160px_1fr]">
              <div>
                <p className="font-medium">{t.name}</p>
                <p className="text-[13px] text-muted">{t.spec}</p>
              </div>
              <p className={`${t.className} min-w-0 break-words`}>{t.sample}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section id="space" title="Space, radii, shadows">
        <h3 className="mb-3 text-[15px] font-medium text-muted">Spacing (px)</h3>
        <div className="flex flex-wrap items-end gap-4">
          {spacing.map((s) => (
            <div key={s} className="flex flex-col items-center gap-2">
              <div className="rounded-[4px] bg-amber" style={{ width: s, height: s }} />
              <span className="text-[13px] tabular-nums text-muted">{s}</span>
            </div>
          ))}
        </div>
        <h3 className="mb-3 mt-10 text-[15px] font-medium text-muted">Radii (squircle)</h3>
        <div className="flex flex-wrap gap-4">
          {radii.map((r) => (
            <div key={r.name} className="text-center">
              <div className="size-24 border border-line-strong bg-surface" style={{ borderRadius: r.value }} />
              <p className="mt-2 text-[14px] font-medium">{r.name}</p>
              <p className="text-[13px] text-muted">{r.value}</p>
            </div>
          ))}
        </div>
        <h3 className="mb-3 mt-10 text-[15px] font-medium text-muted">Shadows</h3>
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
          {shadows.map((s) => (
            <div key={s.name} className="grid h-28 place-items-center rounded-card bg-surface" style={{ boxShadow: s.value }}>
              <span className="font-medium">{s.name}</span>
            </div>
          ))}
        </div>
      </Section>

      <MotionSection />

      <Section id="buttons" title="Buttons">
        {(['primary', 'secondary', 'light', 'ghost', 'danger'] as ButtonVariant[]).map((v) => (
          <Row key={v} label={v} dark={v === 'light'}>
            {states.map(([label, force]) => (
              <Button key={label} variant={v} force={force}>
                {label}
              </Button>
            ))}
            <Button variant={v} disabled>
              Disabled
            </Button>
            <Button variant={v} loading>
              Loading
            </Button>
          </Row>
        ))}
        <Row label="Sizes">
          <Button size="sm">Small 40</Button>
          <Button size="md">Medium 48</Button>
          <Button size="lg">Large 56</Button>
          <Button>
            <ShoppingBag aria-hidden /> With icon
          </Button>
        </Row>
        <Row label="Action pill" dark>
          {states.map(([label, force]) => (
            <ActionPill key={label} force={force} icon={<ShoppingCart aria-hidden />}>
              {label}
            </ActionPill>
          ))}
          <ActionPill icon={<ShoppingCart aria-hidden />} disabled>
            Disabled
          </ActionPill>
          <ActionPill icon={<ShoppingCart aria-hidden />} loading>
            Loading
          </ActionPill>
        </Row>
        {(['glass', 'solid', 'dark', 'plain'] as const).map((tone) => (
          <Row key={tone} label={`Icon ${tone}`} dark={tone === 'glass'}>
            {states.map(([label, force]) => (
              <IconButton key={label} label={`${label} ${tone}`} tone={tone} force={force}>
                <Heart aria-hidden />
              </IconButton>
            ))}
            <IconButton label={`Disabled ${tone}`} tone={tone} disabled>
              <Heart aria-hidden />
            </IconButton>
            <div className="flex items-center">
              <CountBadge count={12} className="relative z-10 -mr-2 ring-0" />
              <IconButton label="With count" tone={tone} size="lg">
                <Heart className="fill-current" aria-hidden />
              </IconButton>
            </div>
          </Row>
        ))}
        <Row label="Links">
          <TextLink to="/shop">Text link</TextLink>
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Products', to: '/shop' }, { label: 'Serum' }]} />
        </Row>
      </Section>

      <Section id="fields" title="Fields">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Field label="Default">{(p) => <Input {...p} placeholder="you@example.com" />}</Field>
          <Field label="Hover">{(p) => <Input {...p} force="hover" placeholder="you@example.com" />}</Field>
          <Field label="Focus">{(p) => <Input {...p} force="focus" defaultValue="maya@example.com" />}</Field>
          <Field label="Error" error="Enter a valid email address.">
            {(p) => <Input {...p} invalid defaultValue="maya@" />}
          </Field>
          <Field label="Disabled" hint="Hint text sits under the field.">
            {(p) => <Input {...p} disabled defaultValue="Locked" />}
          </Field>
          <Field label="Select">
            {(p) => (
              <Select {...p}>
                <option>All skin types</option>
                <option>Dry skin</option>
              </Select>
            )}
          </Field>
          <Field label="Textarea" className="md:col-span-2">
            {(p) => <Textarea {...p} placeholder="How did your skin feel after a week?" />}
          </Field>
          <Field label="Select error" error="Choose a topic.">
            {(p) => (
              <Select {...p} invalid>
                <option>Choose a topic</option>
              </Select>
            )}
          </Field>
        </div>
        <Row label="Stepper">
          <StepperDemo />
        </Row>
        <Row label="Rating">
          <RatingDemo />
          <Stars value={4.6} size={18} />
        </Row>
        <Row label="Newsletter">
          <NewsletterForm />
        </Row>
      </Section>

      <Section id="selection" title="Chips and options">
        <Row label="Chip">
          {states.map(([label, force]) => (
            <Chip key={label} force={force}>
              {label}
            </Chip>
          ))}
          <Chip selected>Selected</Chip>
          <Chip disabled>Disabled</Chip>
        </Row>
        <OptionDemo />
        <div className="mt-8">
          <Accordion
            defaultOpen={0}
            items={[
              { q: 'Accordion, open', a: 'Answers sit in muted body text and toggle with Enter or Space.' },
              { q: 'Accordion, closed', a: 'Hidden until opened.' },
            ]}
          />
        </div>
      </Section>

      <Section id="feedback" title="Feedback">
        <Row label="Badges">
          <Badge>Neutral</Badge>
          <Badge tone="amber">Amber</Badge>
          <Badge tone="success">Delivered</Badge>
          <Badge tone="danger">Out of stock</Badge>
          <Badge tone="dark">Bestseller</Badge>
          <CountBadge count={3} />
        </Row>
        <div className="grid gap-3 md:grid-cols-3">
          <Alert>Check the highlighted fields.</Alert>
          <Alert tone="success">Your review is live.</Alert>
          <Alert tone="neutral">Demo checkout: nothing is charged.</Alert>
        </div>
        <Row label="Loading">
          <Spinner />
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-12 w-48 rounded-pill" />
        </Row>
        <Row label="Toast">
          <ToastDemo />
        </Row>
        <Card className="mt-6">
          <EmptyState icon={<Package aria-hidden />} title="Empty state" body="Used for empty bags, wishlists, orders and filters with no results." action={<Button size="sm">Action</Button>} />
        </Card>
      </Section>

      <Section id="products" title="Product cards">
        <div className="grid gap-6 lg:grid-cols-[auto_1fr]">
          <div className="hero-wall flex flex-wrap gap-4 rounded-card p-6">
            <div className="w-[186px]">
              <ProductCardCompact product={bySlug('centella-facial-serum')!} className="h-[296px]" />
            </div>
            <div className="w-[186px]">
              <ProductCardCompact product={bySlug('calming-toner-pads')!} className="h-[296px]" force="hover" />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <ProductCard product={bySlug('daily-sheer-spf')!} />
            <ProductCard product={bySlug('barrier-recovery-gel')!} force="hover" />
            <ProductCardSkeleton />
          </div>
        </div>
      </Section>

      <Section id="identity" title="Brand and art">
        <Row label="Logo on wall" dark>
          <Logo />
        </Row>
        <Row label="Logo on page">
          <Logo tone="solid" withName />
        </Row>
        <Row label="Avatars">
          {[0, 1, 2, 3].map((i) => (
            <Avatar key={i} index={i} size={52} />
          ))}
          <AvatarStack size={44} />
        </Row>
        <h3 className="mb-3 mt-6 text-[15px] font-medium text-muted">Packshots: photo from PHOTOS, SVG recipe as the fallback</h3>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {(['dropper', 'tube', 'jar', 'pads', 'pump', 'mist', 'stick'] as const).map((k) => {
            const p = products.find((x) => x.art.kind === k)!
            return (
              <div key={k} className="rounded-[22px] bg-surface p-3 text-center shadow-card">
                <div className="grid h-28 grid-cols-2 gap-1 rounded-[16px] bg-surface-2 p-2">
                  <ProductArt product={p} />
                  <Packshot art={p.art} label={k} />
                </div>
                <p className="mt-2 text-[13px] text-muted">{k}</p>
              </div>
            )
          })}
        </div>
        <div className="hero-wall mt-6 h-[420px] overflow-hidden rounded-card">
          <HeroArt className="mx-auto h-full w-full max-w-md" />
        </div>
      </Section>

      <Section id="overlays" title="Overlays">
        <Row label="Drawer">
          <DrawerDemo />
        </Row>
      </Section>
    </Container>
  )
}

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="mt-16 scroll-mt-20">
      <h2 id={`${id}-h`} className="mb-6 text-[30px] font-medium tracking-[-0.03em]">
        {title}
      </h2>
      {children}
    </section>
  )
}

function Row({ label, children, dark }: { label: string; children: ReactNode; dark?: boolean }) {
  return (
    <div className={`mb-4 flex flex-col gap-3 rounded-card p-5 md:flex-row md:items-center ${dark ? 'wall-calm on-dark' : 'bg-surface shadow-card'}`}>
      <p className={`w-36 shrink-0 text-[14px] font-medium capitalize ${dark ? 'text-white' : 'text-muted'}`}>{label}</p>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  )
}

function MotionSection() {
  const [run, setRun] = useState(0)
  return (
    <Section id="motion" title="Motion">
      <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
        <Card className="p-6">
          <ul className="divide-y divide-line">
            {motionTokens.map((m) => (
              <li key={m.name} className="flex flex-wrap justify-between gap-2 py-3 text-[14px]">
                <span className="font-medium">{m.name}</span>
                <span className="text-muted">
                  {m.value} / {m.use}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[13px] text-muted">Reduced motion: loops stop, entrances become instant.</p>
        </Card>
        <Card className="flex flex-col p-6">
          <div key={run} className="grid flex-1 grid-cols-3 gap-4">
            <div className="flex flex-col items-center gap-2">
              <div className="size-16 animate-rise rounded-[18px] bg-ink" />
              <span className="text-[13px] text-muted">rise</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <motion.div initial={{ x: -40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }} className="size-16 rounded-[18px] bg-amber" />
              <span className="text-[13px] text-muted">drawer, ease-soft</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="h-16 w-10 animate-float rounded-[12px] bg-sage" />
              <span className="text-[13px] text-muted">float</span>
            </div>
          </div>
          <Button variant="secondary" size="sm" className="mt-6 self-start" onClick={() => setRun((r) => r + 1)}>
            <Play aria-hidden /> Replay
          </Button>
        </Card>
      </div>
    </Section>
  )
}

function StepperDemo() {
  const [v, setV] = useState(2)
  return (
    <>
      <Stepper label="Demo quantity" value={v} onChange={setV} />
      <Stepper label="Small quantity" size="sm" value={v} onChange={setV} />
    </>
  )
}

function RatingDemo() {
  const [v, setV] = useState(4)
  return <RatingInput value={v} onChange={setV} />
}

function OptionDemo() {
  const [v, setV] = useState('standard')
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <OptionCard name="sg-ship" value="standard" checked={v === 'standard'} onChange={setV} title="Selected" detail="2 to 5 working days" aside="$6" />
      <OptionCard name="sg-ship" value="express" checked={v === 'express'} onChange={setV} title="Default" detail="Next working day" aside="$14" />
      <OptionCard name="sg-ship-2" value="h" checked={false} onChange={() => {}} title="Hover" force="hover" />
      <OptionCard name="sg-ship-3" value="f" checked={false} onChange={() => {}} title="Focus" force="focus" />
      <OptionCard name="sg-ship-4" value="d" checked={false} onChange={() => {}} title="Disabled" disabled />
    </div>
  )
}

function ToastDemo() {
  const { toast } = useStore()
  return (
    <>
      <Button variant="secondary" size="sm" onClick={() => toast('Saved to your wishlist')}>
        Show toast
      </Button>
      <Button variant="secondary" size="sm" onClick={() => toast('Added to your bag', 'success')}>
        Success toast
      </Button>
      <Button variant="secondary" size="sm" onClick={() => toast('Could not reach the server', 'error')}>
        Error toast
      </Button>
    </>
  )
}

function DrawerDemo() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open drawer</Button>
      <Drawer open={open} onClose={() => setOpen(false)} title="Drawer" footer={<Button className="w-full" onClick={() => setOpen(false)}>Done</Button>}>
        <p className="text-muted">Focus is trapped inside. Escape or the close button returns focus to the button that opened it.</p>
      </Drawer>
    </>
  )
}
