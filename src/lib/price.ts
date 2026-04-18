/**
 * Format a Medusa v2 price (stored as decimal whole currency units) to a display string.
 */
export function formatPrice(amount: number, currency = "EUR"): string {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency,
  }).format(amount)
}

/**
 * Medusa v2 returns prices as decimal whole currency units, so this is a pass-through.
 * Kept for call-site compatibility.
 */
export function centsToEuros(amount: number): number {
  return amount
}
