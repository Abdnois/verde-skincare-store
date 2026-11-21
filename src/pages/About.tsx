import { ArrowRight } from 'lucide-react'

import { Photo } from '../components/Art'
import { ButtonLink, Card, Container, SectionHeading } from '../components/ui'
import { about, PHOTOS, promises } from '../content'
import { useTitle } from '../lib/title'

export function About() {
  useTitle('Our lab')
  return (
    <>
      <Container className="mt-8">
        <section className="wall-calm on-dark relative grid min-h-[560px] overflow-hidden rounded-panel p-8 text-white shadow-hero sm:p-14 lg:grid-cols-2">
          <div className="relative z-10 self-center">
            <p className="text-[14px] font-medium">{about.eyebrow}</p>
            <h1 className="mt-2 max-w-xl text-balance text-[40px] font-semibold leading-[1.02] tracking-[-0.04em] sm:text-[60px]">{about.title}</h1>
            <p className="mt-8 max-w-lg text-pretty text-[17px] leading-relaxed">{about.body}</p>
            <ButtonLink to="/shop" variant="light" className="mt-8">
              Shop the range <ArrowRight aria-hidden />
            </ButtonLink>
          </div>
          <div className="relative mt-8 h-[380px] overflow-hidden rounded-card lg:mt-0 lg:ml-10 lg:h-auto">
            <Photo src={PHOTOS.about} position="50% 30%" className="absolute inset-0" />
          </div>
        </section>
      </Container>
      <Container className="mt-4">
        <dl className="grid gap-4 sm:grid-cols-3">
          {about.stats.map((s) => (
            <Card key={s.label} className="flex flex-col p-8">
              <dt className="order-2 text-muted">{s.label}</dt>
              <dd className="text-[48px] font-semibold tracking-[-0.04em] tabular-nums">{s.value}</dd>
            </Card>
          ))}
        </dl>
      </Container>
      <Container className="mt-24">
        <SectionHeading eyebrow="What we believe" title="Three rules every formula follows" />
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {about.values.map((v, i) => (
            <Card key={v.title} className="p-8">
              <span className="round grid size-10 place-items-center rounded-full bg-surface-2 font-semibold">{i + 1}</span>
              <h3 className="mt-8 text-[22px] font-medium tracking-[-0.02em]">{v.title}</h3>
              <p className="mt-2 leading-relaxed text-muted">{v.body}</p>
            </Card>
          ))}
        </div>
      </Container>
      <Container className="mt-24">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {promises.map((p) => (
            <li key={p.title} className="rounded-card border border-line-strong/60 p-6">
              <h3 className="text-[18px] font-medium">{p.title}</h3>
              <p className="mt-2 text-[15px] text-muted">{p.body}</p>
            </li>
          ))}
        </ul>
      </Container>
    </>
  )
}
