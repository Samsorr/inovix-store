import Image from "next/image"
import { notFound } from "next/navigation"
import medusa from "@/lib/medusa"
import { getDefaultRegionId } from "@/lib/region"
import { ProductActions } from "@/components/ProductActions"

export const revalidate = 60

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

          {/* Variant selection + Add to Cart */}
          {product.variants && product.variants.length > 0 && (
            <ProductActions variants={product.variants} />
          )}

          <p className="text-xs text-muted-foreground">
            Door dit product te bestellen bevestigt u dat u een gekwalificeerde onderzoeker
            bent en het uitsluitend voor laboratoriumonderzoek zult gebruiken.
          </p>
        </div>
      </div>
    </main>
  )
}
