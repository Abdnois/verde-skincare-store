import { Heart, Menu, ShoppingCart } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink } from 'react-router'

import { brand, nav } from '../content'
import { cx } from '../lib/cx'
import { useStore } from '../lib/store'
import { Avatar, Logo } from './Art'
import { Drawer } from './Drawer'
import { CountBadge, IconButton, iconButtonClass } from './ui'

/** Site header. `overlay` sits on the hero photo in white; `solid` on the page. */
export function Nav({ tone = 'solid' }: { tone?: 'overlay' | 'solid' }) {
  const { count, wishlist, setCartOpen } = useStore()
  const [menu, setMenu] = useState(false)
  const glass = tone === 'overlay'
  const iconTone = glass ? 'glass' : 'solid'
  return (
    <header className={cx('relative z-20 flex items-center gap-4 lg:gap-10', glass && 'on-dark')}>
      <div className="flex items-center gap-3">
        <Logo tone={glass ? 'glass' : 'solid'} />
        <span className={cx(
              'hidden text-[22px] font-semibold tracking-[-0.03em] leading-none sm:inline',
              glass ? 'text-white' : 'text-ink-2',
            )}
              aria-label={`${brand.name} logo wordmark`}>{brand.name}</span>
      </div>
      <nav aria-label="Main" className="hidden md:block">
        <ul className="flex items-center gap-1">
          {nav.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  cx(
                    'inline-flex h-11 items-center rounded-pill px-4 text-[17px] transition-colors duration-200',
                    glass ? 'text-white hover:bg-white/15' : 'text-ink-2 hover:bg-ink/5',
                    isActive && (glass ? 'bg-white/20' : 'bg-white shadow-card'),
                  )
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <div className="flex items-center">
          <CountBadge count={wishlist.length} className="relative z-10 -mr-2 ring-0" />
          <Link to="/wishlist" aria-label={`Wishlist, ${wishlist.length} saved`} title="Wishlist" className={iconButtonClass(iconTone, 'lg')}>
            <Heart className="fill-current" aria-hidden />
          </Link>
        </div>
        <IconButton label={`Bag, ${count} item${count === 1 ? '' : 's'}`} tone={iconTone} size="lg" className="relative" onClick={() => setCartOpen(true)}>
          <ShoppingCart aria-hidden />
          {count > 0 && <CountBadge count={count} className="absolute -right-1 -top-1" />}
        </IconButton>
        <Link to="/orders" aria-label="Your account and orders" title="Your orders" className="round hidden rounded-full sm:block">
          <Avatar index={2} size={52} className="ring-[3px] ring-white" />
        </Link>
        <IconButton label="Open menu" tone={iconTone} size="lg" className="md:hidden" onClick={() => setMenu(true)}>
          <Menu aria-hidden />
        </IconButton>
      </div>
      <Drawer open={menu} onClose={() => setMenu(false)} title="Menu">
        <div className="flex items-center gap-3 pb-4">
          <Logo tone="solid" />
          <span className="text-[22px] font-semibold tracking-[-0.03em] leading-none text-ink-2" aria-label={`${brand.name} logo wordmark`}>{brand.name}</span>
        </div>
        <nav aria-label="Mobile" className="mt-2">
          <ul className="space-y-1">
            {[...nav, { label: 'Wishlist', to: '/wishlist' }, { label: 'Your orders', to: '/orders' }].map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  onClick={() => setMenu(false)}
                  className={({ isActive }) => cx('flex h-14 items-center rounded-field px-4 text-[20px] font-medium tracking-[-0.02em]', isActive ? 'bg-white shadow-card' : 'hover:bg-white/60')}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </Drawer>
    </header>
  )
}
