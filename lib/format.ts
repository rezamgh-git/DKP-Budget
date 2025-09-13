export function toPersianDigits(input: string | number): string {
  const map: Record<string, string> = {
    '0': '۰', '1': '۱', '2': '۲', '3': '۳', '4': '۴',
    '5': '۵', '6': '۶', '7': '۷', '8': '۸', '9': '۹',
    '.': '٫', ',': '٬', '-': '−'
  };
  return String(input).split('').map(ch => map[ch] ?? ch).join('');
}

export type Currency = 'irr' | 'toman';

export function getDefaultCurrency(): Currency {
  return (process.env.DEFAULT_CURRENCY === 'irr' ? 'irr' : 'toman');
}

export function toCurrency(value: number, currency: Currency = getDefaultCurrency()): string {
  const factor = currency === 'toman' ? Number(process.env.CURRENCY_TOMAN_FACTOR ?? '10') : 1;
  const v = Math.round(value / factor);
  const formatted = v.toLocaleString('fa-IR');
  return currency === 'toman'
    ? `${formatted} تومان`
    : `${formatted} ریال`;
}
