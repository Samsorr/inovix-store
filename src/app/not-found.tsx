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
      <section className="bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pt-20 pb-16 sm:pt-28 sm:pb-20 md:pt-32 md:pb-24">
          <div className="relative text-center">
            <p
              aria-hidden="true"
              className="pointer-events-none select-none font-bold leading-[0.9] tracking-tighter text-mauve-100 text-[160px] sm:text-[220px] md:text-[260px]"
            >
              404
            </p>

            <div className="relative -mt-10 sm:-mt-16 md:-mt-24">
              <span className="inline-flex items-center gap-2 border border-border bg-white px-3 py-1.5 text-[10px] font-medium uppercase tracking-widest text-teal-500">
                <span className="size-1.5 rounded-full bg-teal-400" />
                Pagina niet gevonden
              </span>
              <h1 className="mt-5 text-3xl font-bold tracking-tight text-navy-900 md:text-4xl">
                Deze verbinding{" "}
                <span className="text-teal-400">bestaat niet</span>.
              </h1>
              <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-navy-600">
                De pagina die u zoekt is verplaatst, verwijderd, of heeft nooit
                bestaan. Gebruik onderstaande opties om uw onderzoek voort te
                zetten.
              </p>
              <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center">
                <Link href="/">
                  <Button variant="primary" size="lg" fullWidth className="sm:w-auto">
                    <Home className="size-4" />
                    Terug naar home
                  </Button>
                </Link>
                <Link href="/products">
                  <Button variant="outlineSecondary" size="lg" fullWidth className="sm:w-auto">
                    Bekijk catalogus
                    <ArrowRight className="size-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-y border-t border-border bg-surface-secondary">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-xl font-bold text-navy-900 sm:text-2xl">
              Waar wilde u naartoe?
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-navy-600 md:text-base">
              Probeer een van onderstaande pagina&apos;s of neem contact op als u
              hulp nodig heeft bij het vinden van een specifieke verbinding.
            </p>
          </div>

          <div className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-3">
            {[
              {
                icon: Search,
                title: "Catalogus",
                description: "Verken al onze peptiden op onderzoeksgebied",
                href: "/products",
              },
              {
                icon: FlaskConical,
                title: "Kwaliteit",
                description: "Onze kwaliteitsstandaard en analysemethoden",
                href: "/kwaliteit",
              },
              {
                icon: Mail,
                title: "Contact",
                description: "Neem contact op met ons onderzoeksteam",
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
                <h3 className="text-sm font-semibold text-navy-900">
                  {item.title}
                </h3>
                <p className="text-xs leading-relaxed text-navy-600">
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
