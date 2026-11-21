import { useId } from 'react'
import { Link } from 'react-router'

import { brand, PHOTOS } from '../content'
import { cx } from '../lib/cx'

/** Dewdrop mark in a circle. `tone="glass"` sits on the hero photo. */
export function Logo({ tone = 'glass', withName = false, className }: { tone?: 'glass' | 'solid'; withName?: boolean; className?: string }) {
  return (
    <Link to="/" aria-label={`${brand.name} home`} className={cx('inline-flex items-center gap-3', className)}>
      <span className={cx('round grid size-[52px] place-items-center rounded-full', tone === 'glass' ? 'bg-white/35 backdrop-blur-md' : 'bg-white shadow-card')}>
        <LogoMark className="size-7" />
      </span>
      {withName && <span className="text-[22px] font-semibold tracking-[-0.03em]">{brand.name}</span>}
    </Link>
  )
}

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path d="M16 3c4.6 6.2 9 11.2 9 16.4A9 9 0 0 1 7 19.4C7 14.2 11.4 9.2 16 3z" fill="#141210" />
      <path d="M12.4 19.6a4 4 0 0 0 3 3.6" stroke="#fff" strokeWidth="2" strokeLinecap="round" fill="none" />
      <circle cx="24.5" cy="7.5" r="2.5" fill="#141210" />
    </svg>
  )
}

const faces = [
  { bg: '#cdbfb3', skin: '#e9c7ad', hair: '#3d2a20', style: 'bob' },
  { bg: '#b9c3b0', skin: '#c99878', hair: '#1f1814', style: 'curls' },
  { bg: '#d8c7bb', skin: '#f0d2bd', hair: '#8a4b2a', style: 'bun' },
  { bg: '#c3b5ab', skin: '#a8714f', hair: '#16110e', style: 'short' },
] as const

/** Customer avatar: a photo from PHOTOS.avatars, or an illustrated face. */
export function Avatar({ index = 0, size = 48, className, ring = true }: { index?: number; size?: number; className?: string; ring?: boolean }) {
  const f = faces[index % faces.length]
  const clip = useId().replace(/:/g, '')
  const photo = PHOTOS.avatars.length ? PHOTOS.avatars[index % PHOTOS.avatars.length] : undefined
  if (photo)
    return <img src={photo} alt="" width={size} height={size} loading="lazy" decoding="async" className={cx('round shrink-0 rounded-full object-cover', ring && 'ring-[3px] ring-white/80', className)} style={{ width: size, height: size }} />
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} className={cx('round shrink-0 rounded-full', ring && 'ring-[3px] ring-white/80', className)} aria-hidden>
      <clipPath id={clip}>
        <circle cx="24" cy="24" r="24" />
      </clipPath>
      <g clipPath={`url(#${clip})`}>
        <rect width="48" height="48" fill={f.bg} />
        {f.style === 'curls' && <circle cx="24" cy="20" r="15" fill={f.hair} />}
        {f.style === 'bob' && <path d="M8 26c0-12 7-18 16-18s16 6 16 18v8H8z" fill={f.hair} />}
        <path d="M10 48c1-9 7-13 14-13s13 4 14 13z" fill={index % 2 ? '#3f4a3c' : '#5b4c42'} />
        <rect x="20" y="28" width="8" height="9" rx="3" fill={f.skin} />
        <ellipse cx="24" cy="22" rx="8.5" ry="10" fill={f.skin} />
        {f.style === 'bun' && (
          <>
            <circle cx="24" cy="8" r="5" fill={f.hair} />
            <path d="M15 21c0-7 4-10 9-10s9 3 9 10c-2-4-5-6-9-6s-7 2-9 6z" fill={f.hair} />
          </>
        )}
        {f.style === 'short' && <path d="M15 20c0-7 4-10 9-10s9 3 9 10c-1-3-4-5-9-5s-8 2-9 5z" fill={f.hair} />}
        {f.style === 'bob' && <path d="M15.5 20c1-6 4-8 8.5-8s7.5 2 8.5 8c-3-3-6-4-8.5-4s-5.5 1-8.5 4z" fill={f.hair} />}
        <circle cx="21" cy="22" r="0.9" fill="#2c2420" />
        <circle cx="27" cy="22" r="0.9" fill="#2c2420" />
        <path d="M22 27c1.2.8 2.8.8 4 0" stroke="#9a5b4a" strokeWidth="0.9" fill="none" strokeLinecap="round" />
      </g>
    </svg>
  )
}

export function AvatarStack({ size = 56, className }: { size?: number; className?: string }) {
  // Triangle cluster as in a review badge: one on top, two below.
  return (
    <div className={cx('relative', className)} style={{ width: size * 2.1, height: size * 1.75 }} aria-hidden>
      <Avatar index={0} size={size} className="absolute left-[30%] top-0" />
      <Avatar index={1} size={size} className="absolute bottom-0 left-0" />
      <Avatar index={3} size={size} className="absolute bottom-[6%] right-0" />
    </div>
  )
}

/** A photo from PHOTOS, or the SVG still life when that entry is empty. */
export function Photo({ src, alt = '', className, position = 'center', eager }: { src?: string; alt?: string; className?: string; position?: string; eager?: boolean }) {
  if (!src) return <HeroArt className={className} />
  return <img src={src} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async" className={cx('h-full w-full object-cover', className)} style={{ objectPosition: position }} />
}

/** The serum on its own, floating: the photo packshot when PHOTOS has one,
 *  else the SVG still life. Used on the quiz and routine panels. */
export function SerumStill({ className }: { className?: string }) {
  const src = PHOTOS.products['centella-facial-serum']
  if (!src) return <HeroArt className={className} />
  return (
    <div className={cx('pointer-events-none grid place-items-end', className)} aria-hidden>
      <img src={src} alt="" loading="lazy" decoding="async" className="h-full w-full animate-float object-contain object-bottom drop-shadow-[0_30px_40px_rgb(30_22_16/0.35)]" />
    </div>
  )
}

/** The SVG still life: pipette dripping golden serum into an open bottle, over
 *  centella leaves. The fallback whenever a photo slot in PHOTOS is empty. */
export function HeroArt({ className }: { className?: string }) {
  const raw = useId().replace(/:/g, '')
  const id = (s: string) => `${raw}-${s}`
  return (
    <div className={cx('pointer-events-none flex items-end justify-center [container-type:size]', className)} aria-hidden>
      {/* the stage keeps the art's 600:760 ratio so the pipette always sits over the bottle */}
      <div className="relative aspect-[600/760]" style={{ width: 'min(100cqw, calc(100cqh * 600 / 760))' }}>
      <svg viewBox="0 0 600 760" className="h-full w-full">
        <defs>
          <radialGradient id={id('glow')} cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="#f2e6da" stopOpacity="0.9" />
            <stop offset="0.42" stopColor="#e3d5c9" stopOpacity="0.32" />
            <stop offset="0.72" stopColor="#d9ccc1" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={id('serum')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f2c25f" />
            <stop offset="0.55" stopColor="#d89a2e" />
            <stop offset="1" stopColor="#b8761d" />
          </linearGradient>
          <linearGradient id={id('glass')} x1="0" x2="1">
            <stop offset="0" stopColor="#fff" stopOpacity="0.1" />
            <stop offset="0.14" stopColor="#fff" stopOpacity="0.75" />
            <stop offset="0.24" stopColor="#fff" stopOpacity="0.08" />
            <stop offset="0.82" stopColor="#fff" stopOpacity="0.05" />
            <stop offset="0.92" stopColor="#fff" stopOpacity="0.5" />
            <stop offset="1" stopColor="#fff" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id={id('gold')} x1="0" x2="1">
            <stop offset="0" stopColor="#7d5520" />
            <stop offset="0.28" stopColor="#f6dca0" />
            <stop offset="0.5" stopColor="#d09a45" />
            <stop offset="0.78" stopColor="#a06c2a" />
            <stop offset="1" stopColor="#6c4818" />
          </linearGradient>
          <linearGradient id={id('leaf')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#a9b89f" />
            <stop offset="1" stopColor="#6f8566" />
          </linearGradient>
          <radialGradient id={id('floor')}>
            <stop offset="0" stopColor="#4a3a2e" stopOpacity="0.35" />
            <stop offset="1" stopColor="#4a3a2e" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle cx="300" cy="360" r="300" fill={`url(#${id('glow')})`} />

        {/* centella leaves */}
        <g opacity="0.92">
          <Leaf x={110} y={640} r={78} rot={-28} fill={`url(#${id('leaf')})`} />
          <Leaf x={500} y={620} r={70} rot={24} fill={`url(#${id('leaf')})`} />
          <Leaf x={190} y={700} r={60} rot={8} fill={`url(#${id('leaf')})`} />
          <Leaf x={430} y={706} r={56} rot={-10} fill={`url(#${id('leaf')})`} />
        </g>

        <ellipse cx="300" cy="742" rx="150" ry="16" fill={`url(#${id('floor')})`} />

        {/* open bottle */}
        <g>
          <rect x="268" y="398" width="64" height="40" rx="6" fill="#efe9e1" opacity="0.55" />
          <rect x="262" y="392" width="76" height="12" rx="4" fill="#fff" opacity="0.55" />
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x="266" y={410 + i * 7} width="68" height="2" rx="1" fill="#fff" opacity="0.6" />
          ))}
          <path d="M268 436 h64 q48 10 54 56 v204 q0 40 -40 40 h-92 q-40 0 -40 -40 v-204 q6 -46 54 -56z" fill="#efe6dc" opacity="0.4" />
          <path d="M226 520 h148 v176 q0 32 -32 32 h-84 q-32 0 -32 -32z" fill={`url(#${id('serum')})`} />
          <ellipse cx="300" cy="520" rx="74" ry="6" fill="#f7d27c" />
          <rect x="252" y="560" width="96" height="104" rx="6" fill="#fbfaf7" opacity="0.92" />
          <text x="300" y="594" textAnchor="middle" fontSize="15" fontWeight="600" letterSpacing="4" fill="#2c2825" fontFamily="Outfit, sans-serif">
            VERDÉ
          </text>
          <rect x="270" y="606" width="60" height="2" fill="#2c2825" opacity="0.5" />
          <text x="300" y="628" textAnchor="middle" fontSize="8" letterSpacing="1.5" fill="#675e57" fontFamily="Outfit, sans-serif">
            CENTELLA 72%
          </text>
          <text x="300" y="646" textAnchor="middle" fontSize="7" letterSpacing="1" fill="#675e57" fontFamily="Outfit, sans-serif">
            55 ML
          </text>
          <path d="M268 436 h64 q48 10 54 56 v204 q0 40 -40 40 h-92 q-40 0 -40 -40 v-204 q6 -46 54 -56z" fill={`url(#${id('glass')})`} />
          <path d="M268 436 h64 q48 10 54 56 v204 q0 40 -40 40 h-92 q-40 0 -40 -40 v-204 q6 -46 54 -56z" fill="none" stroke="#fff" strokeOpacity="0.75" strokeWidth="2" />
        </g>
      </svg>

      {/* pipette floats above the bottle; the drop falls on a loop */}
      <div className="absolute left-1/2 top-[4%] h-[52%] w-[22%] -translate-x-1/2">
        <div className="h-full w-full origin-bottom animate-float">
          <svg viewBox="0 0 120 400" className="h-full w-full" preserveAspectRatio="xMidYMin meet">
            <defs>
              <linearGradient id={id('bulb')} x1="0" x2="1">
                <stop offset="0" stopColor="#e9e4dd" />
                <stop offset="0.3" stopColor="#ffffff" />
                <stop offset="1" stopColor="#d7d0c7" />
              </linearGradient>
            </defs>
            <rect x="38" y="8" width="44" height="86" rx="22" fill={`url(#${id('bulb')})`} />
            <rect x="26" y="88" width="68" height="62" rx="8" fill={`url(#${id('gold')})`} />
            <rect x="26" y="102" width="68" height="3" fill="#5a3c12" opacity="0.25" />
            <rect x="26" y="134" width="68" height="3" fill="#5a3c12" opacity="0.25" />
            <path d="M52 150 h16 v200 q0 14 -8 22 q-8 -8 -8 -22z" fill="#f5efe7" opacity="0.55" />
            <path d="M54 250 h12 v100 q0 10 -6 16 q-6 -6 -6 -16z" fill={`url(#${id('serum')})`} />
            <path d="M52 150 h16 v200 q0 14 -8 22 q-8 -8 -8 -22z" fill="none" stroke="#fff" strokeOpacity="0.8" strokeWidth="1.5" />
          </svg>
          <span className="round absolute left-1/2 top-[94%] block size-3 -translate-x-1/2 animate-drip rounded-full bg-gradient-to-b from-[#f6cf72] to-[#c98a26] shadow-[inset_-1px_-2px_2px_rgb(0_0_0/0.15)]" />
        </div>
      </div>
      </div>
    </div>
  )
}

function Leaf({ x, y, r, rot, fill }: { x: number; y: number; r: number; rot: number; fill: string }) {
  // Centella's kidney-shaped leaf with scalloped edge and a stem.
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <path d={`M0 ${r * 0.2} q-${r * 0.05} ${r * 0.6} ${r * 0.02} ${r * 1.2}`} stroke="#6f8566" strokeWidth="4" fill="none" />
      <path
        d={`M0 ${r * 0.15} C ${-r * 0.3} ${-r * 0.1}, ${-r} ${-r * 0.1}, ${-r} ${-r * 0.55} C ${-r} ${-r * 1.05}, ${-r * 0.35} ${-r * 1.15}, 0 ${-r * 0.8} C ${r * 0.35} ${-r * 1.15}, ${r} ${-r * 1.05}, ${r} ${-r * 0.55} C ${r} ${-r * 0.1}, ${r * 0.3} ${-r * 0.1}, 0 ${r * 0.15} z`}
        fill={fill}
      />
      {[-60, -30, 0, 30, 60].map((a) => (
        <path key={a} d={`M0 ${r * 0.1} L ${Math.sin((a * Math.PI) / 180) * r * 0.8} ${-Math.cos((a * Math.PI) / 180) * r * 0.75}`} stroke="#e4ead9" strokeOpacity="0.45" strokeWidth="1.5" />
      ))}
    </g>
  )
}
