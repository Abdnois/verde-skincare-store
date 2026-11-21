import { X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useId, type ReactNode, type RefObject } from 'react'

import { cx } from '../lib/cx'
import { useFocusTrap } from '../lib/focus'
import { IconButton } from './ui'

/** Side sheet with focus trap, Escape to close and focus restore. Focus goes
 *  back to the opener as soon as it closes, not after the exit animation. */
export function Drawer({ open, onClose, title, children, footer, side = 'right', className }: { open: boolean; onClose: () => void; title: string; children: ReactNode; footer?: ReactNode; side?: 'right' | 'left'; className?: string }) {
  const ref = useFocusTrap<HTMLDivElement>(open, onClose)
  return (
    <div className={cx('fixed inset-0 z-50', !open && 'pointer-events-none')}>
      <AnimatePresence>
        {open && (
          <DrawerPanel panelRef={ref} onClose={onClose} title={title} footer={footer} side={side} className={className}>
            {children}
          </DrawerPanel>
        )}
      </AnimatePresence>
    </div>
  )
}

function DrawerPanel({ panelRef, onClose, title, children, footer, side, className }: { panelRef: RefObject<HTMLDivElement | null>; onClose: () => void; title: string; children: ReactNode; footer?: ReactNode; side: 'right' | 'left'; className?: string }) {
  const titleId = useId()
  const x = side === 'right' ? '100%' : '-100%'
  return (
    <>
      <motion.div className="absolute inset-0 bg-ink/35 backdrop-blur-[2px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} onClick={onClose} />
      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        initial={{ x }}
        animate={{ x: 0 }}
        exit={{ x }}
        transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
        className={cx(
          'absolute top-0 flex h-full w-full max-w-[440px] flex-col bg-page shadow-drawer sm:top-3 sm:h-[calc(100%-24px)] sm:rounded-panel',
          side === 'right' ? 'right-0 sm:right-3' : 'left-0 sm:left-3',
          className,
        )}
      >
        <div className="flex items-center justify-between px-6 pb-2 pt-5">
          <h2 id={titleId} className="text-[22px] font-medium tracking-[-0.02em]">
            {title}
          </h2>
          <IconButton label="Close" size="sm" onClick={onClose}>
            <X aria-hidden />
          </IconButton>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">{children}</div>
        {footer && <div className="border-t border-line px-6 py-5">{footer}</div>}
      </motion.div>
    </>
  )
}
