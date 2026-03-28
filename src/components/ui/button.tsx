"use client"

import * as React from "react"
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-md border border-transparent bg-clip-padding font-medium whitespace-nowrap transition-all duration-150 outline-none select-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        primary:
          "bg-teal-400 text-white hover:bg-teal-500 active:bg-teal-600",
        secondary:
          "bg-navy-500 text-white hover:bg-navy-400 active:bg-navy-600",
        outline:
          "border-teal-400 text-teal-400 bg-transparent hover:bg-teal-50 active:bg-teal-100",
        ghost:
          "text-navy-500 bg-transparent hover:bg-surface-secondary active:bg-surface-tertiary",
        danger:
          "bg-red-600 text-white hover:bg-red-700 active:bg-red-800",
        link: "text-teal-400 underline-offset-4 hover:underline",
        primaryOnDark:
          "bg-white text-navy-500 hover:bg-white/90 active:bg-white/80",
        ghostOnDark:
          "border-white/30 text-white bg-transparent hover:bg-white/10 active:bg-white/15",
      },
      size: {
        sm: "h-8 gap-1.5 px-3 py-1.5 text-sm",
        md: "h-10 gap-2 px-5 py-2.5 text-sm",
        lg: "h-12 gap-2 px-7 py-3 text-base",
        icon: "size-10",
        "icon-sm": "size-8",
        "icon-lg": "size-12",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      fullWidth: false,
    },
  }
)

export interface ButtonProps
  extends ButtonPrimitive.Props,
    VariantProps<typeof buttonVariants> {
  fullWidth?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, ...props }, ref) => {
    return (
      <ButtonPrimitive
        ref={ref}
        data-slot="button"
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
