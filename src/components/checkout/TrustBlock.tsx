import Link from "next/link"
import { Lock } from "lucide-react"

export function TrustBlock() {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border border-border bg-surface-secondary/40 px-4 py-3 text-[12px] text-muted-foreground">
      <span className="inline-flex items-center gap-1.5">
        <Lock className="size-3.5" />
        Beveiligde betaling via Viva Wallet
      </span>
      <span className="hidden sm:inline">·</span>
      <Link
        href="/voorwaarden"
        className="underline underline-offset-4 decoration-border hover:decoration-navy-500"
      >
        Algemene voorwaarden
      </Link>
      <span className="hidden sm:inline">·</span>
      <Link
        href="/privacy"
        className="underline underline-offset-4 decoration-border hover:decoration-navy-500"
      >
        Privacybeleid
      </Link>
    </div>
  )
}
