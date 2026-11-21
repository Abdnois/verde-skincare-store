import { ChevronDown, Loader2, Minus, Plus, Star } from 'lucide-react'
import { useId, useState, type ComponentPropsWithoutRef, type ReactNode } from 'react'
import { Link } from 'react-router'

import { cx } from '../lib/cx'

/* ---------- Buttons ---------- */

export type ButtonVariant = 'primary' | 'secondary' | 'light' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

const base =
  'inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-pill font-medium transition-[background-color,color,border-color,transform,box-shadow] duration-200 ease-[var(--ease-soft)] active:scale-[0.97] data-[force~=pressed]:scale-[0.97] disabled:pointer-events-none disabled:opacity-45 aria-disabled:pointer-events-none aria-disabled:opacity-45 [&_svg]:size-[18px] [&_svg]:shrink-0'
const variants: Record<ButtonVariant, string> = {
  primary: 'bg-ink text-white hover:bg-ink-2 data-[force~=hover]:bg-ink-2',
  secondary: 'border border-line-strong bg-surface text-ink hover:border-ink data-[force~=hover]:border-ink',
  light: 'bg-white text-ink shadow-card hover:bg-surface-2 data-[force~=hover]:bg-surface-2',
  ghost: 'text-ink hover:bg-ink/5 data-[force~=hover]:bg-ink/5',
  danger: 'border border-danger/30 bg-danger-soft text-danger hover:border-danger data-[force~=hover]:border-danger',
}
// Heights pair with fields: sm 40, md 48, lg 56.
const sizes: Record<ButtonSize, string> = {
  sm: 'h-10 px-4 text-[14px]',
  md: 'h-12 px-6 text-[15px]',
  lg: 'h-14 px-7 text-[16px]',
}

export const buttonClass = (variant: ButtonVariant = 'primary', size: ButtonSize = 'md', className?: string) => cx(base, variants[variant], sizes[size], className)

type BtnProps = { variant?: ButtonVariant; size?: ButtonSize; loading?: boolean; force?: string }

export function Button({ variant, size, loading, force, className, children, type = 'button', ...rest }: BtnProps & ComponentPropsWithoutRef<'button'>) {
  return (
    <button type={type} data-force={force} aria-busy={loading || undefined} className={buttonClass(variant, size, className)} disabled={loading || rest.disabled} {...rest}>
      {loading && <Loader2 className="animate-spin" aria-hidden />}
      {children}
    </button>
  )
}

export function ButtonLink({ variant, size, force, className, children, to, ...rest }: BtnProps & { to: string } & Omit<ComponentPropsWithoutRef<typeof Link>, 'to'>) {
  return (
    <Link to={to} data-force={force} className={buttonClass(variant, size, className)} {...rest}>
      {children}
    </Link>
  )
}

/** White pill with a label and a black icon disc on the right, from the hero. */
export function ActionPill({ icon, force, className, children, loading, ...rest }: { icon: ReactNode; force?: string; loading?: boolean } & ComponentPropsWithoutRef<'button'>) {
  return (
    <button
      type="button"
      data-force={force}
      aria-busy={loading || undefined}
      disabled={loading || rest.disabled}
      className={cx(
        'group inline-flex h-[52px] items-center gap-6 rounded-pill bg-white py-1.5 pl-5 pr-1.5 text-[17px] font-medium text-ink shadow-card transition-[transform,box-shadow] duration-200 hover:shadow-float active:scale-[0.97] data-[force~=hover]:shadow-float data-[force~=pressed]:scale-[0.97] disabled:pointer-events-none disabled:opacity-45',
        className,
      )}
      {...rest}
    >
      {children}
      <span className="round grid size-10 place-items-center rounded-full bg-ink text-white transition-transform duration-300 ease-[var(--ease-spring)] group-hover:rotate-[-8deg] group-hover:scale-105 group-data-[force~=hover]:scale-105 [&_svg]:size-[19px]">
        {loading ? <Loader2 className="animate-spin" aria-hidden /> : icon}
      </span>
    </button>
  )
}

/** A circular icon button. `glass` sits on the hero photo, `solid` on white. */
export function IconButton({
  label,
  tone = 'solid',
  size = 'md',
  force,
  className,
  children,
  ...rest
}: { label: string; tone?: 'glass' | 'solid' | 'dark' | 'plain'; size?: 'sm' | 'md' | 'lg'; force?: string } & ComponentPropsWithoutRef<'button'>) {
  return (
    <button type="button" aria-label={label} title={label} data-force={force} className={iconButtonClass(tone, size, className)} {...rest}>
      {children}
    </button>
  )
}

export const iconButtonClass = (tone: 'glass' | 'solid' | 'dark' | 'plain' = 'solid', size: 'sm' | 'md' | 'lg' = 'md', className?: string) =>
  cx(
    'round inline-grid shrink-0 place-items-center rounded-full transition-[background-color,color,transform,border-color] duration-200 active:scale-95 data-[force~=pressed]:scale-95 disabled:pointer-events-none disabled:opacity-45',
    size === 'sm' && 'size-10 [&_svg]:size-[17px]',
    size === 'md' && 'size-12 [&_svg]:size-[20px]',
    size === 'lg' && 'size-[52px] [&_svg]:size-[21px]',
    tone === 'glass' && 'bg-white/30 text-white backdrop-blur-md hover:bg-white/45 data-[force~=hover]:bg-white/45',
    tone === 'solid' && 'bg-white text-ink shadow-card hover:bg-surface-2 data-[force~=hover]:bg-surface-2',
    tone === 'dark' && 'bg-ink text-white hover:bg-ink-2 data-[force~=hover]:bg-ink-2',
    tone === 'plain' && 'text-ink hover:bg-ink/5 data-[force~=hover]:bg-ink/5',
    className,
  )

export function CountBadge({ count, className }: { count: number; className?: string }) {
  if (count <= 0) return null
  return (
    <span aria-hidden className={cx('round inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-ink px-1.5 text-[11px] font-medium tabular-nums text-white ring-2 ring-white/70', className)}>
      {count > 99 ? '99+' : count}
    </span>
  )
}

export function TextLink({ to, children, className }: { to: string; children: ReactNode; className?: string }) {
  return (
    <Link to={to} className={cx('inline-flex min-h-10 items-center font-medium text-ink underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-ink', className)}>
      {children}
    </Link>
  )
}

/* ---------- Badges and chips ---------- */

export function Badge({ tone = 'neutral', children, className }: { tone?: 'neutral' | 'amber' | 'success' | 'danger' | 'dark'; children: ReactNode; className?: string }) {
  return (
    <span
      className={cx(
        'inline-flex h-7 items-center gap-1 rounded-pill px-3 text-[13px] font-medium',
        tone === 'neutral' && 'bg-surface-2 text-ink-2',
        tone === 'amber' && 'bg-amber-soft text-amber-ink',
        tone === 'success' && 'bg-success-soft text-success',
        tone === 'danger' && 'bg-danger-soft text-danger',
        tone === 'dark' && 'bg-ink text-white',
        className,
      )}
    >
      {children}
    </span>
  )
}

export function Chip({ selected, force, className, children, ...rest }: { selected?: boolean; force?: string } & ComponentPropsWithoutRef<'button'>) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      data-force={force}
      className={cx(
        'inline-flex h-10 shrink-0 items-center gap-2 rounded-pill border px-4 text-[14px] font-medium transition-colors duration-200 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-45',
        selected ? 'border-ink bg-ink text-white' : 'border-line-strong bg-surface text-ink hover:border-ink data-[force~=hover]:border-ink',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  )
}

/* ---------- Fields ---------- */

export const fieldClass = (invalid?: boolean, className?: string) =>
  cx(
    'h-12 w-full min-w-0 rounded-field border bg-surface px-4 text-[15px] text-ink placeholder:text-muted transition-colors duration-200 focus:outline-none focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-surface-2 disabled:text-muted',
    invalid ? 'border-danger focus:ring-2 focus:ring-danger/20' : 'border-line-strong hover:border-faint focus:border-ink focus:ring-2 focus:ring-ink/10 data-[force~=focus]:border-ink data-[force~=focus]:ring-2 data-[force~=focus]:ring-ink/10 data-[force~=hover]:border-faint',
    className,
  )

export function Field({ label, error, hint, children, className, id }: { label: string; error?: string; hint?: string; children: (props: { id: string; 'aria-invalid'?: boolean; 'aria-describedby'?: string }) => ReactNode; className?: string; id?: string }) {
  const auto = useId()
  const fid = id ?? auto
  const describedBy = error ? `${fid}-error` : hint ? `${fid}-hint` : undefined
  return (
    <div className={cx('flex flex-col gap-2', className)}>
      <label htmlFor={fid} className="text-[14px] font-medium text-ink-2">
        {label}
      </label>
      {children({ id: fid, 'aria-invalid': error ? true : undefined, 'aria-describedby': describedBy })}
      {error ? (
        <p id={`${fid}-error`} className="text-[13px] text-danger">
          {error}
        </p>
      ) : hint ? (
        <p id={`${fid}-hint`} className="text-[13px] text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  )
}

export function Input({ invalid, force, className, ...rest }: { invalid?: boolean; force?: string } & ComponentPropsWithoutRef<'input'>) {
  return <input data-force={force} className={fieldClass(invalid, className)} {...rest} />
}

export function Textarea({ invalid, force, className, ...rest }: { invalid?: boolean; force?: string } & ComponentPropsWithoutRef<'textarea'>) {
  return <textarea data-force={force} className={fieldClass(invalid, cx('h-auto min-h-32 py-3 leading-relaxed', className))} {...rest} />
}

export function Select({ invalid, force, className, children, ...rest }: { invalid?: boolean; force?: string } & ComponentPropsWithoutRef<'select'>) {
  return (
    <div className="relative">
      <select data-force={force} className={fieldClass(invalid, cx('appearance-none pr-11', className))} {...rest}>
        {children}
      </select>
      <ChevronDown aria-hidden className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-muted" />
    </div>
  )
}

export function Stepper({ value, onChange, min = 1, max = 20, label, size = 'md' }: { value: number; onChange: (v: number) => void; min?: number; max?: number; label: string; size?: 'sm' | 'md' }) {
  return (
    <div role="group" aria-label={label} className={cx('inline-grid items-center rounded-pill border border-line-strong bg-surface tabular-nums', size === 'sm' ? 'h-11 grid-cols-[42px_30px_42px] text-[14px]' : 'h-12 grid-cols-[48px_36px_48px] text-[15px]')}>
      <button type="button" aria-label={`Decrease ${label}`} disabled={value <= min} onClick={() => onChange(Math.max(min, value - 1))} className="round grid h-full place-items-center rounded-full text-ink transition-colors hover:bg-ink/5 disabled:opacity-35">
        <Minus className="size-4" aria-hidden />
      </button>
      <output aria-live="polite" className="text-center font-medium">
        {value}
      </output>
      <button type="button" aria-label={`Increase ${label}`} disabled={value >= max} onClick={() => onChange(Math.min(max, value + 1))} className="round grid h-full place-items-center rounded-full text-ink transition-colors hover:bg-ink/5 disabled:opacity-35">
        <Plus className="size-4" aria-hidden />
      </button>
    </div>
  )
}

/* ---------- Ratings ---------- */

export function Stars({ value, size = 14, className }: { value: number; size?: number; className?: string }) {
  return (
    <span className={cx('inline-flex items-center gap-0.5 text-ink', className)} role="img" aria-label={`Rated ${value.toFixed(1)} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} aria-hidden style={{ width: size, height: size }} className={i <= Math.round(value) ? 'fill-current' : 'text-line-strong'} strokeWidth={1.5} />
      ))}
    </span>
  )
}

export function RatingInput({ value, onChange, invalid, id }: { value: number; onChange: (v: number) => void; invalid?: boolean; id?: string }) {
  const [hover, setHover] = useState(0)
  const shown = hover || value
  return (
    <div id={id} role="radiogroup" aria-label="Rating" aria-invalid={invalid || undefined} className="flex gap-1" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          role="radio"
          aria-checked={value === i}
          aria-label={`${i} star${i > 1 ? 's' : ''}`}
          tabIndex={value === i || (!value && i === 1) ? 0 : -1}
          onMouseEnter={() => setHover(i)}
          onClick={() => onChange(i)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
              e.preventDefault()
              onChange(Math.min(5, (value || 0) + 1))
              ;(e.currentTarget.parentElement?.children[Math.min(4, value)] as HTMLElement | undefined)?.focus()
            }
            if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
              e.preventDefault()
              onChange(Math.max(1, (value || 2) - 1))
              ;(e.currentTarget.parentElement?.children[Math.max(0, value - 2)] as HTMLElement | undefined)?.focus()
            }
          }}
          className="round grid size-10 place-items-center rounded-full transition-transform hover:scale-110"
        >
          <Star aria-hidden className={cx('size-6', i <= shown ? 'fill-ink text-ink' : invalid ? 'text-danger' : 'text-line-strong')} strokeWidth={1.5} />
        </button>
      ))}
    </div>
  )
}

/* ---------- Layout and feedback ---------- */

export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cx('mx-auto w-full max-w-[1376px] px-4 sm:px-8', className)}>{children}</div>
}

export function Card({ className, children, as: As = 'div' }: { className?: string; children: ReactNode; as?: 'div' | 'section' | 'article' | 'aside' }) {
  return <As className={cx('rounded-card bg-surface shadow-card', className)}>{children}</As>
}

export function SectionHeading({ eyebrow, title, body, action, className, as: H = 'h2' }: { eyebrow?: string; title: string; body?: string; action?: ReactNode; className?: string; as?: 'h1' | 'h2' }) {
  return (
    <div className={cx('flex flex-wrap items-end justify-between gap-6', className)}>
      <div className="max-w-2xl">
        {eyebrow && <p className="mb-3 text-[14px] font-medium text-muted">{eyebrow}</p>}
        <H className="text-balance text-[34px] font-medium leading-[1.05] tracking-[-0.03em] sm:text-[48px]">{title}</H>
        {body && <p className="mt-4 text-pretty text-[17px] leading-relaxed text-muted">{body}</p>}
      </div>
      {action}
    </div>
  )
}

export function EmptyState({ icon, title, body, action }: { icon: ReactNode; title: string; body: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center px-6 py-16 text-center">
      <div className="round mb-5 grid size-16 place-items-center rounded-full bg-surface-2 text-ink [&_svg]:size-7">{icon}</div>
      <h2 className="text-[22px] font-medium tracking-[-0.02em]">{title}</h2>
      <p className="mt-2 max-w-sm text-pretty text-muted">{body}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}

export function Alert({ tone = 'danger', children }: { tone?: 'danger' | 'success' | 'neutral'; children: ReactNode }) {
  return (
    <div
      role={tone === 'danger' ? 'alert' : 'status'}
      className={cx(
        'rounded-field px-4 py-3 text-[14px]',
        tone === 'danger' && 'bg-danger-soft text-danger',
        tone === 'success' && 'bg-success-soft text-success',
        tone === 'neutral' && 'bg-surface-2 text-ink-2',
      )}
    >
      {children}
    </div>
  )
}

export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden className={cx('skeleton rounded-field', className)} />
}

export function Spinner({ className, label = 'Loading' }: { className?: string; label?: string }) {
  return (
    <span role="status" className={cx('inline-flex items-center gap-2 text-muted', className)}>
      <Loader2 className="size-5 animate-spin" aria-hidden />
      <span className="sr-only">{label}</span>
    </span>
  )
}

export function Accordion({ items, defaultOpen = -1 }: { items: { q: string; a: ReactNode }[]; defaultOpen?: number }) {
  const [open, setOpen] = useState(defaultOpen)
  const base = useId()
  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((item, i) => {
        const isOpen = open === i
        return (
          <div key={item.q}>
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`${base}-${i}`}
                onClick={() => setOpen(isOpen ? -1 : i)}
                className="flex min-h-14 w-full items-center justify-between gap-4 py-4 text-left text-[17px] font-medium"
              >
                {item.q}
                <ChevronDown aria-hidden className={cx('size-5 shrink-0 transition-transform duration-300', isOpen && 'rotate-180')} />
              </button>
            </h3>
            <div id={`${base}-${i}`} hidden={!isOpen} className="pb-5 pr-10 text-pretty leading-relaxed text-muted">
              {item.a}
            </div>
          </div>
        )
      })}
    </div>
  )
}

/** A selectable card backed by a native radio, so arrow keys and Space work. */
export function OptionCard({
  name,
  value,
  checked,
  onChange,
  title,
  detail,
  aside,
  force,
  disabled,
  className,
}: {
  name: string
  value: string
  checked: boolean
  onChange: (value: string) => void
  title: ReactNode
  detail?: ReactNode
  aside?: ReactNode
  force?: string
  disabled?: boolean
  className?: string
}) {
  return (
    <label
      data-force={force}
      className={cx(
        'group relative flex min-h-14 cursor-pointer items-center gap-4 rounded-[22px] border bg-surface px-5 py-4 transition-[border-color,box-shadow,background-color] duration-200 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ink data-[force~=focus]:outline-2 data-[force~=focus]:outline-offset-2 data-[force~=focus]:outline-ink has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-45',
        checked ? 'border-ink shadow-[inset_0_0_0_1px_var(--color-ink)]' : 'border-line-strong hover:border-faint data-[force~=hover]:border-faint',
        className,
      )}
    >
      <input type="radio" name={name} value={value} checked={checked} disabled={disabled} onChange={() => onChange(value)} className="peer sr-only" />
      <span aria-hidden className={cx('round grid size-5 shrink-0 place-items-center rounded-full border-2 transition-colors', checked ? 'border-ink' : 'border-line-strong')}>
        <span className={cx('round size-2.5 rounded-full bg-ink transition-transform duration-200', checked ? 'scale-100' : 'scale-0')} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-medium">{title}</span>
        {detail && <span className="block text-[14px] text-muted">{detail}</span>}
      </span>
      {aside && <span className="shrink-0 font-medium tabular-nums">{aside}</span>}
    </label>
  )
}

export function Breadcrumbs({ items }: { items: { label: string; to?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-[14px] text-muted">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, i) => (
          <li key={item.label} className="flex items-center gap-1.5">
            {i > 0 && <span aria-hidden>/</span>}
            {item.to ? (
              <Link to={item.to} className="inline-flex min-h-10 min-w-10 items-center justify-center hover:text-ink hover:underline">
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-ink-2">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
