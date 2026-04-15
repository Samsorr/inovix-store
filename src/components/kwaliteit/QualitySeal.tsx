export function QualitySeal() {
  return (
    <div
      aria-hidden="true"
      className="relative mb-7 inline-flex size-[72px] flex-col items-center justify-center border-2 border-teal-400/30"
    >
      <div className="absolute inset-1 border border-teal-400/15" />
      <span className="text-[20px] text-teal-400">✓</span>
      <span className="mt-0.5 font-mono text-[7px] font-bold tracking-[0.06em] text-teal-400/50">
        VERIFIED
      </span>
    </div>
  )
}
