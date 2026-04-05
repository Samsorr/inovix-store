import { Thermometer, Clock, Droplets } from "lucide-react"
import { cn } from "@/lib/utils"

interface StorageCardsProps {
  storageTemp?: string
  shelfLife?: string
  solubility?: string
  handlingNotes?: string
  className?: string
}

export function StorageCards({
  storageTemp,
  shelfLife,
  solubility,
  handlingNotes,
  className,
}: StorageCardsProps) {
  const cards = [
    { icon: Thermometer, value: storageTemp, label: "Bewaartemperatuur" },
    { icon: Clock, value: shelfLife, label: "Houdbaarheid" },
    { icon: Droplets, value: solubility, label: "Oplosbaarheid" },
  ].filter((card) => card.value)

  if (cards.length === 0 && !handlingNotes) {
    return null
  }

  return (
    <div className={cn(className)}>
      {cards.length > 0 && (
        <div className="flex flex-col gap-4 sm:flex-row">
          {cards.map((card) => (
            <div
              key={card.label}
              className="flex-1 bg-surface-secondary p-4 text-center"
            >
              <card.icon className="mx-auto mb-2 size-5 text-teal-400" />
              <p className="text-sm font-semibold text-navy-500">
                {card.value}
              </p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                {card.label}
              </p>
            </div>
          ))}
        </div>
      )}

      {handlingNotes && (
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          {handlingNotes}
        </p>
      )}
    </div>
  )
}
