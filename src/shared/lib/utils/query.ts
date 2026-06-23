export interface MonthLabels {
  singular: string;
  plural1: string;
  plural2: string;
}

export function getMonthLabels(t: (key: string) => string): MonthLabels {
  return {
    singular: t('shared.month_1'),
    plural1: t('shared.month_2'),
    plural2: t('shared.month_5'),
  };
}

export function getIntentId(search: string | null): string | null {
  if (!search) return null;
  const params = new URLSearchParams(search);
  return params.get('intentId') ?? params.get('paymentId') ?? params.get('id');
}

export function getQueryValue(search: string | null, keys: string[]): string | null {
  if (!search) return null;
  const params = new URLSearchParams(search);
  for (const key of keys) {
    const value = params.get(key);
    if (value) return value;
  }
  return null;
}
