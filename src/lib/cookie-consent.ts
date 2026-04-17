export const COOKIE_CONSENT_KEY = "inovix-cookie-consent"
export const COOKIE_CONSENT_EVENT = "inovix-cookie-consent-change"

export type CookieCategory = "necessary" | "functional" | "analytics" | "marketing"

export type CookieConsent = {
  necessary: true
  functional: boolean
  analytics: boolean
  marketing: boolean
  timestamp: string
}

export function readConsent(): CookieConsent | null {
  if (typeof window === "undefined") return null
  try {
    const raw = window.localStorage.getItem(COOKIE_CONSENT_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<CookieConsent>
    if (!parsed || typeof parsed !== "object") return null
    return {
      necessary: true,
      functional: Boolean(parsed.functional),
      analytics: Boolean(parsed.analytics),
      marketing: Boolean(parsed.marketing),
      timestamp: typeof parsed.timestamp === "string" ? parsed.timestamp : new Date().toISOString(),
    }
  } catch {
    return null
  }
}

export function writeConsent(consent: Omit<CookieConsent, "necessary" | "timestamp">) {
  if (typeof window === "undefined") return
  const value: CookieConsent = {
    necessary: true,
    functional: consent.functional,
    analytics: consent.analytics,
    marketing: consent.marketing,
    timestamp: new Date().toISOString(),
  }
  window.localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(value))
  window.dispatchEvent(new CustomEvent(COOKIE_CONSENT_EVENT, { detail: value }))
}

export function clearConsent() {
  if (typeof window === "undefined") return
  window.localStorage.removeItem(COOKIE_CONSENT_KEY)
  window.dispatchEvent(new CustomEvent(COOKIE_CONSENT_EVENT, { detail: null }))
}
