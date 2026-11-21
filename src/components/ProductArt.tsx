import { useId } from 'react'

import { PHOTOS, type Art, type Product } from '../content'
import { cx } from '../lib/cx'

/**
 * Packshot for a product. Renders the photo from PHOTOS.products when one is
 * set; otherwise an SVG still life drawn from the product's `art` recipe.
 */
export function ProductArt({ product, className, tilt = true }: { product: Product; className?: string; tilt?: boolean }) {
  const photo = PHOTOS.products[product.slug]
  if (photo) return <img src={photo} alt="" width={720} height={720} loading="lazy" decoding="async" className={cx('h-full w-full object-contain', className)} />
  return <Packshot art={product.art} label={product.category} className={className} tilt={tilt} />
}

export function Packshot({ art, label, className, tilt = true }: { art: Art; label: string; className?: string; tilt?: boolean }) {
  const raw = useId().replace(/:/g, '')
  const id = (s: string) => `${raw}-${s}`
  return (
    <svg viewBox="0 0 200 200" className={cx('h-full w-full', className)} aria-hidden>
      <defs>
        <linearGradient id={id('gloss')} x1="0" x2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.0" />
          <stop offset="0.18" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="0.32" stopColor="#fff" stopOpacity="0.05" />
          <stop offset="0.8" stopColor="#000" stopOpacity="0.0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.14" />
        </linearGradient>
        <linearGradient id={id('metal')} x1="0" x2="1">
          <stop offset="0" stopColor="#8a6430" />
          <stop offset="0.3" stopColor="#f3d79a" />
          <stop offset="0.55" stopColor="#c69447" />
          <stop offset="1" stopColor="#7a5524" />
        </linearGradient>
        <linearGradient id={id('liquid')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={art.fill} stopOpacity="0.85" />
          <stop offset="1" stopColor={art.fill} />
        </linearGradient>
        <radialGradient id={id('shadow')}>
          <stop offset="0" stopColor="#2d3329" stopOpacity="0.22" />
          <stop offset="1" stopColor="#2d3329" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="100" cy="182" rx="58" ry="7" fill={`url(#${id('shadow')})`} />
      {art.kind === 'dropper' && <Dropper art={art} id={id} />}
      {art.kind === 'tube' && <Tube art={art} id={id} tilt={tilt} />}
      {art.kind === 'jar' && <Jar art={art} id={id} />}
      {art.kind === 'pads' && <Pads art={art} id={id} tilt={tilt} />}
      {art.kind === 'pump' && <Pump art={art} id={id} />}
      {art.kind === 'mist' && <Mist art={art} id={id} />}
      {art.kind === 'stick' && <Stick art={art} id={id} tilt={tilt} />}
      <title>{label}</title>
    </svg>
  )
}

type P = { art: Art; id: (s: string) => string; tilt?: boolean }

function Label({ x, y, w, h, small }: { x: number; y: number; w: number; h: number; small?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="2" fill="#f7f8f3" />
      <text x={x + w / 2} y={y + h / 2} textAnchor="middle" dominantBaseline="central" fontSize={small ? 5 : 6.5} fontWeight="600" letterSpacing="1.4" fill="#292e28" fontFamily="Outfit, sans-serif">
        VERDÉ
      </text>
      <rect x={x + w * 0.22} y={y + h * 0.52} width={w * 0.56} height="1.2" fill="#292e28" opacity="0.5" />
      <rect x={x + w * 0.3} y={y + h * 0.66} width={w * 0.4} height="1" fill="#292e28" opacity="0.3" />
    </g>
  )
}

function Dropper({ art, id }: P) {
  return (
    <g>
      {/* bulb + pipette */}
      <rect x="92" y="18" width="16" height="26" rx="8" fill="#f7f4ef" />
      <rect x="92" y="18" width="16" height="26" rx="8" fill={`url(#${id('gloss')})`} />
      <rect x="85" y="42" width="30" height="24" rx="3" fill={`url(#${id('metal')})`} />
      <rect x="96" y="66" width="8" height="14" fill="#fff" opacity="0.5" />
      {/* bottle */}
      <rect x="66" y="74" width="68" height="106" rx="12" fill="#efe9e0" opacity="0.5" />
      <rect x="70" y="96" width="60" height="80" rx="9" fill={`url(#${id('liquid')})`} />
      <rect x="84" y="66" width="32" height="12" rx="3" fill={art.cap} opacity="0.9" />
      <Label x={76} y={108} w={48} h={40} />
      <rect x="66" y="74" width="68" height="106" rx="12" fill={`url(#${id('gloss')})`} />
      <rect x="66" y="74" width="68" height="106" rx="12" fill="none" stroke="#fff" strokeOpacity="0.7" strokeWidth="1.2" />
    </g>
  )
}

function Tube({ art, id, tilt }: P) {
  return (
    <g transform={tilt ? 'rotate(-28 100 100)' : undefined}>
      <path d="M70 28 h60 l-6 120 h-48 z" fill={art.body ?? art.fill} />
      <rect x="68" y="20" width="64" height="12" rx="2" fill={art.body ?? art.fill} />
      <path d="M68 22 h64" stroke="#000" strokeOpacity="0.12" strokeWidth="1" strokeDasharray="2 2" />
      <path d="M70 28 h60 l-6 120 h-48 z" fill={`url(#${id('gloss')})`} />
      <rect x="80" y="70" width="40" height="52" rx="2" fill="#fbfaf7" opacity="0.92" />
      <text x="100" y="86" textAnchor="middle" fontSize="6" fontWeight="600" letterSpacing="1.3" fill="#292e28" fontFamily="Outfit, sans-serif">
        VERDÉ
      </text>
      <rect x="88" y="92" width="24" height="1.2" fill="#292e28" opacity="0.5" />
      <rect x="90" y="97" width="20" height="1" fill="#292e28" opacity="0.3" />
      <rect x="78" y="148" width="44" height="28" rx="5" fill={art.cap} />
      <rect x="78" y="148" width="44" height="28" rx="5" fill={`url(#${id('gloss')})`} />
    </g>
  )
}

function Jar({ art, id }: P) {
  return (
    <g>
      <rect x="44" y="96" width="112" height="80" rx="16" fill={art.body ?? '#f5f2ee'} />
      <rect x="50" y="104" width="100" height="66" rx="12" fill={art.fill} opacity="0.85" />
      <Label x={72} y={120} w={56} h={34} />
      <rect x="44" y="96" width="112" height="80" rx="16" fill={`url(#${id('gloss')})`} />
      <rect x="40" y="68" width="120" height="32" rx="9" fill={art.cap} />
      <rect x="40" y="68" width="120" height="32" rx="9" fill={`url(#${id('gloss')})`} />
      <rect x="40" y="94" width="120" height="3" fill="#000" opacity="0.06" />
    </g>
  )
}

function Pads({ art, id, tilt }: P) {
  return (
    <g>
      <rect x="48" y="104" width="104" height="72" rx="14" fill={art.body ?? '#efe2c4'} opacity="0.7" />
      <rect x="54" y="112" width="92" height="58" rx="10" fill={art.fill} />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x="56" y={114 + i * 4} width="88" height="2" rx="1" fill="#fff" opacity="0.7" />
      ))}
      <Label x={74} y={134} w={52} h={28} small />
      <rect x="48" y="104" width="104" height="72" rx="14" fill={`url(#${id('gloss')})`} />
      <g transform={tilt ? 'rotate(-14 100 70)' : undefined}>
        <rect x="42" y="50" width="116" height="30" rx="10" fill={art.cap} />
        <rect x="42" y="50" width="116" height="30" rx="10" fill={`url(#${id('gloss')})`} />
        <text x="100" y="69" textAnchor="middle" fontSize="6" fontWeight="600" letterSpacing="1.6" fill="#5d6a54" fontFamily="Outfit, sans-serif">
          CALMING PADS
        </text>
      </g>
    </g>
  )
}

function Pump({ art, id }: P) {
  return (
    <g>
      <rect x="86" y="18" width="40" height="10" rx="3" fill={art.cap} />
      <rect x="94" y="26" width="12" height="20" fill={art.cap} />
      <rect x="84" y="44" width="32" height="14" rx="3" fill={art.cap} />
      <rect x="68" y="56" width="64" height="124" rx="14" fill={art.body ?? art.fill} />
      <rect x="72" y="78" width="56" height="98" rx="10" fill={art.fill} opacity="0.9" />
      <Label x={78} y={100} w={44} h={42} />
      <rect x="68" y="56" width="64" height="124" rx="14" fill={`url(#${id('gloss')})`} />
    </g>
  )
}

function Mist({ art, id }: P) {
  return (
    <g>
      <rect x="86" y="14" width="28" height="30" rx="6" fill={art.cap} />
      <rect x="86" y="14" width="28" height="30" rx="6" fill={`url(#${id('gloss')})`} />
      <rect x="90" y="42" width="20" height="8" fill={`url(#${id('metal')})`} />
      <rect x="72" y="48" width="56" height="132" rx="14" fill="#f3ede7" opacity="0.6" />
      <rect x="76" y="70" width="48" height="106" rx="10" fill={`url(#${id('liquid')})`} />
      <Label x={80} y={98} w={40} h={44} small />
      <rect x="72" y="48" width="56" height="132" rx="14" fill={`url(#${id('gloss')})`} />
      <rect x="72" y="48" width="56" height="132" rx="14" fill="none" stroke="#fff" strokeOpacity="0.7" strokeWidth="1.2" />
    </g>
  )
}

function Stick({ art, id, tilt }: P) {
  return (
    <g transform={tilt ? 'rotate(18 100 100)' : undefined}>
      <rect x="84" y="20" width="32" height="40" rx="10" fill={`url(#${id('metal')})`} opacity="0.85" />
      <rect x="80" y="56" width="40" height="124" rx="8" fill={art.body ?? art.fill} />
      <rect x="84" y="86" width="32" height="60" rx="3" fill={art.fill} />
      <text x="100" y="118" textAnchor="middle" fontSize="5.5" fontWeight="600" letterSpacing="1.2" fill="#292e28" fontFamily="Outfit, sans-serif" transform="rotate(-90 100 116)">
        VERDÉ EYE
      </text>
      <rect x="80" y="56" width="40" height="124" rx="8" fill={`url(#${id('gloss')})`} />
      <rect x="80" y="56" width="40" height="8" fill={art.cap} />
    </g>
  )
}
