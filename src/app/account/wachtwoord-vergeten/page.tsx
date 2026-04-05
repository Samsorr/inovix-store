"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Loader2 } from "lucide-react"

import medusa from "@/lib/medusa"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function WachtwoordVergetenPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (!email.trim()) {
      setError("E-mailadres is verplicht")
      return
    }

    setIsSubmitting(true)
    try {
      await medusa.auth.resetPassword("customer", "emailpass", {
        identifier: email.trim(),
      })
    } catch {
      // Always show success to prevent account enumeration
    } finally {
      setIsSubmitting(false)
      setIsSubmitted(true)
    }
  }

  if (isSubmitted) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 sm:py-24">
        <div className="border-l-2 border-teal-400 pl-4">
          <h1 className="text-[13px] font-semibold uppercase tracking-[0.15em] text-navy-500">
            E-mail verzonden
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Als er een account bestaat met het e-mailadres{" "}
            <span className="font-medium text-navy-500">{email}</span>, ontvangt
            u binnen enkele minuten een e-mail met instructies om uw wachtwoord
            te herstellen.
          </p>
        </div>
        <div className="mt-8">
          <Link
            href="/account/login"
            className="inline-flex items-center gap-2 text-sm font-medium text-navy-500 underline-offset-4 hover:underline"
          >
            <ArrowLeft className="size-3.5" />
            Terug naar inloggen
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:py-24">
      <h1 className="text-[13px] font-semibold uppercase tracking-[0.15em] text-navy-500">
        Wachtwoord vergeten
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Voer uw e-mailadres in en we sturen u een link om uw wachtwoord te
        herstellen.
      </p>

      {error && (
        <div className="mt-6 border-l-2 border-red-500 bg-white py-2 pl-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <Input
          type="email"
          label="E-mailadres"
          placeholder="uw@email.nl"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoFocus
        />
        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="size-4 animate-spin" />}
            Herstelmail verzenden
          </Button>
        </div>
      </form>

      <div className="mt-6">
        <Link
          href="/account/login"
          className="inline-flex items-center gap-2 text-sm font-medium text-navy-500 underline-offset-4 hover:underline"
        >
          <ArrowLeft className="size-3.5" />
          Terug naar inloggen
        </Link>
      </div>
    </div>
  )
}
