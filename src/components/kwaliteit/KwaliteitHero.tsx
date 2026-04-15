"use client"

import { motion } from "motion/react"
import { cn } from "@/lib/utils"
import { Navbar } from "@/components/Navbar"

const floatingData = [
  { text: "C₆₂H₉₈N₁₆O₂₂", className: "top-[18%] left-[4%] -rotate-[4deg]", breathDelay: 0 },
  { text: "MW: 1419.53 g/mol", className: "top-[32%] right-[3%] rotate-[2deg]", breathDelay: 1.2 },
  { text: "Rt: 12.4 min", className: "bottom-[28%] left-[6%] -rotate-[2deg]", breathDelay: 2.4 },
  { text: "USP <85> <0.5 EU/mg", className: "top-[14%] right-[10%] rotate-[3deg]", breathDelay: 0.8 },
  { text: "LOT: INX-2026-0412", className: "bottom-[22%] right-[5%] -rotate-[1deg]", breathDelay: 1.8 },
  { text: "SPPS // Fmoc", className: "top-[55%] left-[3%] rotate-[1deg]", breathDelay: 3.2 },
  { text: "RP-C18 // 220nm", className: "bottom-[42%] right-[8%] -rotate-[3deg]", breathDelay: 2.0 },
]

const credentialTags = [
  "HPLC GEANALYSEERD",
  "LC-MS GEVERIFIEERD",
  "Ph. Eur. CONFORM",
  "EU LABORATORIA",
]

/* HPLC chromatogram — starts and ends at the very edges (x=0 and x=1200) */
const chromLine =
  "M0 185 L60 184 L120 182 L200 179 L280 174 L330 168 L360 155 L380 130 L392 90 L398 50 L400 15 L402 50 L408 90 L420 130 L440 155 L465 165 L500 170 L530 166 L548 155 L558 135 L565 115 L570 100 L575 115 L582 135 L592 155 L610 166 L650 172 L720 177 L820 181 L940 183 L1060 184 L1200 185"

const chromFill = chromLine + " L1200 200 L0 200Z"

const SCAN_DURATION = 12
const PEAK_POSITION = 400 / 1200

/* Grid line y-positions with labels */
const gridLines = [
  { y: 155, label: "25%" },
  { y: 115, label: "50%" },
  { y: 75, label: "75%" },
  { y: 35, label: "100%" },
]

export function KwaliteitHero() {
  return (
    <section className="relative overflow-hidden gradient-brand-subtle text-center">
      <Navbar transparent />
      <div className="relative px-4 pb-16 pt-12 sm:px-6 sm:pb-20 sm:pt-16 md:py-24">
      {/* Floating molecular data — breathing opacity */}
      {floatingData.map((item, i) => (
        <motion.span
          key={item.text}
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.8, 0.8] }}
          transition={{ duration: 1.2, delay: 0.8 + i * 0.15, times: [0, 1, 1] }}
          className={cn(
            "absolute hidden whitespace-nowrap font-mono text-[10px] lg:block",
            item.className
          )}
        >
          <motion.span
            animate={{ opacity: [0.18, 0.3, 0.18] }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2.5 + item.breathDelay,
            }}
            className="text-teal-300"
          >
            {item.text}
          </motion.span>
        </motion.span>
      ))}

      {/* ═══ HPLC Chromatogram — full width, edge to edge ═══ */}
      <motion.svg
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[60%] w-full sm:h-[55%] md:h-[65%]"
        viewBox="0 0 1200 200"
        preserveAspectRatio="none"
        fill="none"
        initial="hidden"
        animate="visible"
      >
        {/* Filled area under curve */}
        <motion.path
          d={chromFill}
          fill="white"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 0.04, transition: { duration: 1.5, delay: 1.2 } },
          }}
        />

        {/* Horizontal grid lines with labels */}
        {gridLines.map(({ y, label }) => (
          <g key={y}>
            <motion.line
              x1="0" y1={y} x2="1200" y2={y}
              stroke="white"
              strokeWidth="0.5"
              strokeDasharray="4 8"
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 0.07, transition: { duration: 1, delay: 0.3 } },
              }}
            />
            {/* Y-axis label */}
            <motion.text
              x="16" y={y - 4}
              fill="white"
              fontSize="7"
              fontFamily="monospace"
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 0.1, transition: { duration: 1, delay: 0.6 } },
              }}
            >
              {label}
            </motion.text>
          </g>
        ))}

        {/* Baseline */}
        <motion.line
          x1="0" y1={185} x2="1200" y2={185}
          stroke="white"
          strokeWidth="0.5"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 0.1, transition: { duration: 1, delay: 0.2 } },
          }}
        />

        {/* Main chromatogram line — draws itself */}
        <motion.path
          d={chromLine}
          stroke="url(#chromGradient)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          variants={{
            hidden: { pathLength: 0, opacity: 0 },
            visible: {
              pathLength: 1,
              opacity: 1,
              transition: {
                pathLength: { duration: 2.5, ease: "easeInOut", delay: 0.3 },
                opacity: { duration: 0.3, delay: 0.3 },
              },
            },
          }}
        />

        {/* Peak marker dot */}
        <motion.circle
          cx="400" cy="15" r="3"
          fill="#37788C"
          variants={{
            hidden: { opacity: 0, scale: 0 },
            visible: {
              opacity: 1,
              scale: 1,
              transition: { duration: 0.4, delay: 1.6, type: "spring", stiffness: 300 },
            },
          }}
        />
        {/* Peak pulse ring — synced to scanning line */}
        <motion.circle
          cx="400" cy="15" r="3"
          fill="#37788C"
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 0.5, 0.8, 0.5, 0],
            scale: [1, 1, 1.8, 1, 1],
          }}
          transition={{
            duration: SCAN_DURATION,
            repeat: Infinity,
            times: [
              0,
              PEAK_POSITION - 0.03,
              PEAK_POSITION,
              PEAK_POSITION + 0.03,
              PEAK_POSITION + 0.08,
            ],
            delay: 3.5,
            ease: "easeInOut",
          }}
        />

        {/* Peak label */}
        <motion.text
          x="400" y="6"
          textAnchor="middle"
          fill="white"
          fontSize="8"
          fontFamily="monospace"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 0.3, transition: { duration: 0.5, delay: 1.8 } },
          }}
        >
          99.3%
        </motion.text>

        {/* Scanning line */}
        <motion.line
          x1="0" y1="0" x2="0" y2="200"
          stroke="#37788C"
          strokeWidth="1"
          initial={{ opacity: 0 }}
          animate={{
            x: [0, 1200],
            opacity: [0, 0.4, 0.4, 0],
          }}
          transition={{
            x: { duration: SCAN_DURATION, repeat: Infinity, ease: "linear", delay: 3.5 },
            opacity: {
              duration: SCAN_DURATION,
              repeat: Infinity,
              ease: "linear",
              times: [0, 0.02, 0.95, 1],
              delay: 3.5,
            },
          }}
        />
        {/* Scanning line glow — same position, just wider and softer */}
        <motion.line
          x1="0" y1="0" x2="0" y2="200"
          stroke="#37788C"
          strokeWidth="12"
          initial={{ opacity: 0 }}
          animate={{
            x: [0, 1200],
            opacity: [0, 0.03, 0.03, 0],
          }}
          transition={{
            x: { duration: SCAN_DURATION, repeat: Infinity, ease: "linear", delay: 3.5 },
            opacity: {
              duration: SCAN_DURATION,
              repeat: Infinity,
              ease: "linear",
              times: [0, 0.02, 0.95, 1],
              delay: 3.5,
            },
          }}
        />

        <defs>
          <linearGradient id="chromGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="white" stopOpacity="0.08" />
            <stop offset="25%" stopColor="white" stopOpacity="0.18" />
            <stop offset="35%" stopColor="#37788C" stopOpacity="0.35" />
            <stop offset="50%" stopColor="#37788C" stopOpacity="0.25" />
            <stop offset="65%" stopColor="white" stopOpacity="0.15" />
            <stop offset="100%" stopColor="white" stopOpacity="0.06" />
          </linearGradient>
        </defs>
      </motion.svg>

      {/* Content */}
      <div className="relative mx-auto max-w-[720px]">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-xs font-medium uppercase tracking-widest text-teal-200"
        >
          Kwaliteit & Analyse
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mt-5 flex items-baseline justify-center gap-1 sm:mt-7"
        >
          <span className="text-[52px] font-extrabold leading-none tracking-[-0.04em] text-white sm:text-[72px] md:text-[80px]">
            ≥99
          </span>
          <span className="text-[32px] font-bold leading-none text-teal-400 sm:text-[44px] md:text-[48px]">
            %
          </span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="mt-5 text-base leading-relaxed text-white/60"
        >
          Gemiddelde zuiverheid. Elke batch. Elke keer.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="mt-5 flex flex-wrap justify-center gap-1.5 sm:mt-9 sm:gap-3"
        >
          {credentialTags.map((tag) => (
            <span
              key={tag}
              className="border border-teal-400/25 px-2 py-1 font-mono text-[8px] font-medium text-teal-300/70 sm:px-3.5 sm:py-1.5 sm:text-[10px]"
            >
              {tag}
            </span>
          ))}
        </motion.div>
      </div>
      </div>
    </section>
  )
}
