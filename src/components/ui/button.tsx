"use client"

import * as React from "react"
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center font-medium whitespace-nowrap transition-[background-size,background-color,color,transform,box-shadow,border-color,opacity] duration-200 ease-out outline-none select-none focus-visible:ring-2 focus-visible:ring-navy-500/40 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 active:duration-75 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        primary:
          "text-white bg-teal-400 bg-[image:linear-gradient(to_right,var(--color-teal-300)_100%,transparent_100%)] bg-[length:0%_100%] bg-[position:0_0] bg-no-repeat hover:bg-[length:100%_100%] hover:-translate-y-px hover:shadow-[0_4px_14px_-3px_rgba(55,120,140,0.4)] active:translate-y-0 active:shadow-none",
        secondary:
          "bg-navy-500 text-white hover:bg-navy-400 hover:-translate-y-px hover:shadow-[0_4px_14px_-3px_rgba(22,32,67,0.4)] active:translate-y-0 active:bg-navy-600 active:shadow-none",
        outline:
          "border border-teal-400 text-teal-400 bg-transparent bg-[image:linear-gradient(to_right,var(--color-teal-400)_100%,transparent_100%)] bg-[length:0%_100%] bg-[position:0_0] bg-no-repeat hover:bg-[length:100%_100%] hover:text-white hover:-translate-y-px hover:shadow-[0_4px_14px_-3px_rgba(55,120,140,0.25)] active:translate-y-0 active:shadow-none",
        outlineSecondary:
          "border border-navy-500 text-navy-500 bg-transparent bg-[image:linear-gradient(to_right,var(--color-navy-500)_100%,transparent_100%)] bg-[length:0%_100%] bg-[position:0_0] bg-no-repeat hover:bg-[length:100%_100%] hover:text-white hover:-translate-y-px hover:shadow-[0_4px_14px_-3px_rgba(22,32,67,0.25)] active:translate-y-0 active:shadow-none",
        ghost:
          "text-navy-500 bg-transparent hover:bg-surface-secondary active:bg-surface-tertiary",
        danger:
          "bg-red-600 text-white hover:bg-red-700 hover:-translate-y-px hover:shadow-[0_4px_14px_-3px_rgba(220,38,38,0.35)] active:translate-y-0 active:bg-red-800 active:shadow-none",
        link: "text-teal-400 underline-offset-4 hover:underline",
        primaryOnDark:
          "text-navy-500 bg-white bg-[image:linear-gradient(to_right,var(--color-mauve-500)_100%,transparent_100%)] bg-[length:0%_100%] bg-[position:0_0] bg-no-repeat hover:bg-[length:100%_100%] hover:text-white hover:-translate-y-px hover:shadow-[0_4px_14px_-3px_rgba(142,90,128,0.35)] active:translate-y-0 active:shadow-none",
        ghostOnDark:
          "border border-white/30 text-white bg-transparent bg-[image:linear-gradient(to_right,rgba(255,255,255,0.15)_100%,transparent_100%)] bg-[length:0%_100%] bg-[position:0_0] bg-no-repeat hover:bg-[length:100%_100%] hover:border-white/50 active:bg-[length:100%_100%]",
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
