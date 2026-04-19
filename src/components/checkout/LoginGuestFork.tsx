"use client"

import Link from "next/link"
import { motion } from "motion/react"
import { ArrowRight, LogIn, UserRound } from "lucide-react"

export interface LoginGuestForkProps {
  onContinueAsGuest: () => void
}

export function LoginGuestFork({ onContinueAsGuest }: LoginGuestForkProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="mb-10"
    >
      <h2 className="text-xl font-semibold text-navy-900 sm:text-2xl">
        Hoe wilt u afrekenen?
      </h2>
      <p className="mt-2 text-sm text-navy-600">
        Sneller? Log in. Liever zonder account? Afrekenen als gast kan ook.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {/* Login card */}
        <Link
          href="/account/login?redirect=/checkout"
          className="group flex flex-col justify-between rounded-xl border border-border bg-white p-6 transition-all duration-300 hover:-translate-y-px hover:border-navy-300 hover:shadow-md focus-visible:ring-2 focus-visible:ring-teal-400/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-400"
        >
          <div>
            <div className="flex size-10 items-center justify-center rounded-lg bg-navy-900 text-white">
              <LogIn className="size-5" />
            </div>
            <h3 className="mt-4 text-base font-semibold text-navy-900">
              Inloggen
            </h3>
            <ul className="mt-3 space-y-1.5 text-[13px] text-navy-600">
              <li className="flex items-start gap-2">
                <span className="mt-2 size-1 rounded-full bg-teal-500" />
                Opgeslagen adressen en facturen
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-2 size-1 rounded-full bg-teal-500" />
                Bestellingen en track &amp; trace
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-2 size-1 rounded-full bg-teal-500" />
                Sneller afrekenen volgende keer
              </li>
            </ul>
          </div>
          <div className="mt-5 flex items-center justify-between text-sm font-medium text-navy-900">
            <span>Inloggen</span>
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </Link>

        {/* Guest card */}
        <button
          type="button"
          onClick={onContinueAsGuest}
          className="group flex flex-col justify-between rounded-xl border border-border bg-white p-6 text-left transition-all duration-300 hover:-translate-y-px hover:border-navy-300 hover:shadow-md focus-visible:ring-2 focus-visible:ring-teal-400/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-400"
        >
          <div>
            <div className="flex size-10 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
              <UserRound className="size-5" />
            </div>
            <h3 className="mt-4 text-base font-semibold text-navy-900">
              Afrekenen als gast
            </h3>
            <ul className="mt-3 space-y-1.5 text-[13px] text-navy-600">
              <li className="flex items-start gap-2">
                <span className="mt-2 size-1 rounded-full bg-teal-500" />
                Alleen e-mail en bezorgadres
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-2 size-1 rounded-full bg-teal-500" />
                Geen account nodig
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-2 size-1 rounded-full bg-teal-500" />
                Account later aanmaken kan
              </li>
            </ul>
          </div>
          <div className="mt-5 flex items-center justify-between text-sm font-medium text-navy-900">
            <span>Doorgaan als gast</span>
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </button>
      </div>

      <p className="mt-5 text-[12px] text-muted-foreground">
        Nog geen account?{" "}
        <Link
          href="/account/registratie"
          className="font-medium text-navy-900 underline underline-offset-4 decoration-border hover:decoration-navy-900"
        >
          Registreren
        </Link>
      </p>
    </motion.div>
  )
}
