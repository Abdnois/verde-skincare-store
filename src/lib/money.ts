export const money = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: value % 1 === 0 ? 0 : 2 }).format(value)
