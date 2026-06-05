import type { Industry } from './types';

export function indColor(ind: Industry): string {
  const map: Record<Industry, string> = {
    cement:    'var(--ind-cement)',
    sugar:     'var(--ind-sugar)',
    textile:   'var(--ind-textile)',
    beverages: 'var(--ind-beverage)',
  };
  return map[ind] ?? 'var(--muted)';
}

export function indLabel(ind: Industry): string {
  const map: Record<Industry, string> = {
    cement:    'Cement',
    sugar:     'Sugar',
    textile:   'Textile',
    beverages: 'Beverages',
  };
  return map[ind] ?? ind;
}
