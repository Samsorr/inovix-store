"use client"

import { useState } from "react"
import { Loader2, Plus, X } from "lucide-react"

import medusa from "@/lib/medusa"
import type { HttpTypes } from "@medusajs/types"
import { cn } from "@/lib/utils"

interface PromoCodeInputProps {
  cart: HttpTypes.StoreCart
  onCartUpdated: (cart: HttpTypes.StoreCart) => void
}

export function PromoCodeInput({ cart, onCartUpdated }: PromoCodeInputProps) {
  const existing = (cart.promotions ?? []).filter(
    (p): p is { id: string; code: string } =>
      typeof p?.code === "string" && p.code.length > 0
  )

  const [isExpanded, setIsExpanded] = useState(existing.length > 0)
  const [code, setCode] = useState("")
  const [isApplying, setIsApplying] = useState(false)
  const [error, setError] = useState("")

  async function apply(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = code.trim()
    if (!trimmed) return

    if (existing.some((p) => p.code?.toLowerCase() === trimmed.toLowerCase())) {
      setError("Deze code is al toegepast.")
      return
    }

    setIsApplying(true)
    setError("")
    try {
      const { cart: updated } = await medusa.store.cart.update(cart.id, {
        promo_codes: [...existing.map((p) => p.code!), trimmed],
      })
      onCartUpdated(updated)
      setCode("")
    } catch {
      setError("Code niet geldig of niet toepasbaar.")
    } finally {
      setIsApplying(false)
    }
  }

  async function remove(removedCode: string) {
    setIsApplying(true)
    setError("")
    try {
      const { cart: updated } = await medusa.store.cart.update(cart.id, {
        promo_codes: existing
          .map((p) => p.code!)
          .filter((c) => c !== removedCode),
      })
      onCartUpdated(updated)
    } catch {
      setError("Kon code niet verwijderen. Probeer het opnieuw.")
    } finally {
      setIsApplying(false)
    }
  }

  if (!isExpanded && existing.length === 0) {
    return (
      <button
        type="button"
        onClick={() => setIsExpanded(true)}
        className="flex items-center gap-1.5 text-[12px] font-medium text-navy-500 underline-offset-4 hover:underline"
      >
        <Plus className="size-3.5" strokeWidth={2.5} />
        Kortingscode toevoegen
      </button>
    )
  }

  return (
    <div>
      {existing.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1.5">
          {existing.map((p) => (
            <span
              key={p.id}
              className="inline-flex items-center gap-1.5 border border-teal-400/40 bg-teal-400/10 px-2 py-1 text-[11px] font-medium uppercase tracking-wider text-navy-500"
            >
              {p.code}
              <button
                type="button"
                onClick={() => remove(p.code!)}
                disabled={isApplying}
                aria-label={`Verwijder code ${p.code}`}
                className="text-navy-500/60 hover:text-navy-500 disabled:opacity-50"
              >
                <X className="size-3" strokeWidth={2.5} />
              </button>
            </span>
          ))}
        </div>
      )}

      <form onSubmit={apply} className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => {
            setCode(e.target.value)
            if (error) setError("")
          }}
          placeholder="Kortingscode"
          disabled={isApplying}
          className={cn(
            "h-9 flex-1 border border-border bg-transparent px-3 text-sm transition-colors outline-none",
            "focus:border-navy-500 focus:ring-1 focus:ring-navy-500/20",
            "disabled:cursor-not-allowed disabled:opacity-60"
          )}
        />
        <button
          type="submit"
          disabled={isApplying || !code.trim()}
          className={cn(
            "inline-flex h-9 items-center gap-1.5 border border-navy-500 px-3 text-[12px] font-medium uppercase tracking-wider text-navy-500 transition-colors",
            "hover:bg-navy-500 hover:text-white",
            "disabled:cursor-not-allowed disabled:opacity-50"
          )}
        >
          {isApplying && <Loader2 className="size-3.5 animate-spin" />}
          Toepassen
        </button>
      </form>

      {error && (
        <p className="mt-1.5 text-[12px] text-red-700">{error}</p>
      )}
    </div>
  )
}
