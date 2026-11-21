// Mirror of the @theme tokens in src/styles.css, for the style guide.
export const colorTokens = [
  { group: 'Surfaces', items: [
    { name: 'page', hex: '#f5f3ec', use: 'Page background' },
    { name: 'surface', hex: '#fffef8', use: 'Cards, fields' },
    { name: 'surface-2', hex: '#dde3d4', use: 'Packshot wells, subtle fills' },
    { name: 'sand', hex: '#e5e8de', use: 'Skeletons, display numerals' },
    { name: 'line', hex: '#d4dccb', use: 'Dividers' },
    { name: 'line-strong', hex: '#c2cab0', use: 'Field and chip borders' },
  ] },
  { group: 'Ink', items: [
    { name: 'ink', hex: '#292e28', use: 'Text, primary buttons (deep olive)' },
    { name: 'ink-2', hex: '#3f463d', use: 'Secondary text, hover' },
    { name: 'muted', hex: '#64714e', use: 'Supporting text (WCAG AA 4.5:1 on page and surface)' },
    { name: 'faint', hex: '#8d9583', use: 'Hover borders only, never text' },
  ] },
  { group: 'Hero wall', items: [
    { name: 'hero-deep', hex: '#4d5a44', use: 'Behind white copy (AA)' },
    { name: 'hero', hex: '#68765d', use: 'Wall midtone (deep olive)' },
    { name: 'hero-light', hex: '#93a288', use: 'Light falloff (sage)' },
  ] },
  { group: 'Accents', items: [
    { name: 'amber', hex: '#b8944a', use: 'Serum, progress fills' },
    { name: 'amber-ink', hex: '#6b4f12', use: 'Text on amber-soft' },
    { name: 'amber-soft', hex: '#f1e6c8', use: 'Badge fill' },
    { name: 'sage', hex: '#a3b095', use: 'Centella leaf, selection' },
    { name: 'success', hex: '#2f6b4f', use: 'Confirmations (accessible green)' },
    { name: 'success-soft', hex: '#dfe9e0', use: 'Success fill' },
    { name: 'danger', hex: '#9c2b22', use: 'Errors' },
    { name: 'danger-soft', hex: '#f3dcd9', use: 'Error fill' },
  ] },
]

export const typeScale = [
  { name: 'Display', className: 'text-[84px] font-semibold leading-[0.98] tracking-[-0.045em]', spec: '84 / 0.98, 600, -4.5%', sample: 'Naturally in balance.' },
  { name: 'H1', className: 'text-[52px] font-semibold leading-[1.02] tracking-[-0.035em]', spec: '52 / 1.02, 600, -3.5%', sample: 'Everything we make' },
  { name: 'H2', className: 'text-[48px] font-medium leading-[1.05] tracking-[-0.03em]', spec: '48 / 1.05, 500, -3%', sample: 'Calmer skin' },
  { name: 'H3', className: 'text-[22px] font-medium tracking-[-0.02em]', spec: '22, 500, -2%', sample: 'Order summary' },
  { name: 'Price', className: 'text-[24px] font-semibold tracking-[-0.02em] tabular-nums', spec: '24, 600, tabular', sample: '$68.99' },
  { name: 'Lead', className: 'text-[17px] leading-[1.45]', spec: '17 / 1.45, 400', sample: 'Small-batch serums and balms built on centella.' },
  { name: 'Body', className: 'text-[16px]', spec: '16, 400', sample: 'Press three or four drops into skin after toner.' },
  { name: 'Small', className: 'text-[14px] text-muted', spec: '14, 400, muted', sample: 'Step 3 / Treat' },
  { name: 'Micro', className: 'text-[12px] text-muted', spec: '12, 400, muted', sample: '55 ml / 1.85 fl oz' },
]

export const spacing = [4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 96]

export const radii = [
  { name: 'field', value: '18px' },
  { name: 'card', value: '30px' },
  { name: 'panel', value: '36px' },
  { name: 'hero', value: '48px' },
  { name: 'pill', value: '999px' },
]

export const shadows = [
  { name: 'card', value: 'var(--shadow-card)' },
  { name: 'float', value: 'var(--shadow-float)' },
  { name: 'hero', value: 'var(--shadow-hero)' },
  { name: 'drawer', value: 'var(--shadow-drawer)' },
]

export const motionTokens = [
  { name: 'ease-soft', value: 'cubic-bezier(0.22, 1, 0.36, 1)', use: 'Entrances, drawers, hovers' },
  { name: 'ease-spring', value: 'cubic-bezier(0.34, 1.56, 0.64, 1)', use: 'Icon nudges' },
  { name: 'rise', value: '700ms ease-soft', use: 'Page and hero entrances' },
  { name: 'float', value: '7s ease-in-out loop', use: 'Pipette and packshots' },
  { name: 'drip', value: '3.2s ease-soft loop', use: 'Serum drop' },
  { name: 'shimmer', value: '1.6s linear loop', use: 'Skeletons' },
]
