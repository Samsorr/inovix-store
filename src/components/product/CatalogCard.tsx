"use client"

import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { FlaskConical, ShoppingCart } from "lucide-react"

import { cn } from "@/lib/utils"
import { useCart } from "@/lib/context/cart-context"
import { Button } from "@/components/ui/button"
import type { ProductCardProps } from "@/components/ProductCard"

const statusConfig = {
  "in-stock": { label: "Op voorraad", dot: "bg-emerald-500" },
  "out-of-stock": { label: "Uitverkocht", dot: "bg-red-500" },
  "low-stock": { label: "Beperkt", dot: "bg-amber-500" },
} as const

function CatalogCardInner({
  name,
  description,
  price,
  currency = "€",
  dosage,
  purity,
  category,
  status,
  image,
  productId,
  variants = [],
  className,
}: Omit<ProductCardProps, "href" | "bestSeller">) {
  const router = useRouter()
  const { addItem, isUpdating } = useCart()
  const hasMultipleVariants = variants.length > 1
  const firstVariantId = variants[0]?.id

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
      className={cn(
        "group flex flex-col overflow-hidden border border-border bg-white transition-colors hover:border-navy-200",
        className
      )}
    >
      {/* Image area */}
      <div className="relative flex h-[180px] items-center justify-center bg-surface-tertiary sm:h-[200px]">
        {image ? (
          <Image
            src={image}
            alt={name}
            width={240}
            height={240}
            className="h-full w-full object-contain p-6"
          />
        ) : (
          <FlaskConical className="size-10 text-navy-200" />
        )}

        {/* Status indicator */}
        <div className="absolute left-3 top-3 flex items-center gap-1.5">
          <span
            className={cn("block size-1.5", statusInfo.dot)}
            aria-hidden="true"
          />
          <span className="text-[9px] font-medium uppercase tracking-wider text-navy-400">
            {statusInfo.label}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        {/* Category */}
        {category && (
          <p className="text-[9px] font-semibold uppercase tracking-widest text-mauve-500">
            {category}
          </p>
        )}

        {/* Title */}
        <h3 className="mt-1 text-sm font-semibold tracking-tight text-navy-500 transition-colors group-hover:text-teal-400">
          {name}
        </h3>

        {/* Description */}
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
          {description}
        </p>

        {/* Divider */}
        <div className="mt-3 border-t border-border" />

        {/* Specs row */}
        <div className="mt-3 flex items-center gap-3 text-[10px]">
          {purity > 0 && (
            <span className="flex items-center gap-1 font-medium text-navy-500">
              <span
                className="block size-1.5 bg-teal-400"
                aria-hidden="true"
              />
              &ge;{purity}%
            </span>
          )}
          {dosage && (
            <span className="text-muted-foreground">{dosage}</span>
          )}
        </div>

        {/* Price + CTA */}
        <div className="mt-auto flex items-end justify-between gap-2 pt-4">
          <div>
            <span className="text-lg font-bold tracking-tight text-navy-500">
              {currency}
              {formattedPrice}
            </span>
            <p className="text-[9px] text-muted-foreground">Incl. BTW</p>
          </div>
          <Button
            variant="primary"
            size="sm"
            disabled={status === "out-of-stock" || isUpdating}
            onClick={handleAddToCart}
            aria-label={`${name} toevoegen aan winkelwagen`}
          >
            <ShoppingCart className="size-3.5" />
            {status === "out-of-stock"
              ? "Uitverkocht"
              : isUpdating
                ? "..."
                : hasMultipleVariants
                  ? "Kies"
                  : "Koop"}
          </Button>
        </div>
      </div>
    </article>
  )
}

export function CatalogCard({ href, bestSeller: _, ...props }: ProductCardProps) {
  if (href) {
    return (
      <Link
        href={href}
        className="block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-400"
      >
        <CatalogCardInner {...props} />
      </Link>
    )
  }
  return <CatalogCardInner {...props} />
}
