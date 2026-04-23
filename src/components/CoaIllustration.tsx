export function CoaIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 288 352"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Voorbeeld Certificate of Analysis"
      className={className}
    >
      <defs>
        <linearGradient id="coa-paper" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#F8F9FB" />
        </linearGradient>
        <linearGradient id="coa-header" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#162043" />
          <stop offset="100%" stopColor="#1f2d5c" />
        </linearGradient>
        <linearGradient id="coa-chart" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#37788C" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#37788C" stopOpacity="0" />
        </linearGradient>
        <path id="seal-arc" d="M -30 0 A 30 30 0 0 1 30 0" fill="none" />
      </defs>

      {/* Decorative back paper (offset, mauve tint) */}
      <g transform="translate(28 20)">
        <rect
          x="0"
          y="0"
          width="240"
          height="320"
          fill="#AC6E9B"
          opacity="0.08"
        />
        <rect
          x="0"
          y="0"
          width="240"
          height="320"
          fill="none"
          stroke="#AC6E9B"
          strokeOpacity="0.25"
          strokeWidth="1"
        />
      </g>

      {/* Decorative back paper 2 (teal tint) */}
      <g transform="translate(20 10)">
        <rect
          x="0"
          y="0"
          width="240"
          height="320"
          fill="#37788C"
          opacity="0.06"
        />
        <rect
          x="0"
          y="0"
          width="240"
          height="320"
          fill="none"
          stroke="#37788C"
          strokeOpacity="0.2"
          strokeWidth="1"
        />
      </g>

      {/* Main certificate */}
      <g transform="translate(8 0)">
        {/* Paper */}
        <rect
          x="0"
          y="0"
          width="240"
          height="320"
          fill="url(#coa-paper)"
          stroke="#E2E5EB"
          strokeWidth="1"
        />

        {/* Header bar */}
        <rect x="0" y="0" width="240" height="44" fill="url(#coa-header)" />
        <rect x="14" y="14" width="62" height="6" rx="1" fill="#FFFFFF" />
        <rect
          x="14"
          y="24"
          width="40"
          height="4"
          rx="1"
          fill="#FFFFFF"
          opacity="0.45"
        />
        {/* COA badge */}
        <rect
          x="156"
          y="14"
          width="70"
          height="16"
          fill="none"
          stroke="#37788C"
          strokeOpacity="0.6"
          strokeWidth="1"
        />
        <text
          x="191"
          y="25"
          textAnchor="middle"
          fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
          fontSize="7"
          fontWeight="700"
          fill="#37788C"
          letterSpacing="0.8"
        >
          CERTIFICATE OF ANALYSIS
        </text>

        {/* Meta grid */}
        <g transform="translate(16 60)">
          {[0, 1, 2, 3].map((i) => {
            const col = i % 2
            const row = Math.floor(i / 2)
            return (
              <g key={i} transform={`translate(${col * 104} ${row * 28})`}>
                <rect
                  x="0"
                  y="0"
                  width="42"
                  height="4"
                  rx="1"
                  fill="#162043"
                  opacity="0.35"
                />
                <rect
                  x="0"
                  y="9"
                  width="70"
                  height="6"
                  rx="1"
                  fill="#162043"
                />
              </g>
            )
          })}
        </g>

        {/* Divider */}
        <line
          x1="16"
          y1="128"
          x2="224"
          y2="128"
          stroke="#E2E5EB"
          strokeWidth="1"
        />

        {/* Section label */}
        <rect
          x="16"
          y="140"
          width="84"
          height="5"
          rx="1"
          fill="#37788C"
          opacity="0.85"
        />

        {/* HPLC chart */}
        <g transform="translate(16 156)">
          {/* Chart frame */}
          <rect
            x="0"
            y="0"
            width="208"
            height="78"
            fill="#FFFFFF"
            stroke="#E2E5EB"
            strokeWidth="1"
          />
          {/* Grid lines */}
          {[1, 2, 3].map((i) => (
            <line
              key={`h-${i}`}
              x1="0"
              y1={i * 19.5}
              x2="208"
              y2={i * 19.5}
              stroke="#E2E5EB"
              strokeOpacity="0.6"
              strokeDasharray="2 3"
            />
          ))}
          {[1, 2, 3, 4, 5].map((i) => (
            <line
              key={`v-${i}`}
              x1={i * 34.6}
              y1="0"
              x2={i * 34.6}
              y2="78"
              stroke="#E2E5EB"
              strokeOpacity="0.6"
              strokeDasharray="2 3"
            />
          ))}

          {/* Chart fill */}
          <path
            d="M 0 70 L 18 68 L 32 66 L 48 64 L 58 60 L 66 50 L 72 24 L 78 8 L 84 24 L 90 50 L 100 64 L 120 66 L 140 64 L 150 58 L 156 44 L 162 30 L 168 44 L 174 58 L 184 66 L 208 68 L 208 78 L 0 78 Z"
            fill="url(#coa-chart)"
          />
          {/* Chart stroke */}
          <path
            d="M 0 70 L 18 68 L 32 66 L 48 64 L 58 60 L 66 50 L 72 24 L 78 8 L 84 24 L 90 50 L 100 64 L 120 66 L 140 64 L 150 58 L 156 44 L 162 30 L 168 44 L 174 58 L 184 66 L 208 68"
            fill="none"
            stroke="#37788C"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Main peak marker */}
          <circle cx="78" cy="8" r="2.5" fill="#37788C" />
          <line
            x1="78"
            y1="8"
            x2="78"
            y2="-4"
            stroke="#37788C"
            strokeWidth="1"
          />
          <text
            x="78"
            y="-7"
            textAnchor="middle"
            fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
            fontSize="7"
            fontWeight="700"
            fill="#37788C"
          >
            99.3%
          </text>
        </g>

        {/* Result rows */}
        <g transform="translate(16 250)">
          {[0, 1, 2].map((i) => (
            <g key={i} transform={`translate(0 ${i * 16})`}>
              <rect
                x="0"
                y="0"
                width="90"
                height="5"
                rx="1"
                fill="#162043"
                opacity="0.55"
              />
              <rect
                x="130"
                y="0"
                width="34"
                height="5"
                rx="1"
                fill="#37788C"
              />
              <rect
                x="172"
                y="-2"
                width="36"
                height="9"
                fill="#37788C"
                opacity="0.08"
              />
              <text
                x="190"
                y="4.5"
                textAnchor="middle"
                fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
                fontSize="5"
                fontWeight="700"
                fill="#37788C"
                letterSpacing="0.4"
              >
                CONFORM
              </text>
              <line
                x1="0"
                y1="11"
                x2="208"
                y2="11"
                stroke="#F1F3F7"
                strokeWidth="1"
              />
            </g>
          ))}
        </g>

        {/* Footer bar */}
        <rect
          x="0"
          y="298"
          width="240"
          height="22"
          fill="#37788C"
          opacity="0.05"
        />
        <line
          x1="0"
          y1="298"
          x2="240"
          y2="298"
          stroke="#E2E5EB"
          strokeWidth="1"
        />
        <text
          x="16"
          y="312"
          fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
          fontSize="7"
          fontWeight="700"
          fill="#37788C"
          letterSpacing="0.5"
        >
          ✓ VRIJGEGEVEN
        </text>
        <text
          x="224"
          y="312"
          textAnchor="end"
          fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
          fontSize="7"
          fill="#162043"
          opacity="0.55"
        >
          2026-03-20
        </text>
      </g>

      {/* Verification seal — bottom right, overlapping */}
      <g transform="translate(232 278)">
        <circle
          cx="0"
          cy="0"
          r="40"
          fill="#FFFFFF"
          stroke="#AC6E9B"
          strokeWidth="1"
        />
        <circle
          cx="0"
          cy="0"
          r="34"
          fill="none"
          stroke="#AC6E9B"
          strokeWidth="1"
          strokeDasharray="2 3"
        />
        <circle cx="0" cy="0" r="26" fill="#162043" />
        {/* Checkmark */}
        <path
          d="M -10 0 L -3 7 L 11 -7"
          stroke="#FFFFFF"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Curved text along seal — simplified as small arcs */}
        <text
          fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
          fontSize="6"
          fontWeight="700"
          fill="#AC6E9B"
          letterSpacing="1.2"
        >
          <textPath
            href="#seal-arc"
            startOffset="50%"
            textAnchor="middle"
          >
            HPLC VERIFIED · LAB CERTIFIED
          </textPath>
        </text>
      </g>
    </svg>
  )
}
