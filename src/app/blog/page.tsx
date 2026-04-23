import type { Metadata } from "next"
import Link from "next/link"

import { ScrollReveal } from "@/components/ScrollReveal"
import { formatPostDate, getAllPosts } from "@/lib/blog"

export const metadata: Metadata = {
  title: "Onderzoeksnotities",
  description:
    "Achtergrond, technische notities en referentiemateriaal voor wetenschappelijk onderzoek met peptiden.",
}

export default function BlogIndexPage() {
  const posts = getAllPosts()

  return (
    <div className="section-y">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <header className="border-b border-border pb-10 sm:pb-14">
            <span className="text-xs font-medium uppercase tracking-widest text-teal-400">
              Onderzoeksnotities
            </span>
            <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-navy-900 md:text-5xl">
              Technische referenties voor uw laboratorium
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-navy-600">
              Beknopte, onderbouwde notities over het werken met peptiden in een
              onderzoekscontext: opslag, analyse, kwaliteitsparameters en de
              methodiek achter onze certificeringen.
            </p>
          </header>
        </ScrollReveal>

        {posts.length === 0 ? (
          <p className="mt-12 text-sm text-navy-400">
            Binnenkort verschijnen hier de eerste onderzoeksnotities.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-border">
            {posts.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group block py-8 transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-400 sm:py-10"
                >
                  <time
                    dateTime={post.date}
                    className="text-xs tabular-nums text-navy-400"
                  >
                    {formatPostDate(post.date)}
                  </time>
                  <h2 className="mt-3 text-2xl font-bold tracking-tight text-navy-900 transition-colors group-hover:text-teal-400 md:text-3xl">
                    {post.title}
                  </h2>
                  <p className="mt-3 text-base leading-relaxed text-navy-600">
                    {post.excerpt}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}

        <p className="mt-14 border-t border-border pt-8 text-xs leading-relaxed text-navy-400">
          Alle inhoud is uitsluitend bedoeld voor wetenschappelijk onderzoek.
          Niet voor menselijke of veterinaire consumptie.
        </p>
      </div>
    </div>
  )
}
