"use client"

import { useEffect, useMemo, useState, useSyncExternalStore } from "react"
import Link from "next/link"
import { AnimatePresence, motion } from "motion/react"
import { Cookie, Settings2, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  COOKIE_CONSENT_KEY,
  COOKIE_CONSENT_EVENT,
  writeConsent,
  type CookieCategory,
  type CookieConsent as CookieConsentValue,
} from "@/lib/cookie-consent"

type OptionalCategory = Exclude<CookieCategory, "necessary">

type Preferences = Record<OptionalCategory, boolean>

const CATEGORIES: {
  key: CookieCategory
  label: string
  description: string
  required?: boolean
}[] = [
  {
    key: "necessary",
    label: "Noodzakelijk",
    description:
      "Vereist voor de basisfuncties van de website, zoals beveiliging, navigatie en formulieren.",
    required: true,
  },
  {
    key: "functional",
    label: "Functioneel",
    description:
      "Onthoudt uw voorkeuren zoals winkelwagen, accountsessie en taal voor een optimale ervaring.",
  },
  {
    key: "analytics",
    label: "Analyse",
    description:
      "Helpt ons de website te verbeteren door anoniem het gebruik te meten. Geen persoonlijke identificatie.",
  },
  {
    key: "marketing",
    label: "Marketing",
    description:
      "Wordt gebruikt voor gerichte communicatie over nieuwe onderzoeksproducten en wetenschappelijke updates.",
  },
]

const DEFAULT_PREFS: Preferences = {
  functional: true,
  analytics: false,
  marketing: false,
}

function subscribeToConsent(callback: () => void) {
  if (typeof window === "undefined") return () => {}
  const onStorage = (e: StorageEvent) => {
    if (e.key === COOKIE_CONSENT_KEY) callback()
  }
  window.addEventListener(COOKIE_CONSENT_EVENT, callback)
  window.addEventListener("storage", onStorage)
  return () => {
    window.removeEventListener(COOKIE_CONSENT_EVENT, callback)
    window.removeEventListener("storage", onStorage)
  }
}

// getSnapshot must return a primitive or cached reference; returning a fresh object trips React's infinite-loop guard.
function getClientConsentRaw(): string | null {
  if (typeof window === "undefined") return null
  return window.localStorage.getItem(COOKIE_CONSENT_KEY)
}

function getServerConsentRaw(): string | null {
  return null
}

function parseConsent(raw: string | null): CookieConsentValue | null {
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as Partial<CookieConsentValue>
    if (!parsed || typeof parsed !== "object") return null
    return {
      necessary: true,
      functional: Boolean(parsed.functional),
      analytics: Boolean(parsed.analytics),
      marketing: Boolean(parsed.marketing),
      timestamp:
        typeof parsed.timestamp === "string"
          ? parsed.timestamp
          : new Date().toISOString(),
    }
  } catch {
    return null
  }
}

export function CookieConsent() {
  const rawConsent = useSyncExternalStore(
    subscribeToConsent,
    getClientConsentRaw,
    getServerConsentRaw
  )
  const consent = useMemo(() => parseConsent(rawConsent), [rawConsent])
  const [mounted, setMounted] = useState(false)
  const [showPreferences, setShowPreferences] = useState(false)
  const [prefs, setPrefs] = useState<Preferences>(DEFAULT_PREFS)

  useEffect(() => {
    // Gate the first render until after hydration so the server-rendered HTML
    // (which always shows the banner) is swapped out cleanly on clients that
    // already have a consent record in localStorage.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  const visible = consent === null

  function openPreferences() {
    if (consent) {
      setPrefs({
        functional: consent.functional,
        analytics: consent.analytics,
        marketing: consent.marketing,
      })
    }
    setShowPreferences(true)
  }

  function handleAcceptAll() {
    writeConsent({ functional: true, analytics: true, marketing: true })
    setShowPreferences(false)
  }

  function handleRejectOptional() {
    writeConsent({ functional: false, analytics: false, marketing: false })
    setShowPreferences(false)
  }

  function handleSavePreferences() {
    writeConsent(prefs)
    setShowPreferences(false)
  }

  if (!mounted) return null

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="cookie-banner"
          role="dialog"
          aria-modal="false"
          aria-labelledby="cookie-consent-title"
          aria-describedby="cookie-consent-description"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="fixed inset-x-0 bottom-0 z-50 px-3 pb-[max(env(safe-area-inset-bottom),0.75rem)] sm:inset-x-auto sm:bottom-6 sm:left-6 sm:max-w-md sm:px-0 sm:pb-0"
        >
          <div className="gradient-brand-subtle overflow-hidden border border-mauve-300/20 shadow-[0_20px_60px_-20px_rgba(22,32,67,0.5)]">
            <div className="flex items-start gap-4 p-5 sm:p-6">
              <div
                aria-hidden="true"
                className="hidden size-10 shrink-0 items-center justify-center border border-white/40 bg-white/10 sm:flex"
              >
                <Cookie className="size-5 text-white" />
              </div>

              <div className="flex-1 min-w-0">
                <h2
                  id="cookie-consent-title"
                  className="text-base font-bold text-white"
                >
                  Cookies op Inovix
                </h2>
                <p
                  id="cookie-consent-description"
                  className="mt-2 text-sm leading-relaxed text-white/70"
                >
                  Wij gebruiken noodzakelijke cookies voor de werking van de
                  website en optionele cookies voor verbeterde functionaliteit,
                  analyse en marketing. U kunt uw voorkeuren op elk moment
                  aanpassen.{" "}
                  <Link
                    href="/privacy"
                    className="underline underline-offset-2 transition-colors hover:text-mauve-200"
                  >
                    Lees ons privacybeleid
                  </Link>
                  .
                </p>

                <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                  <Button
                    variant="primaryOnDark"
                    size="sm"
                    onClick={handleAcceptAll}
                    className="w-full sm:w-auto"
                  >
                    Alles accepteren
                  </Button>
                  <Button
                    variant="ghostOnDark"
                    size="sm"
                    onClick={handleRejectOptional}
                    className="w-full sm:w-auto"
                  >
                    Alleen noodzakelijk
                  </Button>
                  <Button
                    variant="ghostOnDark"
                    size="sm"
                    onClick={openPreferences}
                    className="w-full sm:w-auto"
                    aria-haspopup="dialog"
                    aria-expanded={showPreferences}
                  >
                    <Settings2 className="size-4" />
                    Aanpassen
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {showPreferences && (
              <CookiePreferencesDialog
                prefs={prefs}
                onChange={setPrefs}
                onClose={() => setShowPreferences(false)}
                onSave={handleSavePreferences}
                onAcceptAll={handleAcceptAll}
                onRejectOptional={handleRejectOptional}
              />
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function CookiePreferencesDialog({
  prefs,
  onChange,
  onClose,
  onSave,
  onAcceptAll,
  onRejectOptional,
}: {
  prefs: Preferences
  onChange: (prefs: Preferences) => void
  onClose: () => void
  onSave: () => void
  onAcceptAll: () => void
  onRejectOptional: () => void
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [onClose])

  return (
    <motion.div
      key="cookie-preferences"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-preferences-title"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[60] flex items-end justify-center bg-navy-900/70 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="flex max-h-[92vh] w-full max-w-xl flex-col overflow-hidden border-t border-border bg-white shadow-2xl sm:max-h-[90vh] sm:border"
      >
        <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-4 sm:py-5">
          <div className="min-w-0">
            <h2
              id="cookie-preferences-title"
              className="text-lg font-bold text-navy-500 sm:text-xl"
            >
              Cookievoorkeuren
            </h2>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground sm:text-sm">
              Kies welke categorieën cookies u wilt toestaan.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Sluiten"
            className="flex size-9 shrink-0 items-center justify-center border border-border text-navy-500 transition-colors hover:bg-surface-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-400"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-2">
          <ul className="divide-y divide-border">
            {CATEGORIES.map((category) => {
              const isRequired = category.required === true
              const checked =
                isRequired ||
                prefs[category.key as OptionalCategory]
              return (
                <li
                  key={category.key}
                  className="flex items-start justify-between gap-4 py-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-semibold text-navy-500">
                        {category.label}
                      </h3>
                      {isRequired && (
                        <span className="border border-border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                          Altijd aan
                        </span>
                      )}
                    </div>
                    <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                      {category.description}
                    </p>
                  </div>
                  <ConsentToggle
                    checked={checked}
                    disabled={isRequired}
                    label={`${category.label} cookies`}
                    onChange={(next) => {
                      if (isRequired) return
                      onChange({
                        ...prefs,
                        [category.key as OptionalCategory]: next,
                      })
                    }}
                  />
                </li>
              )
            })}
          </ul>
        </div>

        <div className="flex flex-col gap-2 border-t border-border bg-surface-secondary/40 px-6 py-4 pb-[max(env(safe-area-inset-bottom),1rem)] sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:pb-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={onRejectOptional}
              className="w-full justify-center sm:w-auto"
            >
              Alleen noodzakelijk
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onAcceptAll}
              className="w-full justify-center sm:w-auto"
            >
              Alles accepteren
            </Button>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={onSave}
            className="w-full justify-center sm:w-auto"
          >
            Voorkeuren opslaan
          </Button>
        </div>
      </motion.div>
    </motion.div>
  )
}

function ConsentToggle({
  checked,
  disabled,
  label,
  onChange,
}: {
  checked: boolean
  disabled?: boolean
  label: string
  onChange: (next: boolean) => void
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-9 w-16 shrink-0 cursor-pointer items-center border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-400",
        checked
          ? "border-mauve-500 bg-mauve-500"
          : "border-border bg-surface-secondary",
        disabled && "cursor-not-allowed opacity-60"
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "inline-block size-7 transform bg-white shadow-sm transition-transform",
          checked ? "translate-x-8" : "translate-x-0.5"
        )}
      />
    </button>
  )
}
