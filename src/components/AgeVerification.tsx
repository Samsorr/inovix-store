"use client"

import { useState, useEffect } from "react"
import { ShieldCheck } from "lucide-react"

import { Button } from "@/components/ui/button"

const STORAGE_KEY = "inovix-age-verified"

export function AgeVerification() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const verified = localStorage.getItem(STORAGE_KEY)
      if (!verified) {
        setShow(true)
      }
    }
  }, [])

  function handleConfirm() {
    localStorage.setItem(STORAGE_KEY, "true")
    setShow(false)
  }

  function handleLeave() {
    window.location.href = "https://www.google.com"
  }

  if (!show) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-navy-900/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md border border-border bg-card p-6 shadow-2xl sm:p-8">
        <div className="flex flex-col items-center text-center">
          <div className="flex size-12 items-center justify-center border border-border">
            <ShieldCheck className="size-6 text-navy-500" />
          </div>

          <h2 className="mt-4 text-xl font-bold text-navy-500">
            Leeftijdsverificatie
          </h2>

          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Deze website bevat producten uitsluitend bestemd voor
            wetenschappelijk laboratoriumonderzoek.
          </p>

          <p className="mt-2 text-sm font-medium text-navy-500">
            Bevestig dat u 18 jaar of ouder bent en een
            onderzoeksprofessional bent.
          </p>

          <div className="mt-6 flex w-full flex-col gap-2 sm:flex-row sm:gap-3">
            <Button
              variant="primary"
              size="md"
              fullWidth
              onClick={handleConfirm}
            >
              Bevestigen en doorgaan
            </Button>
            <Button
              variant="outline"
              size="md"
              fullWidth
              onClick={handleLeave}
            >
              Verlaat website
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
