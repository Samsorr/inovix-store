"use client"

import { useEffect, useState } from "react"
import { Check } from "lucide-react"

const FLAG_KEY = "inovix_first_address_saved"

export function SavedAddressToast() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return
    if (sessionStorage.getItem(FLAG_KEY) === "1") {
      setShow(true)
      sessionStorage.removeItem(FLAG_KEY)
      const t = setTimeout(() => setShow(false), 5000)
      return () => clearTimeout(t)
    }
  }, [])

  if (!show) return null

  return (
    <div
      role="status"
      aria-live="polite"
      className="mb-6 flex items-center gap-3 border border-teal-400/40 bg-teal-50/60 px-4 py-3 text-sm text-navy-500"
    >
      <Check className="size-4 text-teal-500" strokeWidth={2.5} />
      Uw adres is opgeslagen in uw account.
    </div>
  )
}
