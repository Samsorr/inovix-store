"use client"

import { motion } from "motion/react"

interface DetailRow {
  label: string
  value: string
  pass?: boolean
}

interface Step {
  number: string
  title: string
  tags: string[]
  description: string
  details?: DetailRow[]
}

const steps: Step[] = [
  {
    number: "01",
    title: "Peptide Synthese",
    tags: ["SPPS"],
    description:
      "Solid-Phase Peptide Synthesis in een cGMP-gecertificeerde faciliteit. Aminozuren worden stapsgewijs gekoppeld aan een vaste drager voor maximale zuiverheid en reproduceerbaarheid.",
  },
  {
    number: "02",
    title: "Preparatieve Purificatie",
    tags: ["PREP-HPLC"],
    description:
      "Het ruwe peptide wordt gezuiverd via preparatieve HPLC. Onzuiverheden, onvolledige sequenties en bijproducten worden verwijderd tot een zuiverheid van ≥99%.",
  },
  {
    number: "03",
    title: "Analytische HPLC",
    tags: ["ZUIVERHEID"],
    description:
      "Elke batch wordt geanalyseerd op zuiverheid via High-Performance Liquid Chromatography. Het chromatogram toont de piek-zuiverheid als percentage.",
    details: [
      { label: "Methode", value: "RP-HPLC C18" },
      { label: "Retentietijd", value: "12.4 min" },
      { label: "Zuiverheid", value: "≥99.0%", pass: true },
      { label: "Specificatie", value: "CONFORM", pass: true },
    ],
  },
  {
    number: "04",
    title: "LC-MS Verificatie",
    tags: ["IDENTITEIT"],
    description:
      "Liquid Chromatography-Mass Spectrometry bevestigt dat het molecuulgewicht overeenkomt met de theoretische waarde. Dit garandeert dat het juiste peptide is gesynthetiseerd.",
    details: [
      { label: "Theoretisch MW", value: "1419.53 g/mol" },
      { label: "Gemeten MW", value: "1419.56 g/mol", pass: true },
      { label: "Identiteit", value: "BEVESTIGD", pass: true },
    ],
  },
  {
    number: "05",
    title: "Veiligheidstesten",
    tags: ["USP <85>", "USP <61>"],
    description:
      "LAL-assay voor endotoxinen en TAMC/TYMC-analyse voor microbiologische contaminatie. Alle limieten conform Europese Farmacopee en USP-standaarden.",
    details: [
      { label: "Endotoxine (LAL)", value: "<0.5 EU/mg", pass: true },
      { label: "Bioburden (TAMC)", value: "<10 CFU/g", pass: true },
      { label: "Status", value: "CONFORM", pass: true },
    ],
  },
  {
    number: "06",
    title: "CoA & Snelle EU-Verzending",
    tags: ["EU"],
    description:
      "Na vrijgave wordt het Certificaat van Analyse gegenereerd en het product zorgvuldig verpakt. Snelle verzending binnen de Europese Unie met tracking tot aan uw laboratorium.",
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
}

const itemVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
}

export function KwaliteitProcessTimeline() {
  return (
    <section className="bg-surface-50">
      <div className="section-y mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
          Ons Proces
        </p>
        <h2 className="mt-2 text-xl font-bold text-navy-500 sm:text-[22px]">
          Van synthese tot levering: 6 kwaliteitscontroles
        </h2>

        <motion.div
          className="mt-8 flex flex-col sm:mt-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              variants={itemVariants}
              className="relative grid grid-cols-[44px_1fr] sm:grid-cols-[56px_1fr]"
            >
              {/* Vertical connecting line */}
              <div
                aria-hidden="true"
                className="absolute bottom-0 left-[21.5px] top-0 w-px bg-border sm:left-[27.5px]"
                style={{
                  top: i === 0 ? "20px" : "0",
                  bottom: i === steps.length - 1 ? "calc(100% - 20px)" : "0",
                }}
              />

              {/* Node */}
              <div className="relative z-[2] flex justify-center">
                <div className="flex size-9 items-center justify-center border-2 border-teal-400 bg-white font-mono text-[10px] font-bold text-teal-400 sm:size-10 sm:text-[11px]">
                  {step.number}
                </div>
              </div>

              {/* Content */}
              <div className={`pl-4 ${i === steps.length - 1 ? "pb-0" : "pb-10"}`}>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-[13px] font-bold text-navy-500">
                    {step.title}
                  </h3>
                  {step.tags.map((tag) => (
                    <span
                      key={tag}
                      className="border border-teal-400/25 px-1.5 py-0.5 font-mono text-[9px] font-medium text-teal-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="mt-1.5 text-xs leading-[1.7] text-muted-foreground">
                  {step.description}
                </p>

                {step.details && (
                  <div className="mt-3 border border-border bg-white p-3 sm:p-4">
                    {step.details.map((row) => (
                      <div
                        key={row.label}
                        className="flex items-center justify-between border-b border-[#f5f5f5] py-1.5 last:border-b-0"
                      >
                        <span className="text-[10px] font-medium uppercase tracking-[0.04em] text-muted-foreground">
                          {row.label}
                        </span>
                        <span
                          className={`font-mono text-[11px] font-semibold ${
                            row.pass ? "text-teal-400" : "text-navy-500"
                          }`}
                        >
                          {row.value}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
