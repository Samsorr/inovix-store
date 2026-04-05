import { cn } from "@/lib/utils"

interface SpecsTableProps {
  sequence?: string
  molecularFormula?: string
  molecularWeight?: string
  casNumber?: string
  purity?: number
  physicalState?: string
  solubility?: string
  shelfLife?: string
  className?: string
}

export function SpecsTable({
  sequence,
  molecularFormula,
  molecularWeight,
  casNumber,
  purity,
  physicalState,
  solubility,
  shelfLife,
  className,
}: SpecsTableProps) {
  const specs: { label: string; value: React.ReactNode }[] = []

  if (sequence) {
    specs.push({
      label: "Sequentie",
      value: <span className="font-mono text-[11px]">{sequence}</span>,
    })
  }

  if (molecularFormula) {
    specs.push({ label: "Molecuulformule", value: molecularFormula })
  }

  if (molecularWeight) {
    specs.push({ label: "Molecuulgewicht", value: molecularWeight })
  }

  if (casNumber) {
    specs.push({ label: "CAS-nummer", value: casNumber })
  }

  if (purity !== undefined) {
    specs.push({
      label: "Zuiverheid",
      value: <span className="font-semibold">{`≥${purity}% (HPLC)`}</span>,
    })
  }

  if (physicalState) {
    specs.push({ label: "Fysieke staat", value: physicalState })
  }

  if (solubility) {
    specs.push({ label: "Oplosbaarheid", value: solubility })
  }

  if (shelfLife) {
    specs.push({ label: "Houdbaarheid", value: shelfLife })
  }

  return (
    <table className={cn("w-full border-collapse", className)}>
      <tbody>
        {specs.map((spec) => (
          <tr
            key={spec.label}
            className="border-b border-border last:border-b-0"
          >
            <td className="w-[35%] bg-surface-secondary px-4 py-3 text-[11px] font-medium uppercase tracking-wider text-muted-foreground align-top">
              {spec.label}
            </td>
            <td className="px-4 py-3 text-sm text-navy-500">{spec.value}</td>
          </tr>
        ))}
        <tr
          className={cn(
            "border-b border-border last:border-b-0",
            specs.length === 0 && "first:border-t-0"
          )}
        >
          <td className="w-[35%] bg-surface-secondary px-4 py-3 text-[11px] font-medium uppercase tracking-wider text-muted-foreground align-top">
            Toepassing
          </td>
          <td className="px-4 py-3 text-sm font-medium text-amber-700">
            Uitsluitend voor in-vitro onderzoek (RUO)
          </td>
        </tr>
      </tbody>
    </table>
  )
}
