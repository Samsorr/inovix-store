import Link from "next/link"
import { ArrowRight, FlaskConical, Home, Mail, Search } from "lucide-react"

import { Button } from "@/components/ui/button"

export const metadata = {
  title: "Pagina niet gevonden",
  description:
    "De door u opgevraagde pagina kon niet worden gevonden. Bekijk onze catalogus of keer terug naar de homepagina.",
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return (
    <>
      <section className="gradient-brand-subtle overflow-hidden">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-10 px-4 py-20 sm:px-6 sm:py-24 md:py-28 lg:flex-row lg:items-center lg:gap-16 lg:px-8 lg:py-32">
          <div className="flex flex-1 flex-col">
            <span className="text-xs font-medium uppercase tracking-widest text-teal-200">
              Fout 404
            </span>
            <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-white md:text-5xl">
              Deze <span className="text-teal-300">verbinding</span>
              <br />
              bestaat niet.
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-white/60">
              De pagina die u zoekt is verplaatst, verwijderd, of heeft nooit
              bestaan. Gebruik onderstaande opties om uw onderzoek voort te
              zetten.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/" className="w-full sm:w-auto">
                <Button variant="primaryOnDark" size="lg" fullWidth className="sm:w-auto">
                  <Home className="size-4" />
                  Terug naar home
                </Button>
              </Link>
              <Link href="/products" className="w-full sm:w-auto">
                <Button variant="ghostOnDark" size="lg" fullWidth className="sm:w-auto">
                  Bekijk catalogus
                  <ArrowRight className="size-4" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative flex-1 lg:flex lg:justify-end">
            <div
              aria-hidden="true"
              className="relative flex h-[220px] w-full max-w-md items-center justify-center overflow-hidden border border-white/10 sm:h-[280px] lg:h-[340px]"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(55,120,140,0.35),transparent_60%),radial-gradient(circle_at_70%_70%,rgba(172,110,155,0.25),transparent_55%)]" />
              <p className="relative font-mono text-[140px] font-bold leading-none tracking-tighter text-white/90 sm:text-[180px] lg:text-[220px]">
                404
              </p>
              <div className="absolute bottom-4 left-4 border border-white/15 bg-navy-900/60 px-3 py-2 backdrop-blur-md">
                <p className="text-[10px] uppercase tracking-wider text-white/50">
                  Status
                </p>
                <p className="text-sm font-semibold text-teal-300">
                  Niet gevonden
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-y border-t border-border bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-xl font-bold text-navy-500 sm:text-2xl">
              Waar wilde u naartoe?
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
              Probeer een van onderstaande pagina&apos;s of neem contact op als u
              hulp nodig heeft bij het vinden van een specifieke verbinding.
            </p>
          </div>

          <div className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-3">
            {[
              {
                icon: Search,
                title: "Catalogus",
                description:
                  "Verken al onze peptiden op onderzoeksgebied",
                href: "/products",
              },
              {
                icon: FlaskConical,
                title: "Kwaliteit",
                description:
                  "Onze kwaliteitsstandaard en analysemethoden",
                href: "/kwaliteit",
              },
              {
                icon: Mail,
                title: "Contact",
                description:
                  "Neem contact op met ons onderzoeksteam",
                href: "/contact",
              },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex h-full flex-col items-center gap-3 border border-border bg-white p-6 text-center transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex size-11 items-center justify-center border border-border">
                  <item.icon className="size-5 text-teal-400" />
                </div>
                <h3 className="text-sm font-semibold text-navy-500">
                  {item.title}
                </h3>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
