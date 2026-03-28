import { cn } from "@/lib/utils"

export interface GradientSectionProps {
  children: React.ReactNode
  subtle?: boolean
  className?: string
}

export function GradientSection({
  children,
  subtle = false,
  className,
}: GradientSectionProps) {
  return (
    <section
      className={cn(
        subtle ? "gradient-brand-subtle" : "gradient-brand",
        "text-white",
        className
      )}
    >
      {children}
    </section>
  )
}
