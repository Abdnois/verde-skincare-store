import { Droplet } from 'lucide-react'

import { ButtonLink, Card, Container } from '../components/ui'
import { notFound } from '../content'
import { useTitle } from '../lib/title'

export function NotFound() {
  useTitle('Page not found')
  return (
    <Container className="mt-12">
      <Card className="py-10">
        <p className="text-center text-[96px] font-semibold leading-none tracking-[-0.05em] text-faint sm:text-[160px]" aria-hidden>
          404
        </p>
        <div className="round mb-5 grid size-16 place-items-center rounded-full bg-surface-2 text-ink">
          <Droplet aria-hidden />
        </div>
        <h1 className="mx-auto mt-5 max-w-sm text-center text-[22px] font-medium tracking-[-0.02em]">
          {notFound.title}
        </h1>
        <p className="mt-2 max-w-sm text-center text-pretty text-muted">
          {notFound.body}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <ButtonLink to="/shop">Shop products</ButtonLink>
          <ButtonLink to="/quiz" variant="secondary">
            Take the quiz
          </ButtonLink>
        </div>
      </Card>
    </Container>
  )
}
