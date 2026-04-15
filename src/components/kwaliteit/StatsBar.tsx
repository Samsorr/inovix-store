const stats = [
  { id: "QC-001", label: "Zuiverheid", value: "≥99", unit: "%", unitLabel: "Gemiddelde Zuiverheid", barWidth: "99%" },
  { id: "QC-002", label: "Protocol", value: "6", unit: "", unitLabel: "Tests Per Batch", barWidth: "100%" },
  { id: "QC-003", label: "Verificatie", value: "100", unit: "%", unitLabel: "Onafhankelijk Getest", barWidth: "100%" },
  { id: "QC-004", label: "Compliance", value: "Ph.Eur.", unit: "", unitLabel: "Europese Farmacopee", barWidth: "100%" },
]

export function StatsBar() {
  return (
    <section className="border-y border-border bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-2 md:grid-cols-4">
        {stats.map((stat, i) => (
          <div
            key={stat.id}
            className={`border-border px-4 py-6 sm:px-6 sm:py-7 ${
              i < 2 ? "max-md:border-b" : ""
            } ${i % 2 === 0 ? "max-md:border-r" : ""} ${
              i < stats.length - 1 ? "md:border-r" : ""
            }`}
          >
            <p className="font-mono text-[9px] font-medium uppercase tracking-[0.06em] text-teal-400/70">
              {stat.id} // {stat.label}
            </p>
            <p className="mt-3 text-[26px] font-bold leading-none tracking-[-0.02em] text-navy-500 sm:text-[32px]">
              {stat.value}
              {stat.unit && (
                <span className="text-[16px] text-teal-400 sm:text-[20px]">{stat.unit}</span>
              )}
            </p>
            <p className="mt-1.5 text-[9px] font-semibold uppercase tracking-[0.1em] text-muted-foreground sm:text-[10px]">
              {stat.unitLabel}
            </p>
            <div className="relative mt-3 h-0.5 bg-border" aria-hidden="true">
              <div
                className="absolute left-0 top-0 h-full bg-teal-400"
                style={{ width: stat.barWidth }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
