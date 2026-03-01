
export function formatCurrency(amountInCents: number, currency = 'EUR'): string {
  const amount = amountInCents / 100;

  return amount.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2, style: 'currency', currency })
}

export function toCents(amount: number, precision = 2): number {
  return Math.round(amount * Math.pow(10, precision));
}

export function fromCents(amountInCents: number, precision = 2): number {
  return amountInCents / Math.pow(10, precision);
}

export function validateNumberInput(input: string): boolean {
  return /^\d+(\.\d{0,2})?$/.test(input);
}

export function parseAmount(input: string): number | null {
  const cleaned = input.replace(/[^\d.]/g, '');
  const parsed = parseFloat(cleaned);

  return isNaN(parsed) ? null : toCents(parsed);
}
