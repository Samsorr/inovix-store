"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, Loader2 } from "lucide-react"

import medusa from "@/lib/medusa"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function WachtwoordHerstellenPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token") ?? ""
  const email = searchParams.get("email") ?? ""

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  if (!token || !email) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 sm:py-24">
        <div className="border-l-2 border-red-500 pl-4">
          <h1 className="text-[13px] font-semibold uppercase tracking-[0.15em] text-navy-500">
            Ongeldige link
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Deze herstellink is onvolledig of verlopen. Vraag een nieuwe link
            aan om uw wachtwoord te herstellen.
          </p>
        </div>
        <div className="mt-8">
          <Link
            href="/account/wachtwoord-vergeten"
            className="inline-flex items-center gap-2 text-sm font-medium text-navy-500 underline-offset-4 hover:underline"
          >
            <ArrowLeft className="size-3.5" />
            Nieuwe herstellink aanvragen
          </Link>
        </div>
      </div>
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (password.length < 8) {
      setError("Wachtwoord moet minimaal 8 tekens lang zijn")
      return
    }
    if (password !== confirmPassword) {
      setError("De wachtwoorden komen niet overeen")
      return
    }

    setIsSubmitting(true)
    try {
      await medusa.auth.updateProvider(
        "customer",
        "emailpass",
        { email, password },
        token
      )
      setIsSuccess(true)
      setTimeout(() => router.push("/account/login"), 2500)
    } catch {
      setError(
        "Wachtwoord herstellen is mislukt. De link is mogelijk verlopen. Vraag een nieuwe herstellink aan."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 sm:py-24">
        <div className="border-l-2 border-teal-400 pl-4">
          <h1 className="text-[13px] font-semibold uppercase tracking-[0.15em] text-navy-500">
            Wachtwoord gewijzigd
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Uw wachtwoord is succesvol gewijzigd. U wordt doorgestuurd naar de
            inlogpagina.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:py-24">
      <h1 className="text-[13px] font-semibold uppercase tracking-[0.15em] text-navy-500">
        Nieuw wachtwoord instellen
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Kies een nieuw wachtwoord voor{" "}
        <span className="font-medium text-navy-500">{email}</span>.
      </p>

      {error && (
        <div className="mt-6 border-l-2 border-red-500 bg-white py-2 pl-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <Input
          type="password"
          label="Nieuw wachtwoord"
          placeholder="Minimaal 8 tekens"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
        />
        <Input
          type="password"
          label="Bevestig wachtwoord"
          placeholder="Herhaal uw wachtwoord"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
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
            Wachtwoord wijzigen
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
