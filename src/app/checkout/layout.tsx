import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "Checkout | Inovix",
  description: "Rond uw bestelling veilig af.",
}

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {/* Hide default site chrome */}
      <style
        dangerouslySetInnerHTML={{
          __html: "#default-banner, #default-navbar, #default-footer { display: none !important; }",
        }}
      />

      <div className="min-h-screen bg-white">
        {/* Checkout header — minimal */}
        <header className="border-b border-border">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <Link href="/" aria-label="Inovix home" className="flex items-center">
              <Image
                src="/images/inovix-logo.png"
                alt="Inovix"
                width={142}
                height={24}
                priority
                className="h-5 w-auto sm:h-6"
              />
            </Link>
            <Link
              href="/products"
              className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:text-navy-500"
            >
              <ArrowLeft className="size-3.5" />
              Verder winkelen
            </Link>
          </div>
        </header>

        {children}
      </div>
    </>
  )
}
