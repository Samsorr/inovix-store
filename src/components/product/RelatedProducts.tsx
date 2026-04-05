import Image from "next/image"
import Link from "next/link"
import medusa from "@/lib/medusa"
import { formatPrice } from "@/lib/price"
import { cn } from "@/lib/utils"

interface RelatedProductsProps {
  currentProductId: string
  regionId: string
  className?: string
}

export async function RelatedProducts({
  currentProductId,
  regionId,
  className,
}: RelatedProductsProps) {
  try {
    const { products } = await medusa.store.product.list({
      region_id: regionId,
      fields: "id,title,thumbnail,variants.calculated_price",
      limit: 5,
    })

    const related = (products ?? [])
      .filter((p) => p.id !== currentProductId)
      .slice(0, 4)

    if (related.length === 0) return null

    return (
      <section className={cn(className)}>
        <h2 className="text-[11px] font-semibold uppercase tracking-widest text-navy-500 mb-4">
          GERELATEERDE PEPTIDEN
        </h2>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {related.map((product) => {
            const price =
              product.variants?.[0]?.calculated_price?.calculated_amount

            return (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="group border border-border overflow-hidden transition-colors hover:border-navy-200"
              >
                <div className="relative h-32 bg-surface-tertiary">
                  {product.thumbnail ? (
                    <Image
                      src={product.thumbnail}
                      alt={product.title ?? ""}
                      fill
                      className="object-contain"
                      sizes="(min-width: 768px) 25vw, 50vw"
                    />
                  ) : null}
                </div>

                <div className="p-3">
                  <p className="text-[9px] font-medium uppercase tracking-wider text-mauve-500 mb-0.5">
                    PEPTIDE
                  </p>
                  <p className="text-sm font-semibold text-navy-500 group-hover:text-teal-400 transition-colors">
                    {product.title}
                  </p>
                  <p className="mt-1 text-sm font-bold text-navy-500">
                    {price != null
                      ? formatPrice(price)
                      : "Prijs op aanvraag"}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      </section>
    )
  } catch {
    return null
  }
}
