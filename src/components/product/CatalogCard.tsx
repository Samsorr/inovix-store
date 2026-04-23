"use client"

import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { FlaskConical, ShoppingCart, BadgeCheck } from "lucide-react"

import { cn } from "@/lib/utils"
import { useCart } from "@/lib/context/cart-context"
import { Button } from "@/components/ui/button"
import type { ProductCardProps } from "@/components/ProductCard"

const statusConfig = {
  "in-stock": {
    label: "Op voorraad",
    dot: "bg-emerald-500",
    pill: "border-emerald-100 bg-emerald-50 text-emerald-700",
  },
  "out-of-stock": {
    label: "Uitverkocht",
    dot: "bg-red-500",
    pill: "border-red-100 bg-red-50 text-red-600",
  },
  "low-stock": {
    label: "Beperkt",
    dot: "bg-amber-500",
    pill: "border-amber-100 bg-amber-50 text-amber-700",
  },
} as const

export function CatalogCard({
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
  href,
  className,
}: Omit<ProductCardProps, "bestSeller">) {
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
        "group relative isolate flex flex-col overflow-hidden border border-border bg-white transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-navy-200 hover:shadow-md",
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
            sizes="(min-width: 1536px) 22vw, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
            className={cn(
              "object-contain p-6 transition-transform duration-500 ease-out group-hover:scale-[1.03]",
              isOutOfStock && "grayscale"
            )}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <FlaskConical
              className="size-10 text-navy-200"
              aria-hidden="true"
            />
          </div>
        )}

        {/* Status pill */}
        <div
          className={cn(
            "absolute left-3 top-3 inline-flex items-center gap-1.5 border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider",
            statusInfo.pill
          )}
        >
          <span
            className={cn("block size-1.5", statusInfo.dot)}
            aria-hidden="true"
          />
          {statusInfo.label}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        {/* Category */}
        {category && (
          <p className="text-[10px] font-semibold uppercase tracking-widest text-mauve-500">
            {category}
          </p>
        )}

        {/* Title — single anchor covers full card */}
        <h3 className={cn("font-semibold tracking-tight text-navy-500 text-base", category && "mt-1")}>
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

        {/* Primary metadata — dosage + purity directly under title */}
        <div className="mt-1 flex items-baseline gap-2 text-xs text-navy-400">
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
        <p className="mt-2 line-clamp-2 min-h-[2rem] text-xs leading-relaxed text-muted-foreground">
          {description}
        </p>

        {/* Trust signals */}
        <div className="mt-3 flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-navy-400">
          <BadgeCheck
            className="size-3 text-teal-400"
            aria-hidden="true"
          />
          HPLC getest
          <span className="text-border" aria-hidden="true">
            ·
          </span>
          EU verzending
        </div>

        {/* Price + CTA */}
        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          <div className="min-w-0">
            <div className="flex items-baseline gap-0.5 tabular-nums">
              <span className="text-sm font-medium text-navy-400">
                {currency}
              </span>
              <span className="text-xl font-bold tracking-tight text-navy-500">
                {formattedPrice}
              </span>
            </div>
            <p className="text-[9px] uppercase tracking-wider text-muted-foreground">
              Incl. BTW
            </p>
          </div>
          <Button
            variant="primary"
            size="sm"
            className="relative z-10"
            disabled={isOutOfStock || isUpdating}
            onClick={handleAddToCart}
            aria-label={`${name} toevoegen aan winkelwagen`}
          >
            <ShoppingCart className="size-3.5" />
            {isOutOfStock
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
