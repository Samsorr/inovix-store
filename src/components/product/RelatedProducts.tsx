import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import medusa from "@/lib/medusa"
import { formatPrice } from "@/lib/price"
import { cn } from "@/lib/utils"

interface RelatedProductsProps {
  currentProductId: string
  regionId: string
  className?: string
}

async function getRelated(currentProductId: string, regionId: string) {
  try {
    const { products } = await medusa.store.product.list({
      region_id: regionId,
      fields: "id,title,subtitle,thumbnail,variants.calculated_price",
      limit: 5,
    })
    return (products ?? [])
      .filter((p) => p.id !== currentProductId)
      .slice(0, 4)
  } catch {
    return []
  }
}

export async function RelatedProducts({
  currentProductId,
  regionId,
  className,
}: RelatedProductsProps) {
  const related = await getRelated(currentProductId, regionId)

  if (related.length === 0) return null

  return (
    <section className={cn(className)}>
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-mauve-500">
            Ook interessant
          </p>
          <h2 className="mt-1.5 text-lg font-semibold tracking-tight text-navy-500 sm:text-xl">
            Gerelateerde peptiden
          </h2>
        </div>
        <Link
          href="/products"
          className="group/all hidden items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-navy-400 transition-colors hover:text-teal-400 sm:inline-flex"
        >
          Alle peptiden
          <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover/all:-translate-y-0.5 group-hover/all:translate-x-0.5" />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
        {related.map((product) => {
          const hasMultipleVariants = (product.variants?.length ?? 0) > 1
          const price =
            product.variants?.[0]?.calculated_price?.calculated_amount
          const dosage = product.subtitle

          return (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="group flex flex-col overflow-hidden border border-border bg-card transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-0.5 hover:border-teal-200/70 hover:shadow-[0_10px_28px_-12px_rgba(22,32,67,0.16)]"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-[linear-gradient(180deg,#FFFFFF_0%,var(--color-surface-secondary)_55%,var(--color-surface-tertiary)_100%)]">
                <Image
                  src={product.thumbnail || "/images/product-peptide.png"}
                  alt={product.title ?? ""}
                  fill
                  sizes="(min-width: 768px) 22vw, 45vw"
                  className="object-contain p-6 transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                />
              </div>

              <div className="flex flex-1 flex-col p-4">
                <h3 className="text-sm font-semibold tracking-tight text-navy-500 transition-colors duration-300 group-hover:text-teal-400">
                  {product.title}
                </h3>
                {dosage && (
                  <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-navy-300">
                    {dosage}
                  </p>
                )}
                <div className="mt-auto pt-3">
                  {hasMultipleVariants && price != null && (
                    <p className="text-[9px] font-semibold uppercase tracking-widest text-navy-300">
                      Vanaf
                    </p>
                  )}
                  <p className="text-base font-bold leading-none tracking-tight text-navy-500">
                    {price != null ? formatPrice(price) : "Prijs op aanvraag"}
                  </p>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
