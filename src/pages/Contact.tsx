import { CheckCircle2 } from 'lucide-react'
import { useState, type FormEvent } from 'react'

import { Accordion, Alert, Button, Card, Container, Field, Input, SectionHeading, Select, Textarea } from '../components/ui'
import { contact } from '../content'
import { fieldErrors, postJson, type FieldErrors } from '../lib/api'
import { useTitle } from '../lib/title'

const empty = { name: '', email: '', topic: '', order: '', message: '' }

export function Contact() {
  useTitle('Contact us')
  const [form, setForm] = useState(empty)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [ticket, setTicket] = useState<string | null>(null)
  const set = (k: keyof typeof form, v: string) => {
    setForm((f) => ({ ...f, [k]: v }))
    if (errors[k]) setErrors((e) => ({ ...e, [k]: '' }))
  }
  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await postJson<{ ticket: string }>('/api/contact', form)
      setTicket(res.ticket)
      setForm(empty)
    } catch (err) {
      const f = fieldErrors(err)
      setErrors(f)
      setError((err as Error).message)
      const first = Object.keys(f)[0]
      if (first) document.getElementById(`contact-${first}`)?.focus()
    } finally {
      setLoading(false)
    }
  }
  return (
    <Container className="mt-12">
      <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
        <div className="flex flex-col gap-4">
          <div className="wall-calm on-dark rounded-panel p-8 text-white shadow-card sm:p-12">
            <p className="text-[14px] font-medium">Contact Us</p>
            <h1 className="mt-3 text-balance text-[40px] font-semibold leading-[1.02] tracking-[-0.04em] sm:text-[52px]">{contact.title}</h1>
            <p className="mt-4 max-w-md text-pretty text-[17px] leading-relaxed">{contact.body}</p>
          </div>
          <Card className="p-8">
            <dl className="space-y-4">
              {contact.details.map((d) => (
                <div key={d.label} className="flex justify-between gap-4 border-b border-line pb-4 last:border-0 last:pb-0">
                  <dt className="text-muted">{d.label}</dt>
                  <dd className="text-right font-medium">{d.value}</dd>
                </div>
              ))}
            </dl>
          </Card>
        </div>
        <Card className="p-6 sm:p-10">
          {ticket ? (
            <div role="status" className="flex h-full flex-col items-center justify-center py-12 text-center">
              <CheckCircle2 className="size-14 text-success" strokeWidth={1.5} aria-hidden />
              <h2 className="mt-5 text-[30px] font-medium tracking-[-0.03em]">Message sent</h2>
              <p className="mt-2 max-w-sm text-muted">
                Your reference is <strong className="text-ink">{ticket}</strong>. We reply within one working day.
              </p>
              <Button variant="secondary" className="mt-8" onClick={() => setTicket(null)}>
                Send another message
              </Button>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="grid gap-5 sm:grid-cols-2">
              <h2 className="text-[24px] font-medium tracking-[-0.02em] sm:col-span-2">Send us a message</h2>
              <Field label="Name" error={errors.name} id="contact-name">
                {(p) => <Input {...p} autoComplete="name" value={form.name} invalid={!!errors.name} onChange={(e) => set('name', e.target.value)} />}
              </Field>
              <Field label="Email" error={errors.email} id="contact-email">
                {(p) => <Input {...p} type="email" autoComplete="email" value={form.email} invalid={!!errors.email} onChange={(e) => set('email', e.target.value)} />}
              </Field>
              <Field label="Topic" error={errors.topic} id="contact-topic">
                {(p) => (
                  <Select {...p} value={form.topic} invalid={!!errors.topic} onChange={(e) => set('topic', e.target.value)}>
                    <option value="">Choose a topic</option>
                    {contact.topics.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </Select>
                )}
              </Field>
              <Field label="Order number" hint="Optional, like DL-4F2K9A" id="contact-order">
                {(p) => <Input {...p} value={form.order} onChange={(e) => set('order', e.target.value)} />}
              </Field>
              <Field label="Message" error={errors.message} id="contact-message" className="sm:col-span-2">
                {(p) => <Textarea {...p} rows={6} value={form.message} invalid={!!errors.message} onChange={(e) => set('message', e.target.value)} />}
              </Field>
              {error && (
                <div className="sm:col-span-2">
                  <Alert>{error}</Alert>
                </div>
              )}
              <div className="sm:col-span-2">
                <Button type="submit" size="lg" loading={loading}>
                  Send message
                </Button>
              </div>
            </form>
          )}
        </Card>
      </div>
      <div className="mt-24 grid gap-8 lg:grid-cols-[1fr_1.4fr]">
        <SectionHeading eyebrow="Before you write" title="Questions we hear most" />
        <Accordion items={contact.faq} />
      </div>
    </Container>
  )
}
