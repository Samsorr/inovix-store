import Image from "next/image"
import Link from "next/link"
import medusa from "@/lib/medusa"
import { getDefaultRegionId } from "@/lib/region"
import { formatPrice } from "@/lib/price"
import { ResearchDisclaimer } from "@/components/ResearchDisclaimer"

export const revalidate = 60

export const metadata = {
  title: "Producten | Inovix Research Peptides",
}

async function getProducts() {
  try {
    const regionId = await getDefaultRegionId()
    const { products } = await medusa.store.product.list({
      region_id: regionId,
      fields: "id,title,thumbnail,variants.calculated_price",
    })
    return products
  } catch {
    return []
  }
}

export default async function ProductsPage() {
  const products = await getProducts()

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <ResearchDisclaimer />

      <h1 className="mb-6 mt-6 text-2xl font-bold text-navy-500">Onderzoekspeptiden</h1>

      {products.length === 0 && (
        <p className="text-muted-foreground">Geen producten beschikbaar.</p>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => {
          const price = product.variants?.[0]?.calculated_price?.calculated_amount

          return (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="overflow-hidden rounded-lg border border-border bg-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="relative h-48 bg-surface-secondary">
                {product.thumbnail ? (
                  <Image
                    src={product.thumbnail}
                    alt={product.title ?? "Product afbeelding"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                    Geen afbeelding
                  </div>
                )}
              </div>
              <div className="p-4">
                <h2 className="mb-1 line-clamp-2 text-sm font-semibold text-navy-500">
                  {product.title}
                </h2>
                {price != null ? (
                  <p className="text-sm font-medium text-navy-400">
                    {formatPrice(price)}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">Prijs op aanvraag</p>
                )}
              </div>
            </Link>
          )
        })}
      </div>
    </main>
  )
}
