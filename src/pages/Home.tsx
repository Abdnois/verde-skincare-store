import { ArrowRight, ShoppingCart, Sparkles } from 'lucide-react'
import { motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router'

import { Avatar, AvatarStack, HeroArt, Photo, SerumStill } from '../components/Art'
import { Nav } from '../components/Nav'
import { ProductCard, ProductCardCompact } from '../components/ProductCard'
import { ProductArt } from '../components/ProductArt'
import { ActionPill, ButtonLink, Card, Container, SectionHeading, Stars } from '../components/ui'
import { bySlug, concerns, hero, PHOTOS, products, promises, routineSteps, testimonials } from '../content'
import { useStore } from '../lib/store'
import { useTitle } from '../lib/title'

const ease = [0.22, 1, 0.36, 1] as const
const rise = (delay: number) => ({ initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, delay, ease } })

export function Home() {
  useTitle()
  return (
    <>
      <Hero />
      <Concerns />
      <Bestsellers />
      <Routine />
      <Promises />
      <Testimonials />
    </>
  )
}

function Hero() {
  const { add } = useStore()
  const featured = bySlug(hero.featured)!
  const cards = hero.cards.map((s) => bySlug(s)!)
  const [mobile, setMobile] = useState(false)
  useEffect(() => {
    const mm = window.matchMedia('(max-width: 1023px)')
    const on = (e: MediaQueryListEvent) => setMobile(e.matches)
    setMobile(mm.matches)
    mm.addEventListener('change', on)
    return () => mm.removeEventListener('change', on)
  }, [])
  return (
    <div className="px-3 pt-3 sm:px-6 sm:pt-6">
      <section aria-labelledby="hero-title" className="relative mx-auto flex max-w-[1520px] flex-col overflow-hidden rounded-[32px] p-5 shadow-hero sm:rounded-hero sm:p-8 lg:hero-wall lg:on-dark lg:h-[calc(100svh-48px)] lg:max-h-[940px] lg:min-h-[780px] lg:p-10 xl:px-12">
        <Nav tone={mobile ? 'solid' : 'overlay'} />

        {/* the photo fills the card on desktop and becomes its own frame on
            mobile; without PHOTOS.hero the SVG still life stands in */}
        {PHOTOS.hero ? (
          <motion.div initial={{ opacity: 0, scale: 1.03 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.4, ease }} className="relative order-2 mt-6 max-lg:mt-8 max-lg:h-auto max-lg:rounded-[26px] max-lg:overflow-hidden max-lg:w-full max-lg:border max-lg:border-line max-lg:shadow-card sm:h-[420px] lg:absolute lg:inset-0 lg:mx-0 lg:mt-0 lg:h-auto lg:rounded-none">
            <Photo src={PHOTOS.hero} eager position="center 15%" className="max-lg:object-cover max-lg:h-[240px] lg:h-full" />
            <div aria-hidden className="absolute inset-0 hidden max-lg:block lg:block" style={{ background: 'radial-gradient(120% 80% at 20% 15%, rgba(180,190,168,0.32) 0%, rgba(180,190,168,0.04) 26%, rgba(180,190,168,0) 42%, rgba(180,190,168,0) 68%, rgba(180,190,168,0.05) 86%, rgba(180,190,168,0.10) 100%), linear-gradient(180deg, rgba(100,116,92,0.08) 0%, rgba(100,116,92,0.10) 22%, rgba(100,116,92,0) 44%, rgba(100,116,92,0) 74%, rgba(100,116,92,0.04) 92%, rgba(100,116,92,0.08) 100%)' }} />
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2, ease }} className="relative order-2 mx-auto -mb-5 mt-2 h-[420px] w-full max-w-[420px] sm:h-[500px] lg:absolute lg:bottom-0 lg:left-[56%] lg:mb-0 lg:h-[88%] lg:w-[36%] lg:max-w-none lg:-translate-x-1/2 xl:left-[49%] xl:h-[92%] xl:w-[44%]">
            <HeroArt className="h-full w-full" />
          </motion.div>
        )}

        <div className="relative z-10 order-1 mt-8 max-w-[520px] lg:mt-[64px] lg:max-w-[340px] xl:max-w-[520px]">
          <p className="mb-4 text-[13px] font-medium uppercase tracking-[0.18em] text-white/70 max-lg:text-ink-2">{hero.community.label}</p>
          <motion.h1 id="hero-title" {...rise(0.1)} className="text-balance text-[44px] font-semibold leading-[1.02] tracking-[-0.04em] text-white sm:text-[58px] max-lg:text-[40px] max-lg:leading-[1.05] max-lg:text-ink lg:text-[52px] xl:text-[68px]">
            {hero.title[0]}
            <br />
            <span className="block text-[116%] font-semibold leading-[1.0] tracking-[-0.03em] text-white max-lg:text-ink">{hero.title[1]}</span>
          </motion.h1>
          <motion.p {...rise(0.22)} className="mt-5 max-w-[420px] text-pretty text-[16px] leading-[1.5] text-white/90 max-lg:text-ink-2 max-lg:max-w-full lg:max-w-[280px] xl:max-w-[380px] min-[1400px]:max-w-[420px]">
            {hero.body}
          </motion.p>
          <motion.div {...rise(0.32)} className="mt-6 flex flex-wrap gap-3 max-lg:justify-start lg:hidden">
            <ButtonLink to="/shop" variant="secondary" className="max-lg:bg-ink max-lg:text-white">
              Shop products
            </ButtonLink>
          </motion.div>
        </div>

        {/* right column: community count + featured product + third card — one
            absolutely-positioned group on desktop so all three pieces move together. */}
        <motion.div {...rise(0.4)} className="relative z-10 order-3 mt-6 flex flex-wrap items-end justify-between gap-6 max-lg:flex-col max-lg:items-start max-lg:gap-4 lg:absolute lg:bottom-10 lg:right-10 lg:mt-0 lg:w-[190px] lg:flex-col lg:items-start xl:right-12">
          {/* community avatars + count: visible on mobile/tablet only */}
          <div className="flex flex-col items-center max-xl:block lg:hidden">
            <AvatarStack size={48} />
            <p className="mt-2 text-[30px] font-semibold tracking-[-0.03em] text-white max-lg:text-ink tabular-nums">{hero.community.value}</p>
            <p className="sr-only">{hero.community.label}</p>
          </div>
          {/* community avatars + count: trusted-by proof above the featured pick on desktop */}
          <div className="hidden lg:flex lg:flex-col lg:items-center lg:gap-2">
            <AvatarStack size={42} />
            <p className="text-[22px] font-semibold tracking-[-0.02em] text-white tabular-nums">{hero.community.value}</p>
            <p className="sr-only">{hero.community.label}</p>
          </div>
          {/* featured product title + Add to Cart button */}
          <div className="mt-8">
            <p className="max-w-[180px] text-[16px] leading-[1.4] text-white max-xl:-mx-3 max-xl:rounded-field max-xl:bg-[rgba(71,84,64,0.5)] max-xl:px-3 max-xl:py-2 max-xl:backdrop-blur-md max-lg:text-ink">{featured.name}</p>
            <ActionPill icon={<ShoppingCart aria-hidden />} className="mt-3 max-lg:-ml-3 max-lg:bg-ink max-lg:text-white" onClick={() => add(featured)} aria-label={`Add to Cart, ${featured.name}`}>
              Add to Cart
            </ActionPill>
          </div>
          {/* third product card — placed below the Add to Cart button on desktop,
              with explicit width and height matching the two left product cards. */}
          <div className="hidden lg:block lg:w-[176px] lg:shrink-0 lg:pt-6">
            <ProductCardCompact product={cards[2]} className="h-[280px] bg-[rgba(214,219,201,0.46)] border border-[rgba(163,176,149,0.28)]" />
          </div>
        </motion.div>

        {/* floating product cards — hidden on mobile to keep the cream hero clean */}
        <div className="relative z-10 order-4 hidden lg:block -mx-4 mt-6 flex snap-x gap-3 overflow-x-auto px-4 pb-2 scrollbar-none sm:-mx-7 sm:px-7 lg:pointer-events-none lg:absolute lg:inset-x-10 lg:bottom-10 lg:mx-0 lg:mt-0 lg:justify-start lg:overflow-visible lg:px-0 lg:pb-0 xl:inset-x-12">
          <div className="flex gap-3 lg:pointer-events-auto">
            {cards.slice(0, 2).map((p, i) => (
              <motion.div key={p.slug} {...rise(0.5 + i * 0.08)} className="w-[176px] shrink-0 snap-start">
                <ProductCardCompact product={p} className="h-[280px] bg-[rgba(214,219,201,0.46)] border border-[rgba(163,176,149,0.28)]" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

function Concerns() {
  return (
    <Container className="mt-20">
      <SectionHeading eyebrow="Shop by concern" title="Start with what your skin is telling you" />
      <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {concerns.map((c, i) => {
          const sample = products.find((p) => p.concerns[0] === c) ?? products[i]
          return (
            <li key={c}>
              <Link to={`/shop?concern=${encodeURIComponent(c)}`} className="group flex h-full flex-col rounded-card bg-surface p-4 shadow-card transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-float">
                <div className="h-32 rounded-[20px] bg-surface-2 p-2">
                  <ProductArt product={sample} className="transition-transform duration-500 group-hover:scale-105" />
                </div>
                <span className="mt-4 flex items-center justify-between text-[17px] font-medium">
                  {c}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
                </span>
                <span className="text-[13px] text-muted">{products.filter((p) => p.concerns.includes(c)).length} products</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </Container>
  )
}

function Bestsellers() {
  const list = [...products].sort((a, b) => b.reviews - a.reviews).slice(0, 4)
  return (
    <Container className="mt-24">
      <SectionHeading
        eyebrow="Most reordered"
        title="The ones people run out of first"
        action={
          <ButtonLink to="/shop" variant="secondary">
            Shop all products <ArrowRight aria-hidden />
          </ButtonLink>
        }
      />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {list.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
    </Container>
  )
}

function Routine() {
  return (
    <Container className="mt-24">
      <div className="grid gap-4 lg:grid-cols-[1.1fr_1fr]">
        <Card className="p-8 sm:p-12">
          <SectionHeading eyebrow="The VERDÉ ritual" title="Five steps, or three on busy mornings" />
          <ol className="mt-8 space-y-1">
            {routineSteps.map((s) => (
              <li key={s.step} className="flex gap-5 rounded-field py-3">
                <span className="round grid size-10 shrink-0 place-items-center rounded-full bg-surface-2 font-semibold tabular-nums">{s.step}</span>
                <div>
                  <p className="font-medium">{s.name}</p>
                  <p className="text-[15px] text-muted">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </Card>
        <div className="wall-calm on-dark relative flex min-h-[460px] flex-col justify-between overflow-hidden rounded-card p-8 text-white shadow-card sm:p-12">
          <div className="relative z-10 max-w-[300px]">
            <p className="flex items-center gap-2 text-[14px] font-medium">
              <Sparkles className="size-4" aria-hidden /> Skin quiz
            </p>
            <h2 className="mt-3 text-balance text-[36px] font-semibold leading-[1.02] tracking-[-0.035em] sm:text-[44px]">Not sure where to start?</h2>
            <p className="mt-4 text-pretty text-[17px] leading-relaxed">Answer four questions and get a routine matched to your skin, with the reason for every step.</p>
          </div>
          <div className="absolute bottom-6 right-2 hidden h-[66%] w-[46%] md:block">
            <SerumStill className="h-full w-full" />
          </div>
          <ButtonLink to="/quiz" variant="light" size="lg" className="relative z-10 mt-10 self-start">
            Take the quiz <ArrowRight aria-hidden />
          </ButtonLink>
        </div>
      </div>
    </Container>
  )
}

function Promises() {
  return (
    <Container className="mt-24">
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {promises.map((p, i) => (
          <li key={p.title} className="rounded-card border border-line-strong/60 p-6">
            <span className="text-[13px] font-medium tabular-nums text-muted">0{i + 1}</span>
            <h3 className="mt-6 text-[20px] font-medium tracking-[-0.02em]">{p.title}</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-muted">{p.body}</p>
          </li>
        ))}
      </ul>
    </Container>
  )
}

function Testimonials() {
  return (
    <Container className="mt-24">
      <SectionHeading eyebrow="4.8 out of 5 from 21,000 reviews" title="Calmer skin, in their words" />
      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        {testimonials.map((t) => (
          <Card as="article" key={t.name} className="flex flex-col p-8">
            <Stars value={5} size={16} />
            <blockquote className="mt-5 flex-1 text-pretty text-[20px] leading-snug tracking-[-0.01em]">“{t.quote}”</blockquote>
            <div className="mt-8 flex items-center gap-3">
              <Avatar index={t.avatar} size={44} ring={false} />
              <div>
                <p className="font-medium">{t.name}</p>
                <p className="text-[13px] text-muted">{t.detail}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Container>
  )
}
