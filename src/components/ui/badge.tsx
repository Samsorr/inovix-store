import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-sm font-medium uppercase tracking-wider whitespace-nowrap transition-all [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        dosage:
          "border border-teal-100 bg-teal-50/60 text-teal-600",
        inStock:
          "border border-emerald-100 bg-emerald-50/60 text-emerald-700",
        outOfStock:
          "border border-red-100 bg-red-50/60 text-red-600",
        lowStock:
          "border border-amber-100 bg-amber-50/60 text-amber-700",
        bestSeller:
          "border border-navy-400 bg-navy-500 text-white",
        category:
          "border border-navy-100 bg-navy-50/60 text-navy-400",
        purity:
          "border border-teal-100 bg-teal-50/60 text-teal-600",
      },
      size: {
        sm: "px-2 py-0.5 text-[10px]",
        md: "px-2.5 py-0.5 text-xs",
      },
    },
    defaultVariants: {
      variant: "category",
      size: "sm",
    },
  }
)

export interface BadgeProps
  extends useRender.ComponentProps<"span">,
    VariantProps<typeof badgeVariants> {}

function Badge({
  className,
  variant = "category",
  size = "sm",
  render,
  ...props
}: BadgeProps) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant, size }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }
