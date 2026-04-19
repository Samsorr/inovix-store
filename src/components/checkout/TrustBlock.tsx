import Link from "next/link"
import { Lock, Truck, ShieldCheck } from "lucide-react"

export function TrustBlock() {
  return (
    <div className="rounded-lg border border-border bg-surface-secondary/40 p-4">
      <div className="grid grid-cols-1 gap-3 text-[12px] text-navy-600 sm:grid-cols-3 sm:gap-4">
        <span className="inline-flex items-center gap-2">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-white text-teal-600 ring-1 ring-border">
            <Lock className="size-3.5" />
          </span>
          Beveiligde betaling via Viva Wallet
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-white text-teal-600 ring-1 ring-border">
            <Truck className="size-3.5" />
          </span>
          Snelle levering, 1 tot 2 werkdagen
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-white text-teal-600 ring-1 ring-border">
            <ShieldCheck className="size-3.5" />
          </span>
          GMP kwaliteit, HPLC getest
        </span>
      </div>
      <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 border-t border-border pt-3 text-[11px] text-muted-foreground">
        <Link
          href="/voorwaarden"
          className="underline underline-offset-4 decoration-border hover:decoration-navy-500"
        >
          Algemene voorwaarden
        </Link>
        <span>·</span>
        <Link
          href="/privacy"
          className="underline underline-offset-4 decoration-border hover:decoration-navy-500"
        >
          Privacybeleid
        </Link>
      </div>
    </div>
  )
}
