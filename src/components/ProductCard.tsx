"use client"

import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { FlaskConical, ShoppingCart } from "lucide-react"

import { cn } from "@/lib/utils"
import { useCart } from "@/lib/context/cart-context"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const statusConfig = {
  "in-stock": { label: "In Stock", variant: "inStock" as const },
  "out-of-stock": { label: "Out of Stock", variant: "outOfStock" as const },
  "low-stock": { label: "Low Stock", variant: "lowStock" as const },
}

export interface ProductCardProps {
  name: string
  description: string
  price: number
  currency?: string
  dosage: string
  purity: number
  category?: string
  status: "in-stock" | "out-of-stock" | "low-stock"
  bestSeller?: boolean
  image?: string
  productId: string
  variants?: Array<{ id: string }>
  href?: string
  className?: string
}

function ProductCardInner({
  name,
  description,
  price,
  currency = "€",
  dosage,
  purity,
  status,
  bestSeller,
  image,
  productId,
  variants = [],
  href,
  className,
}: Omit<ProductCardProps, "category">) {
  const router = useRouter()
  const { addItem, isUpdating } = useCart()
  const hasMultipleVariants = variants.length > 1
  const firstVariantId = variants[0]?.id

  async function handleAddToCart() {
    if (hasMultipleVariants) {
      router.push(`/products/${productId}`)
      return
    }
    if (firstVariantId) {
      await addItem(firstVariantId, 1)
    }
  }

  const statusInfo = statusConfig[status]
  const formattedPrice = new Intl.NumberFormat("nl-NL", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price)
  const refCode = `${name.replace(/[^A-Z0-9]/gi, "").slice(0, 2).toUpperCase()}-${String(Math.abs(hashCode(name)) % 1000).padStart(3, "0")}`

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden border border-border bg-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
        className
      )}
    >
      {/* Badge row — single status badge only */}
      <div className="flex items-center gap-1.5 px-4 pt-4 sm:px-5 sm:pt-5">
        {bestSeller && (
          <Badge variant="bestSeller" size="sm">
            Best Seller
          </Badge>
        )}
        <Badge variant={statusInfo.variant} size="sm">
          {statusInfo.label}
        </Badge>
      </div>

      {/* Product image */}
      <div className="mx-4 mt-3 flex h-[200px] items-center justify-center overflow-hidden bg-surface-secondary sm:mx-5 sm:h-[220px]">
        {image ? (
          <Image
            src={image}
            alt={name}
            width={240}
            height={240}
            className="h-full w-full object-contain p-4"
          />
        ) : (
          <FlaskConical className="size-12 text-muted-foreground/30" />
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col px-4 pt-3 sm:px-5 sm:pt-4">
        <div className="flex items-baseline justify-between gap-2">
          {href ? (
            <Link
              href={href}
              className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-400 before:absolute before:inset-0 before:z-0"
            >
              <h3 className="text-base font-semibold tracking-tight text-navy-500 sm:text-lg">
                {name}
              </h3>
            </Link>
          ) : (
            <h3 className="text-base font-semibold tracking-tight text-navy-500 sm:text-lg">
              {name}
            </h3>
          )}
          <span className="shrink-0 font-mono text-[10px] tracking-wide text-muted-foreground">
            {refCode}
          </span>
        </div>
        <p className="mt-1 min-h-[2.5rem] line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>

      {/* Key-value pairs */}
      <div className="mx-4 mt-4 space-y-0 border-t border-border sm:mx-5 sm:mt-5">
        <div className="flex items-center justify-between border-b border-dashed border-border py-2">
          <span className="text-xs text-muted-foreground">Zuiverheid</span>
          <span className="text-sm font-medium text-teal-400">
            {purity}%
          </span>
        </div>
        <div className="flex items-center justify-between py-2">
          <span className="text-xs text-muted-foreground">Formaat</span>
          <span className="text-sm font-medium text-navy-500">{dosage}</span>
        </div>
      </div>

      {/* Footer: price + add to cart */}
      <div className="relative z-10 mt-auto flex flex-col gap-3 px-4 pb-4 pt-3 sm:px-5 sm:pb-5 sm:pt-4">
        <span className="text-xl font-bold tracking-tight text-navy-500">
          {currency}{formattedPrice}
        </span>
        <Button
          variant="primary"
          size="md"
          fullWidth
          disabled={status === "out-of-stock" || isUpdating}
          onClick={handleAddToCart}
          aria-label={`${name} toevoegen aan winkelwagen`}
        >
          <ShoppingCart className="size-4" />
          {status === "out-of-stock"
            ? "Niet beschikbaar"
            : isUpdating
              ? "Toevoegen..."
              : hasMultipleVariants
                ? "Kies variant"
                : "Toevoegen"}
        </Button>
      </div>
    </article>
  )
}

export function ProductCard({ category: _, ...props }: ProductCardProps) {
  return <ProductCardInner {...props} />
}

function hashCode(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
    hash |= 0
  }
  return hash
}
