const methods = [
  {
    abbr: "HPLC",
    name: "Zuiverheidsanalyse",
    full: "High-Performance Liquid Chromatography",
    description:
      "Scheidt en kwantificeert componenten in het peptide-mengsel. De hoofdpiek als percentage van totale piekoppervlakte bepaalt de zuiverheid.",
    ref: "Ref: Ph. Eur. 2.2.29 // RP-C18 kolom",
  },
  {
    abbr: "LC-MS",
    name: "Identiteitsverificatie",
    full: "Liquid Chromatography-Mass Spectrometry",
    description:
      "Combineert chromatografische scheiding met massaspectrometrie voor exacte molecuulgewichtbepaling. Bevestigt dat de correcte structuur is gesynthetiseerd.",
    ref: "Ref: Ph. Eur. 2.2.43 // ESI-TOF",
  },
  {
    abbr: "LAL",
    name: "Endotoxinetest",
    full: "Limulus Amebocyte Lysate Assay",
    description:
      "Detecteert bacteriële endotoxinen die afkomstig zijn van gramnegatieve bacteriën. Essentieel voor de veiligheid van in-vitro onderzoek.",
    ref: "Ref: USP <85> // Limiet: <0.5 EU/mg",
  },
  {
    abbr: "TAMC",
    name: "Bioburden Screening",
    full: "Total Aerobic Microbial Count",
    description:
      "Kwantificeert het totale aantal aerobe micro-organismen en gisten/schimmels per gram product.",
    ref: "Ref: USP <61> // Limiet: <100 CFU/g",
  },
]

export function MethodCards() {
  return (
    <div>
      <p className="mb-5 border-b border-border pb-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-teal-400">
        Analysemethoden
      </p>
      <div className="flex flex-col gap-4">
        {methods.map((method) => (
          <div
            key={method.abbr}
            className="border border-border border-l-[3px] border-l-teal-400 bg-surface-50 p-4 pl-[19px] transition-transform duration-200 hover:translate-x-1 sm:p-5 sm:pl-[23px]"
          >
            <div className="flex items-center gap-3">
              <span className="border border-teal-400/15 bg-teal-400/[0.06] px-2 py-1 font-mono text-[10px] font-bold tracking-[0.04em] text-teal-400">
                {method.abbr}
              </span>
              <span className="text-[13px] font-bold text-navy-500">
                {method.name}
              </span>
            </div>
            <p className="mt-1 text-[10px] italic text-muted-foreground">
              {method.full}
            </p>
            <p className="mt-1.5 text-xs leading-[1.7] text-muted-foreground">
              {method.description}
            </p>
            <p className="mt-2 font-mono text-[9px] text-teal-400/50">
              {method.ref}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
