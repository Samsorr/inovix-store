import Image from "next/image"
import Link from "next/link"
import medusa from "@/lib/medusa"
import { getDefaultRegionId } from "@/lib/region"

export const metadata = {
  title: "Products | Inovix Research Peptides",
}

async function getProducts() {
  const regionId = await getDefaultRegionId()
  const { products } = await medusa.store.product.list({
    region_id: regionId,
    fields: "id,title,thumbnail,variants.calculated_price",
  })
  return products
}

export default async function ProductsPage() {
  const products = await getProducts()

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
        <strong>Research Use Only.</strong> All products on this site are intended strictly for
        laboratory research purposes. Not for human consumption. For use by qualified researchers
        only.
      </div>

      <h1 className="text-2xl font-bold mb-6">Research Peptides</h1>

      {products.length === 0 && (
        <p className="text-gray-500">No products available.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => {
          const price = product.variants?.[0]?.calculated_price?.calculated_amount

          return (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="relative h-48 bg-gray-100">
                {product.thumbnail ? (
                  <Image
                    src={product.thumbnail}
                    alt={product.title ?? "Product image"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                    No image
                  </div>
                )}
              </div>
              <div className="p-4">
                <h2 className="font-semibold text-sm mb-1 line-clamp-2">{product.title}</h2>
                {price != null ? (
                  <p className="text-gray-700 text-sm">
                    {(price / 100).toFixed(2)} EUR
                  </p>
                ) : (
                  <p className="text-gray-400 text-sm">Price on request</p>
                )}
              </div>
            </Link>
          )
        })}
      </div>
    </main>
  )
}
