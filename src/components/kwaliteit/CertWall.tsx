const certifications = [
  {
    stamp: "cGMP",
    name: "cGMP-gecertificeerde Productie",
    description:
      "Current Good Manufacturing Practice. Faciliteiten worden periodiek geauditeerd door onafhankelijke instanties.",
  },
  {
    stamp: ["Ph.", "Eur."],
    name: "Europese Farmacopee",
    description:
      "Alle testspecificaties en acceptatielimieten zijn conform de Europese Farmacopee standaarden.",
  },
  {
    stamp: ["ISO", "9001"],
    name: "ISO 9001:2015",
    description:
      "Kwaliteitsmanagementsysteem voor consistente productie, procesbeheersing en continue verbetering.",
  },
  {
    stamp: ["3rd", "Party"],
    name: "Onafhankelijke EU Laboratoria",
    description:
      "Alle analyses worden uitgevoerd door geaccrediteerde derde-partij laboratoria binnen de Europese Unie.",
  },
  {
    stamp: ["LOT", "ID"],
    name: "Volledige Batch Traceability",
    description:
      "Elk product is traceerbaar van grondstof tot eindproduct via unieke lotnummers en productierecords.",
  },
]

export function CertWall() {
  return (
    <div>
      <p className="mb-5 border-b border-border pb-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-teal-400">
        Certificeringen & Standaarden
      </p>
      <div className="flex flex-col">
        {certifications.map((cert, i) => (
          <div
            key={cert.name}
            className={`flex gap-4 py-4 ${
              i < certifications.length - 1 ? "border-b border-border" : ""
            }`}
          >
            <div className="relative flex size-12 shrink-0 items-center justify-center border-2 border-border">
              <span className="text-center font-mono text-[8px] font-bold leading-tight text-teal-400">
                {Array.isArray(cert.stamp)
                  ? cert.stamp.map((line, j) => (
                      <span key={j}>
                        {line}
                        {j < cert.stamp.length - 1 && <br />}
                      </span>
                    ))
                  : cert.stamp}
              </span>
              <div className="absolute -bottom-1 -right-1 flex size-4 items-center justify-center bg-teal-400 text-[9px] text-white">
                ✓
              </div>
            </div>
            <div>
              <p className="text-[13px] font-semibold text-navy-500">
                {cert.name}
              </p>
              <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">
                {cert.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
