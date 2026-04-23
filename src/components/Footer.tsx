import Link from "next/link"

const productLinks = [
  { label: "Peptiden", href: "/products" },
  { label: "GLP-1", href: "/products?category=glp-1" },
  { label: "Lab Supplies", href: "/lab-supplies" },
]

const researchLinks = [
  { label: "Kennisbank", href: "/kennisbank" },
  { label: "Protocollen", href: "/protocollen" },
  { label: "Certificaten (CoA)", href: "/coa" },
]

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Algemene Voorwaarden", href: "/voorwaarden" },
  { label: "Compliance", href: "/compliance" },
  { label: "Bedrijfsgegevens", href: "/juridisch" },
]

function FooterLinkGroup({
  title,
  links,
}: {
  title: string
  links: { label: string; href: string }[]
}) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40">
        {title}
      </h3>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-white/60 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function Footer() {
  return (
    <footer className="bg-navy-500 text-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="grid gap-8 grid-cols-2 sm:gap-10 lg:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <Link
              href="/"
              className="text-lg font-bold tracking-wider text-white"
            >
              INOVIX
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/60">
              Premium peptiden voor wetenschappelijk laboratoriumonderzoek.
              Snel geleverd binnen de EU.
            </p>
            <p className="mt-4 text-xs leading-relaxed text-white/40">
              Alle producten zijn uitsluitend bestemd voor in-vitro
              laboratoriumonderzoek. Niet voor menselijke of veterinaire
              consumptie.
            </p>
          </div>

          <FooterLinkGroup title="Producten" links={productLinks} />
          <FooterLinkGroup title="Onderzoek" links={researchLinks} />
          <FooterLinkGroup title="Juridisch" links={legalLinks} />
        </div>

        {/* Bottom bar */}
        <div className="mt-8 border-t border-white/10 pt-5 sm:mt-12 sm:pt-6">
          <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
            <p className="text-xs text-white/40">
              &copy; {new Date().getFullYear()} Inovix. Alle producten zijn
              uitsluitend bestemd voor laboratoriumonderzoek.
            </p>
            <p className="text-xs text-white/30">
              ISO 9001:2015 &middot; GMP Compliant
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
