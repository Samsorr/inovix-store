import Image from "next/image"

export function CoaPreview() {
  return (
    <div className="relative">
      {/* Callout markers (hidden on mobile) */}
      {[
        { num: 1, top: "72px" },
        { num: 2, top: "168px" },
        { num: 3, top: "230px" },
        { num: 4, top: "295px" },
      ].map((c) => (
        <div
          key={c.num}
          aria-hidden="true"
          className="absolute hidden items-center gap-1.5 lg:flex"
          style={{ top: c.top, left: "-50px" }}
        >
          <div className="flex size-5 items-center justify-center bg-mauve-500 text-[10px] font-bold text-white">
            {c.num}
          </div>
          <div className="h-px w-6 bg-mauve-500" />
        </div>
      ))}

      {/* Document */}
      <div className="border border-border bg-white">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border bg-navy-500 px-4 py-4 sm:px-6 sm:py-5">
          <Image
            src="/images/inovix-logo.png"
            alt="Inovix"
            width={118}
            height={20}
            className="h-5 w-auto brightness-0 invert"
          />
          <span className="border border-teal-400/40 px-2.5 py-1 font-mono text-[9px] font-semibold uppercase tracking-[0.06em] text-teal-400">
            Certificate of Analysis
          </span>
        </div>

        {/* Body */}
        <div className="px-4 py-4 sm:px-6 sm:py-5">
          {/* Meta grid */}
          <div className="mb-4 grid grid-cols-2 gap-2 border-b border-border pb-4">
            {[
              { label: "Product", value: "BPC-157" },
              { label: "Lotnummer", value: "INX-2026-0412" },
              { label: "Hoeveelheid", value: "5 mg" },
              { label: "Productiedatum", value: "2026-03-18" },
            ].map((meta) => (
              <div key={meta.label}>
                <p className="text-[9px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                  {meta.label}
                </p>
                <p className="font-mono text-xs font-semibold text-navy-500">
                  {meta.value}
                </p>
              </div>
            ))}
          </div>

          {/* Purity & Identity */}
          <div className="mb-4">
            <p className="mb-2 border-b border-teal-400/15 pb-1.5 text-[9px] font-semibold uppercase tracking-[0.08em] text-teal-400">
              Zuiverheid & Identiteit
            </p>
            {[
              { test: "Zuiverheid (HPLC)", result: "99.3%", status: "CONFORM" },
              {
                test: "Molecuulgewicht (MS)",
                result: "1419.53 g/mol",
                status: "BEVESTIGD",
              },
            ].map((row) => (
              <div
                key={row.test}
                className="grid grid-cols-[1fr_auto_auto] items-center gap-4 border-b border-[#f5f5f5] py-[7px] text-[11px] last:border-b-0"
              >
                <span className="font-medium text-navy-500">{row.test}</span>
                <span className="font-mono font-semibold text-teal-400">
                  {row.result}
                </span>
                <span className="bg-teal-400/[0.06] px-2 py-0.5 font-mono text-[9px] font-semibold text-teal-400">
                  {row.status}
                </span>
              </div>
            ))}
          </div>

          {/* Safety parameters */}
          <div>
            <p className="mb-2 border-b border-teal-400/15 pb-1.5 text-[9px] font-semibold uppercase tracking-[0.08em] text-teal-400">
              Veiligheidsparameters
            </p>
            {[
              {
                test: "Endotoxine (LAL)",
                result: "<0.5 EU/mg",
                status: "CONFORM",
              },
              {
                test: "Bioburden (TAMC)",
                result: "<10 CFU/g",
                status: "CONFORM",
              },
            ].map((row) => (
              <div
                key={row.test}
                className="grid grid-cols-[1fr_auto_auto] items-center gap-4 border-b border-[#f5f5f5] py-[7px] text-[11px] last:border-b-0"
              >
                <span className="font-medium text-navy-500">{row.test}</span>
                <span className="font-mono font-semibold text-teal-400">
                  {row.result}
                </span>
                <span className="bg-teal-400/[0.06] px-2 py-0.5 font-mono text-[9px] font-semibold text-teal-400">
                  {row.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border bg-teal-400/[0.03] px-4 py-3 sm:px-6 sm:py-3.5">
          <span className="flex items-center gap-1.5 font-mono text-[10px] font-bold tracking-[0.04em] text-teal-400">
            ✓ VRIJGEGEVEN
          </span>
          <span className="font-mono text-[10px] text-muted-foreground">
            2026-03-20
          </span>
        </div>
      </div>
    </div>
  )
}
