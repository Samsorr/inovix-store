import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

export interface InputProps extends React.ComponentProps<"input"> {
  label?: string
  error?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, id, ...props }, ref) => {
    const inputId = id || React.useId()

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-navy-500"
          >
            {label}
          </label>
        )}
        <InputPrimitive
          ref={ref}
          id={inputId}
          type={type}
          data-slot="input"
          aria-invalid={!!error || undefined}
          className={cn(
            "h-11 w-full min-w-0 rounded-lg border border-border bg-transparent px-3 py-2.5 text-base transition-colors outline-none placeholder:text-muted-foreground focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-surface-secondary disabled:opacity-50 aria-invalid:border-red-500 aria-invalid:ring-2 aria-invalid:ring-red-500/20 md:text-sm",
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
