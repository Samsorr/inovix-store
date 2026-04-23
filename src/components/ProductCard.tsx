"use client"

import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { FlaskConical, ShoppingCart, BadgeCheck } from "lucide-react"

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

export function ProductCard({
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
}: ProductCardProps) {
  const router = useRouter()
  const { addItem, isUpdating } = useCart()
  const hasMultipleVariants = variants.length > 1
  const firstVariantId = variants[0]?.id
  const isOutOfStock = status === "out-of-stock"

  async function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
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

  return (
    <article
      aria-label={name}
      className={cn(
        "group relative isolate flex flex-col overflow-hidden border border-border bg-card transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-navy-200 hover:shadow-md",
        isOutOfStock && "opacity-80",
        className
      )}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface-secondary">
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className={cn(
              "object-contain p-6 transition-transform duration-500 ease-out group-hover:scale-[1.03]",
              isOutOfStock && "grayscale"
            )}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <FlaskConical
              className="size-12 text-navy-200"
              aria-hidden="true"
            />
          </div>
        )}

        {/* Status + bestSeller pills */}
        <div className="absolute left-4 top-4 flex items-center gap-1.5">
          <Badge variant={statusInfo.variant} size="sm">
            {statusInfo.label}
          </Badge>
          {bestSeller && (
            <Badge variant="bestSeller" size="sm">
              Best Seller
            </Badge>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-semibold tracking-tight text-navy-500">
          {href ? (
            <Link
              href={href}
              className="outline-none before:absolute before:inset-0 before:z-0 focus-visible:before:outline-2 focus-visible:before:outline-offset-2 focus-visible:before:outline-teal-400"
            >
              {name}
            </Link>
          ) : (
            name
          )}
        </h3>

        {/* Primary metadata */}
        <div className="mt-1.5 flex items-baseline gap-2 text-xs text-navy-400">
          {dosage && (
            <span className="font-medium tabular-nums text-navy-500">
              {dosage}
            </span>
          )}
          {dosage && purity > 0 && (
            <span className="text-border" aria-hidden="true">
              |
            </span>
          )}
          {purity > 0 && (
            <span className="tabular-nums">&ge;{purity}% zuiverheid</span>
          )}
        </div>

        {/* Description */}
        <p className="mt-3 line-clamp-2 min-h-[2.5rem] text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>

        {/* Trust signals */}
        <div className="mt-4 flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-navy-400">
          <BadgeCheck
            className="size-3.5 text-teal-400"
            aria-hidden="true"
          />
          HPLC getest
          <span className="text-border" aria-hidden="true">
            ·
          </span>
          EU verzending
        </div>

        {/* Price + CTA */}
        <div className="mt-auto pt-5">
          <div className="flex items-baseline gap-1 tabular-nums">
            <span className="text-sm font-medium text-navy-400">
              {currency}
            </span>
            <span className="text-2xl font-bold tracking-tight text-navy-500">
              {formattedPrice}
            </span>
          </div>
          <Button
            variant="primary"
            size="md"
            fullWidth
            className="relative z-10 mt-3"
            disabled={isOutOfStock || isUpdating}
            onClick={handleAddToCart}
            aria-label={`${name} toevoegen aan winkelwagen`}
          >
            <ShoppingCart className="size-4" />
            {isOutOfStock
              ? "Niet beschikbaar"
              : isUpdating
                ? "Toevoegen..."
                : hasMultipleVariants
                  ? "Kies variant"
                  : "Toevoegen"}
          </Button>
        </div>
      </div>
    </article>
  )
}
