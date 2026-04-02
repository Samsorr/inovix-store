/**
 * Format a Medusa price (stored in cents) to a display string.
 */
export function formatPrice(amountInCents: number, currency = "EUR"): string {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency,
  }).format(amountInCents / 100)
}

/**
 * Convert Medusa price (cents) to euros.
 */
export function centsToEuros(amountInCents: number): number {
  return amountInCents / 100
}
