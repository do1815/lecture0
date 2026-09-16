import { Language } from '../types';

export function formatPrice(amount: number, language: Language): string {
  const formatted = amount.toFixed(3);
  return language === 'ar' ? `${formatted} ر.ع.` : `OMR ${formatted}`;
}
