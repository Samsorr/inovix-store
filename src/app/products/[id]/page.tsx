import Image from "next/image"
import { notFound } from "next/navigation"
import medusa from "@/lib/medusa"
import { getDefaultRegionId } from "@/lib/region"

export const dynamic = "force-dynamic"

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params
  try {
    const regionId = await getDefaultRegionId()
    const { product } = await medusa.store.product.retrieve(id, { region_id: regionId })
    return { title: `${product.title} | Inovix Research Peptides` }
  } catch {
    return { title: "Product Not Found | Inovix" }
  }
}

async function getProduct(id: string) {
  try {
    const regionId = await getDefaultRegionId()
    const { product } = await medusa.store.product.retrieve(id, {
      region_id: regionId,
      fields: "id,title,description,thumbnail,images,variants.calculated_price,variants.title,variants.sku",
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

  const images = product.images ?? []
  const displayImage = images[0]?.url ?? product.thumbnail

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
        <strong>Research Use Only.</strong> This product is intended strictly for laboratory
        research purposes. Not for human consumption. For use by qualified researchers only.
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Images */}
        <div className="space-y-3">
          <div className="relative h-80 bg-gray-100 rounded-lg overflow-hidden">
            {displayImage ? (
              <Image
                src={displayImage}
                alt={product.title ?? "Product image"}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                No image available
              </div>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {images.slice(1).map((img) => (
                <div
                  key={img.id}
                  className="relative flex-shrink-0 w-20 h-20 bg-gray-100 rounded overflow-hidden"
                >
                  <Image
                    src={img.url}
                    alt={product.title ?? "Product image"}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">{product.title}</h1>

          {product.description && (
            <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
          )}

          {/* Variants */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-2">
              <h2 className="font-semibold text-sm uppercase tracking-wide text-gray-500">
                Variants
              </h2>
              <div className="space-y-2">
                {product.variants.map((variant) => {
                  const price = variant.calculated_price?.calculated_amount
                  return (
                    <div
                      key={variant.id}
                      className="flex justify-between items-center border rounded p-3 text-sm"
                    >
                      <div>
                        <span className="font-medium">{variant.title}</span>
                        {variant.sku && (
                          <span className="ml-2 text-gray-400 text-xs">SKU: {variant.sku}</span>
                        )}
                      </div>
                      <span className="font-semibold">
                        {price != null ? `${(price / 100).toFixed(2)} EUR` : "—"}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Add to Cart — placeholder */}
          <button
            className="w-full bg-gray-900 text-white py-3 px-6 rounded font-medium hover:bg-gray-700 transition-colors cursor-not-allowed opacity-60"
            disabled
          >
            Add to Cart (coming soon)
          </button>

          <p className="text-xs text-gray-400">
            By purchasing this product, you confirm you are a qualified researcher and agree to use
            it solely for legitimate research purposes.
          </p>
        </div>
      </div>
    </main>
  )
}
