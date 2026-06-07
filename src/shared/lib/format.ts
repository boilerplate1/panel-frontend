export function formatBytes(bytes: string | number, decimals = 2) {
  const b = typeof bytes === 'string' ? parseInt(bytes, 10) : bytes;
  if (b === 0) return '0 B';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(b) / Math.log(k));

  return parseFloat((b / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function formatTraffic(used: string | number, total: string | number, unlimitedLabel: string) {
  const totalNum = typeof total === 'string' ? parseInt(total, 10) : total;
  const usedStr = formatBytes(used);
  
  if (totalNum === 0) {
    return `${usedStr} / ${unlimitedLabel}`;
  }
  
  return `${usedStr} / ${formatBytes(total)}`;
}

export function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString();
}

export function formatCurrency(amountCents: number, currency = 'RUB', locale = 'ru-RU') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amountCents / 100);
}

export function formatPlanDurationLabel(durationDays: number, monthLabels: { singular: string; plural1: string; plural2: string }) {
  const months = Math.max(1, Math.round(durationDays / 30));
  
  const lastTwo = months % 100;
  const last = months % 10;
  
  let label = monthLabels.plural2;
  if (lastTwo < 11 || lastTwo > 14) {
    if (last === 1) label = monthLabels.singular;
    else if (last >= 2 && last <= 4) label = monthLabels.plural1;
  }
  
  return `${months} ${label}`;
}

export function formatPerMonthLabel(amountCents: number, currency: string, locale: string, perMonthSuffix: string) {
  const formatted = formatCurrency(amountCents, currency, locale);
  return `${formatted}${perMonthSuffix}`;
}
