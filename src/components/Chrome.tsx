import { Check, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useState, type FormEvent } from 'react'
import { Link } from 'react-router'

import { footer, newsletter } from '../content'
import { postJson } from '../lib/api'
import { cx } from '../lib/cx'
import { useStore } from '../lib/store'
import { Logo } from './Art'
import { Button, Container, Input } from './ui'

export function Toaster() {
  const { toasts, dismissToast } = useStore()
  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex flex-col items-center gap-2 px-4">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className={cx('pointer-events-auto flex min-h-12 items-center gap-3 rounded-pill py-1.5 pl-5 pr-1.5 text-[14px] text-white shadow-float', t.tone === 'error' ? 'bg-danger' : 'bg-ink')}
            role="status"
          >
            {t.tone === 'success' && <Check className="size-4" aria-hidden />}
            {t.message}
            <button type="button" aria-label="Dismiss" onClick={() => dismissToast(t.id)} className="round grid size-10 place-items-center rounded-full hover:bg-white/15">
              <X className="size-4" aria-hidden />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

export function NewsletterForm({ className }: { className?: string }) {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [error, setError] = useState('')
  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setState('loading')
    try {
      await postJson('/api/newsletter', { email })
      setState('done')
    } catch (err) {
      setError((err as Error).message)
      setState('error')
    }
  }
  if (state === 'done')
    return (
      <p role="status" className={cx('flex h-12 items-center gap-2 font-medium', className)}>
        <Check className="size-5" aria-hidden /> You are on the list. First note lands next month.
      </p>
    )
  return (
    <form onSubmit={submit} noValidate className={className}>
      <div className="flex flex-col gap-2 sm:flex-row">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <Input
          id="newsletter-email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          invalid={state === 'error'}
          aria-invalid={state === 'error' || undefined}
          aria-describedby={state === 'error' ? 'newsletter-error' : undefined}
          onChange={(e) => {
            setEmail(e.target.value)
            if (state === 'error') setState('idle')
          }}
          className="rounded-pill px-5 sm:max-w-80"
        />
        <Button type="submit" loading={state === 'loading'}>
          Subscribe
        </Button>
      </div>
      {state === 'error' && (
        <p id="newsletter-error" className="mt-2 text-[13px] text-danger">
          {error}
        </p>
      )}
    </form>
  )
}

export function Footer() {
  return (
    <footer className="mt-24 pb-8">
      <Container>
        <div className="rounded-panel bg-surface p-8 shadow-card sm:p-12">
          <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr]">
            <div>
              <Logo tone="solid" withName />
              <p className="mt-5 max-w-sm text-muted">{footer.blurb}</p>
              <h2 className="mt-10 text-[22px] font-medium tracking-[-0.02em]">{newsletter.title}</h2>
              <p className="mb-4 mt-1 max-w-md text-[15px] text-muted">{newsletter.body}</p>
              <NewsletterForm />
            </div>
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
              {footer.columns.map((col) => (
                <div key={col.title}>
                  <h2 className="text-[14px] font-medium text-muted">{col.title}</h2>
                  <ul className="mt-3">
                    {col.links.map((l) => (
                      <li key={l.to}>
                        <Link to={l.to} className="inline-flex min-h-10 items-center text-[15px] text-ink-2 hover:text-ink hover:underline">
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-12 flex flex-wrap justify-between gap-4 border-t border-line pt-6 text-[13px] text-muted">
            <p>{footer.legal}</p>
          </div>
        </div>
      </Container>
    </footer>
  )
}
