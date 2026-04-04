import medusa from "@/lib/medusa"
import { getDefaultRegionId } from "@/lib/region"
import { ResearchDisclaimer } from "@/components/ResearchDisclaimer"
import { ProductCard } from "@/components/ProductCard"

export const revalidate = 60

export const metadata = {
  title: "Producten | Inovix Research Peptides",
}

async function getProducts() {
  try {
    const regionId = await getDefaultRegionId()
    const { products } = await medusa.store.product.list({
      region_id: regionId,
      fields: "id,title,description,thumbnail,variants.id,variants.calculated_price",
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
          const price =
            product.variants?.[0]?.calculated_price?.calculated_amount ?? 0
          const variants = (product.variants ?? []).map((v) => ({ id: v.id }))

          return (
            <ProductCard
              key={product.id}
              name={product.title ?? "Onbekend product"}
              description={product.description ?? ""}
              price={price / 100}
              dosage=""
              purity={0}
              status="in-stock"
              image={product.thumbnail ?? undefined}
              productId={product.id}
              variants={variants}
              href={`/products/${product.id}`}
            />
          )
        })}
      </div>
    </main>
  )
}
