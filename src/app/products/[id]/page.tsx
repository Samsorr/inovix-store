import { notFound } from "next/navigation"
import Link from "next/link"
import type { Metadata } from "next"

import medusa from "@/lib/medusa"
import { getDefaultRegionId } from "@/lib/region"
import { ResearchDisclaimer } from "@/components/ResearchDisclaimer"
import { ProductImageGallery } from "@/components/product/ProductImageGallery"
import { TrustBadges, type TrustBadgeKey } from "@/components/product/TrustBadges"
import { ProductActions } from "@/components/product/ProductActions"
import { ProductTabs } from "@/components/product/ProductTabs"
import { SpecsTable } from "@/components/product/SpecsTable"
import { StorageCards } from "@/components/product/StorageCards"
import { RelatedProducts } from "@/components/product/RelatedProducts"
import { DescriptionBlock } from "@/components/product/DescriptionBlock"

export const revalidate = 60

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  try {
    const regionId = await getDefaultRegionId()
    const { product } = await medusa.store.product.retrieve(id, {
      region_id: regionId,
    })
    return {
      title: `${product.title} | Inovix Research Peptides`,
      description:
        product.description?.slice(0, 160) ??
        `${product.title} | onderzoekspeptide beschikbaar bij Inovix.`,
      openGraph: {
        images: product.thumbnail ? [product.thumbnail] : [],
      },
    }
  } catch {
    return { title: "Product Not Found | Inovix" }
  }
}

async function getProduct(id: string) {
  try {
    const regionId = await getDefaultRegionId()
    const { product } = await medusa.store.product.retrieve(id, {
      region_id: regionId,
      fields:
        "id,title,description,subtitle,thumbnail,images,metadata,collection,variants.calculated_price,variants.title,variants.sku,variants.inventory_quantity",
    })
    return product
  } catch {
    return null
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params
  const product = await getProduct(id)

  if (!product) {
    notFound()
  }

  const regionId = await getDefaultRegionId()
  const images = product.images ?? []
  const metadata = (product.metadata ?? {}) as Record<string, unknown>

  // Extract metadata fields
  const sequence = metadata.sequence as string | undefined
  const molecularFormula = metadata.molecular_formula as string | undefined
  const molecularWeight = metadata.molecular_weight as string | undefined
  const casNumber = metadata.cas_number as string | undefined
  const purity = Number(metadata.purity) || undefined
  const physicalState = metadata.physical_state as string | undefined
  const solubility = metadata.solubility as string | undefined
  const shelfLife = metadata.shelf_life as string | undefined
  const storageTemp = metadata.storage_temp as string | undefined
  const handlingNotes = metadata.handling_notes as string | undefined
  const coaUrl = metadata.coa_url as string | undefined
  const longDescription = metadata.long_description as string | undefined
  const category = metadata.category as string | undefined
  const badges = Array.isArray(metadata.badges)
    ? (metadata.badges as TrustBadgeKey[])
    : []

  // Check if storage tab has data
  const hasStorage = storageTemp || shelfLife || solubility || handlingNotes

  return (
    <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Breadcrumbs */}
      <nav
        aria-label="Breadcrumb"
        className="mb-4 text-[11px] uppercase tracking-wide text-navy-500/45"
      >
        <Link href="/" className="transition-colors hover:text-navy-500">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link
          href="/products"
          className="transition-colors hover:text-navy-500"
        >
          Peptiden
        </Link>
        <span className="mx-2">/</span>
        <span className="font-medium text-mauve-500">{product.title}</span>
      </nav>

      {/* Research disclaimer — amber warning */}
      <ResearchDisclaimer
        variant="warning"
        text="Uitsluitend voor onderzoek. Dit product is uitsluitend bedoeld voor laboratoriumonderzoek. Niet voor menselijke consumptie. Alleen voor gekwalificeerde onderzoekers."
        className="mb-6"
      />

      {/* Hero: 2-column layout */}
      <div className="mb-10 grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Left: Product images */}
        <ProductImageGallery
          images={images.map((img) => ({ id: img.id, url: img.url }))}
          thumbnail={product.thumbnail ?? null}
          title={product.title ?? "Product"}
        />

        {/* Right: Product info */}
        <div>
          {/* Category badge */}
          {category && (
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-mauve-500">
              {category}
            </p>
          )}

          {/* Title */}
          <h1 className="text-2xl font-bold tracking-tight text-navy-500">
            {product.title}
          </h1>

          {/* Subtitle */}
          {product.subtitle && (
            <p className="mt-1 text-sm text-muted-foreground">
              {product.subtitle}
            </p>
          )}

          {/* Trust badges */}
          <TrustBadges purity={purity} badges={badges} className="mt-4" />

          {/* Divider */}
          <div className="mt-5 border-t border-border" />

          {/* Product actions: price, variants, quantity, CTA, CoA, disclaimer */}
          {product.variants && product.variants.length > 0 && (
            <div className="mt-5">
              <ProductActions
                variants={product.variants}
                coaUrl={coaUrl}
                productId={product.id}
                productTitle={product.title ?? "Product"}
                thumbnail={product.thumbnail ?? null}
              />
            </div>
          )}
        </div>
      </div>

      {/* Tabbed content */}
      <ProductTabs
        tabs={[
          {
            id: "specs",
            label: "Specificaties",
            content: (
              <SpecsTable
                sequence={sequence}
                molecularFormula={molecularFormula}
                molecularWeight={molecularWeight}
                casNumber={casNumber}
                purity={purity}
                physicalState={physicalState}
                solubility={solubility}
                shelfLife={shelfLife}
              />
            ),
          },
          {
            id: "description",
            label: "Beschrijving",
            content:
              product.description || longDescription ? (
                <DescriptionBlock
                  shortDescription={product.description}
                  longHtml={longDescription}
                />
              ) : null,
          },
          {
            id: "storage",
            label: "Opslag & Handling",
            content: hasStorage ? (
              <StorageCards
                storageTemp={storageTemp}
                shelfLife={shelfLife}
                solubility={solubility}
                handlingNotes={handlingNotes}
              />
            ) : null,
          },
        ]}
        className="mb-10"
      />

      {/* Related products */}
      <div className="border-t border-border pt-8">
        <RelatedProducts
          currentProductId={product.id}
          regionId={regionId}
        />
      </div>
    </main>
  )
}
