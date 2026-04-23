import Link from "next/link"

import medusa from "@/lib/medusa"
import { getDefaultRegionId } from "@/lib/region"
import { centsToEuros } from "@/lib/price"
import { ResearchDisclaimer } from "@/components/ResearchDisclaimer"
import { TrustBadges } from "@/components/product/TrustBadges"
import { ProductCatalog } from "@/components/product/ProductCatalog"
import type { ProductCardProps } from "@/components/ProductCard"

export const revalidate = 60

export const metadata = {
  title: "Onderzoekspeptiden | Inovix Research Peptides",
  description:
    "Ontdek ons assortiment hoogwaardige peptiden voor wetenschappelijk onderzoek. HPLC-getest, ≥99% zuiverheid, EU verzending.",
}

async function getProducts() {
  try {
    const regionId = await getDefaultRegionId()
    const { products } = await medusa.store.product.list({
      region_id: regionId,
      fields:
        "id,title,description,subtitle,thumbnail,metadata,variants.id,variants.calculated_price,variants.inventory_quantity",
    })
    return products
  } catch {
    return []
  }
}

export default async function ProductsPage() {
  const products = await getProducts()

  const categorySet = new Set<string>()
  const productCards: ProductCardProps[] = products.map((product) => {
    const variant = product.variants?.[0]
    const price = variant?.calculated_price?.calculated_amount
    const meta = product.metadata as Record<string, unknown> | null
    const category = meta?.category as string | undefined
    const inventoryQty = (
      variant as unknown as { inventory_quantity?: number }
    )?.inventory_quantity
    const status =
      inventoryQty != null && inventoryQty <= 0
        ? "out-of-stock"
        : inventoryQty != null && inventoryQty <= 10
          ? "low-stock"
          : "in-stock"

    if (category) categorySet.add(category)

    return {
      name: product.title ?? "Onbekend product",
      description: product.description ?? "",
      price: price != null ? centsToEuros(price) : 0,
      dosage: product.subtitle ?? "",
      purity: Number(meta?.purity) || 0,
      category,
      status: status as "in-stock" | "out-of-stock" | "low-stock",
      image: product.thumbnail || "/images/product-peptide.png",
      productId: product.id,
      variants: (product.variants ?? []).map((v) => ({ id: v.id })),
      href: `/products/${product.id}`,
    }
  })

  const categories = Array.from(categorySet).sort()

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Breadcrumbs */}
      <nav
        aria-label="Breadcrumb"
        className="mb-4 text-[11px] uppercase tracking-wide text-navy-500/45"
      >
        <Link href="/" className="inline-flex items-center py-1.5 -my-1.5 transition-colors hover:text-navy-500">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="font-medium text-mauve-500">Peptiden</span>
      </nav>

      {/* Research disclaimer */}
      <ResearchDisclaimer
        variant="warning"
        text="Uitsluitend voor onderzoek. Alle producten zijn uitsluitend bedoeld voor laboratoriumonderzoek. Niet voor menselijke consumptie."
        className="mb-6"
      />

      {/* Hero section */}
      <div className="mb-8">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          Catalogus
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-navy-500 sm:text-4xl">
          Onderzoekspeptiden
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
          Hoogwaardige peptiden voor wetenschappelijk onderzoek. Alle producten
          zijn HPLC-getest met &ge;99% zuiverheid en worden geleverd vanuit de
          EU.
        </p>
        <TrustBadges
          purity={99}
          badges={["hplc_tested", "third_party_verified", "eu_shipping"]}
          className="mt-4"
        />
      </div>

      {/* Divider */}
      <div className="mb-6 border-t border-border" />

      {/* Product catalog */}
      {products.length === 0 ? (
        <p className="py-16 text-center text-sm text-muted-foreground">
          Geen producten beschikbaar.
        </p>
      ) : (
        <ProductCatalog products={productCards} categories={categories} />
      )}
    </main>
  )
}
