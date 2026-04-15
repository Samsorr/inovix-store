"use client"

import { useActionState, useState } from "react"
import { ArrowRight, Check, AlertCircle } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { submitContactForm } from "./actions"

const SUBJECT_OPTIONS = [
  { value: "", label: "Selecteer een onderwerp *" },
  { value: "Vraag over een product", label: "Vraag over een product" },
  { value: "Bestelling & verzending", label: "Bestelling & verzending" },
  { value: "Samenwerking", label: "Samenwerking" },
  { value: "Overig", label: "Overig" },
]

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type FieldErrors = {
  name?: string
  email?: string
  subject?: string
  message?: string
  consent?: string
}

function validateFields(fields: {
  name: string
  email: string
  subject: string
  message: string
  consent: boolean
}): FieldErrors {
  const errors: FieldErrors = {}

  if (!fields.name.trim()) {
    errors.name = "Vul uw naam in."
  } else if (fields.name.length > 100) {
    errors.name = "Uw naam mag maximaal 100 tekens bevatten."
  }

  if (!fields.email.trim()) {
    errors.email = "Vul uw e-mailadres in."
  } else if (!EMAIL_REGEX.test(fields.email.trim())) {
    errors.email = "Voer een geldig e-mailadres in."
  } else if (fields.email.length > 254) {
    errors.email = "Dit e-mailadres is te lang."
  }

  if (!fields.subject) {
    errors.subject = "Selecteer een onderwerp."
  }

  if (!fields.message.trim()) {
    errors.message = "Vul uw bericht in."
  } else if (fields.message.trim().length < 10) {
    errors.message = "Uw bericht moet minimaal 10 tekens bevatten."
  } else if (fields.message.length > 5000) {
    errors.message = "Uw bericht mag maximaal 5000 tekens bevatten."
  }

  if (!fields.consent) {
    errors.consent = "U moet akkoord gaan met de verwerking van uw gegevens."
  }

  return errors
}

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitContactForm, {
    success: false,
    error: null,
  })

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [touched, setTouched] = useState<Set<string>>(new Set())
  const [consent, setConsent] = useState(false)

  function handleBlur(field: keyof FieldErrors, value: string) {
    setTouched((prev) => new Set(prev).add(field))
    const testFields = {
      name: "",
      email: "",
      subject: "",
      message: "",
      consent: true,
      [field]: value,
    }
    const errors = validateFields(testFields)
    setFieldErrors((prev) => ({
      ...prev,
      [field]: value.trim() ? errors[field] : prev[field],
    }))
  }

  function handleSubmit(formData: FormData) {
    const fields = {
      name: formData.get("name")?.toString() ?? "",
      email: formData.get("email")?.toString() ?? "",
      subject: formData.get("subject")?.toString() ?? "",
      message: formData.get("message")?.toString() ?? "",
      consent,
    }

    const errors = validateFields(fields)
    setFieldErrors(errors)
    setTouched(new Set(["name", "email", "subject", "message", "consent"]))

    if (Object.keys(errors).length > 0) {
      return
    }

    formAction(formData)
  }

  // Success state
  if (state.success) {
    return (
      <div className="flex flex-col items-center border border-border px-6 py-16 text-center md:px-12 md:py-20">
        <div className="flex size-16 items-center justify-center border border-teal-400/30 bg-teal-400/5">
          <Check className="size-7 text-teal-400" strokeWidth={2.5} />
        </div>
        <h2 className="mt-6 text-xl font-bold tracking-tight text-navy-500 md:text-2xl">
          Bericht succesvol verzonden
        </h2>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
          Bedankt voor uw bericht. Wij nemen zo snel mogelijk contact met u op,
          uiterlijk binnen 24 uur. U ontvangt een reactie op het opgegeven
          e-mailadres.
        </p>
        <div className="mt-8 border-t border-border pt-8">
          <Link href="/">
            <Button variant="outline" size="md">
              <ArrowRight className="mr-1.5 size-4 rotate-180" />
              Terug naar home
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const hasFieldErrors = Object.keys(fieldErrors).length > 0

  return (
    <form action={handleSubmit} className="flex flex-col gap-6" noValidate>
      {/* Server error */}
      {state.error && (
        <div className="flex items-start gap-3 border border-red-200 bg-red-50 px-4 py-3.5">
          <AlertCircle className="mt-0.5 size-4 shrink-0 text-red-600" />
          <p className="text-sm text-red-700">{state.error}</p>
        </div>
      )}

      {/* Client validation summary */}
      {hasFieldErrors && touched.size === 4 && (
        <div className="flex items-start gap-3 border border-red-200 bg-red-50 px-4 py-3.5">
          <AlertCircle className="mt-0.5 size-4 shrink-0 text-red-600" />
          <p className="text-sm text-red-700">
            Controleer de gemarkeerde velden hieronder.
          </p>
        </div>
      )}

      {/* Name & Email: side by side on desktop, stacked on mobile */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Name */}
        <Input
          name="name"
          label="Naam *"
          placeholder="Uw volledige naam"
          required
          maxLength={100}
          autoComplete="name"
          error={touched.has("name") ? fieldErrors.name : undefined}
          onBlur={(e) => handleBlur("name", e.target.value)}
        />

        {/* Email */}
        <Input
          name="email"
          type="email"
          label="E-mailadres *"
          placeholder="uw@email.com"
          required
          maxLength={254}
          autoComplete="email"
          error={touched.has("email") ? fieldErrors.email : undefined}
          onBlur={(e) => handleBlur("email", e.target.value)}
        />
      </div>

      {/* Subject */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="subject"
          className="text-sm font-medium text-navy-500"
        >
          Onderwerp *
        </label>
        <select
          id="subject"
          name="subject"
          required
          defaultValue=""
          onBlur={(e) => handleBlur("subject", e.target.value)}
          onChange={(e) => {
            if (touched.has("subject")) {
              handleBlur("subject", e.target.value)
            }
          }}
          aria-invalid={touched.has("subject") && !!fieldErrors.subject || undefined}
          className="h-11 w-full appearance-none border border-border bg-transparent bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%238E95B0%22%20d%3D%22M6%208L1%203h10z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px] bg-[position:right_12px_center] bg-no-repeat px-3 py-2.5 pr-8 text-sm text-navy-500 outline-none transition-colors focus:border-navy-500 focus:ring-1 focus:ring-navy-500/20 aria-invalid:border-red-500 aria-invalid:ring-2 aria-invalid:ring-red-500/20 [&:invalid]:text-muted-foreground"
        >
          {SUBJECT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={!opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {touched.has("subject") && fieldErrors.subject && (
          <p className="text-sm text-red-600">{fieldErrors.subject}</p>
        )}
      </div>

      {/* Message */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="message"
          className="text-sm font-medium text-navy-500"
        >
          Bericht *
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          maxLength={5000}
          placeholder="Beschrijf uw vraag of opmerking..."
          onBlur={(e) => handleBlur("message", e.target.value)}
          aria-invalid={touched.has("message") && !!fieldErrors.message || undefined}
          className="w-full resize-none border border-border bg-transparent px-3 py-3 text-sm leading-relaxed text-navy-500 outline-none transition-colors placeholder:text-muted-foreground focus:border-navy-500 focus:ring-1 focus:ring-navy-500/20 aria-invalid:border-red-500 aria-invalid:ring-2 aria-invalid:ring-red-500/20"
        />
        {touched.has("message") && fieldErrors.message && (
          <p className="text-sm text-red-600">{fieldErrors.message}</p>
        )}
      </div>

      {/* GDPR consent */}
      <div className="flex flex-col gap-1.5">
        <label className="flex items-start gap-3 text-sm leading-relaxed text-navy-500">
          <input
            type="checkbox"
            name="consent"
            checked={consent}
            onChange={(e) => {
              setConsent(e.target.checked)
              setTouched((prev) => new Set(prev).add("consent"))
              setFieldErrors((prev) => ({
                ...prev,
                consent: e.target.checked
                  ? undefined
                  : "U moet akkoord gaan met de verwerking van uw gegevens.",
              }))
            }}
            required
            aria-invalid={touched.has("consent") && !!fieldErrors.consent || undefined}
            className="mt-0.5 size-4 shrink-0 border border-border text-navy-500 accent-navy-500 focus:ring-2 focus:ring-navy-500/20"
          />
          <span>
            Ik ga akkoord met de verwerking van mijn gegevens volgens de{" "}
            <Link
              href="/privacy"
              className="underline underline-offset-2 hover:text-teal-500"
            >
              Privacy Policy
            </Link>
            .
          </span>
        </label>
        {touched.has("consent") && fieldErrors.consent && (
          <p className="text-sm text-red-600">{fieldErrors.consent}</p>
        )}
      </div>

      {/* Submit */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        disabled={isPending}
        className="mt-2 text-xs uppercase tracking-widest"
      >
        {isPending ? "VERZENDEN..." : "VERSTUUR BERICHT"}
        {!isPending && <ArrowRight className="ml-1.5 size-4" />}
      </Button>
    </form>
  )
}
