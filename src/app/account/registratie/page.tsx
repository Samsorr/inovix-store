"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Check, FlaskConical, Loader2 } from "lucide-react"

import { useAuth } from "@/lib/context/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

function safeRedirect(raw: string | null): string {
  if (!raw) return "/account"
  if (!raw.startsWith("/") || raw.startsWith("//")) return "/account"
  return raw
}

export default function RegistratiePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = safeRedirect(searchParams.get("redirect"))
  const { register, isAuthenticated, isLoading } = useAuth()

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [researchConfirmed, setResearchConfirmed] = useState(false)
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace(redirectTo)
    }
  }, [isLoading, isAuthenticated, redirectTo, router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (!firstName.trim()) {
      setError("Voornaam is verplicht")
      return
    }
    if (!lastName.trim()) {
      setError("Achternaam is verplicht")
      return
    }
    if (!email.trim()) {
      setError("E-mailadres is verplicht")
      return
    }
    if (!password || password.length < 8) {
      setError("Wachtwoord moet minimaal 8 tekens bevatten")
      return
    }
    if (!researchConfirmed) {
      setError("Bevestig dat u een onderzoeksprofessional bent")
      return
    }

    setIsSubmitting(true)
    try {
      await register({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim(),
        password,
      })
      router.push(redirectTo)
    } catch {
      setError(
        "Registratie mislukt. Mogelijk bestaat er al een account met dit e-mailadres."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading || isAuthenticated) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="size-5 animate-spin border border-navy-500 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:py-24">
      <h1 className="text-[13px] font-semibold uppercase tracking-[0.15em] text-navy-500">
        Account aanmaken
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Maak een account aan om bestellingen te plaatsen en uw
        onderzoeksproducten te beheren.
      </p>

      {error && (
        <div className="mt-6 border-l-2 border-red-500 bg-white py-2 pl-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Voornaam"
            placeholder="Jan"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            autoFocus
          />
          <Input
            label="Achternaam"
            placeholder="de Vries"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <Input
          type="email"
          label="E-mailadres"
          placeholder="uw@email.nl"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          label="Wachtwoord"
          placeholder="Minimaal 8 tekens"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Research disclaimer */}
        <div className="border border-navy-500/20 bg-navy-500/[0.02] p-4">
          <div className="flex items-start gap-3">
            <FlaskConical className="mt-0.5 size-4 shrink-0 text-navy-500" />
            <div>
              <p className="text-sm font-medium text-navy-500">
                Onderzoeksprofessional verklaring
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Inovix-producten zijn uitsluitend bestemd voor in-vitro
                laboratoriumonderzoek. Door een account aan te maken bevestigt u
                dat u een onderzoeksprofessional bent.
              </p>
            </div>
          </div>
          <label className="mt-3 flex cursor-pointer items-center gap-3">
            <div
              className={cn(
                "flex size-4 shrink-0 items-center justify-center border transition-colors",
                researchConfirmed
                  ? "border-navy-500 bg-navy-500"
                  : "border-border"
              )}
            >
              {researchConfirmed && (
                <Check className="size-3 text-white" strokeWidth={3} />
              )}
            </div>
            <input
              type="checkbox"
              checked={researchConfirmed}
              onChange={(e) => setResearchConfirmed(e.target.checked)}
              className="sr-only"
            />
            <span className="text-sm text-navy-500">
              Ik bevestig dat ik een onderzoeksprofessional ben
            </span>
          </label>
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="size-4 animate-spin" />}
            Account aanmaken
          </Button>
        </div>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Heeft u al een account?{" "}
        <Link
          href="/account/login"
          className="font-medium text-navy-500 underline-offset-4 hover:underline"
        >
          Inloggen
        </Link>
      </p>
    </div>
  )
}
