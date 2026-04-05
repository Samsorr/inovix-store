"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Loader2 } from "lucide-react"

import { useAuth } from "@/lib/context/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function LoginPage() {
  const router = useRouter()
  const { login, isAuthenticated, isLoading } = useAuth()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Redirect if already logged in
  if (!isLoading && isAuthenticated) {
    router.push("/account")
    return null
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (!email.trim()) {
      setError("E-mailadres is verplicht")
      return
    }
    if (!password) {
      setError("Wachtwoord is verplicht")
      return
    }

    setIsSubmitting(true)
    try {
      await login(email.trim(), password)
      router.push("/account")
    } catch {
      setError(
        "Ongeldige inloggegevens. Controleer uw e-mailadres en wachtwoord."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="size-5 animate-spin border border-navy-500 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:py-24">
      <h1 className="text-[13px] font-semibold uppercase tracking-[0.15em] text-navy-500">
        Inloggen
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Log in op uw Inovix-account om uw bestellingen te bekijken en uw
        gegevens te beheren.
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
        <Input
          type="password"
          label="Wachtwoord"
          placeholder="&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
            Inloggen
          </Button>
        </div>
      </form>

      <div className="mt-6 space-y-3 text-center text-sm">
        <div>
          <Link
            href="/account/wachtwoord-vergeten"
            className="text-teal-400 underline-offset-4 hover:underline"
          >
            Wachtwoord vergeten?
          </Link>
        </div>
        <p className="text-muted-foreground">
          Nog geen account?{" "}
          <Link
            href="/account/registratie"
            className="font-medium text-navy-500 underline-offset-4 hover:underline"
          >
            Registreren
          </Link>
        </p>
      </div>
    </div>
  )
}
