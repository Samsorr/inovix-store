"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { RichDescription } from "./RichDescription"

interface DescriptionBlockProps {
  shortDescription?: string | null
  longHtml?: string | null
  className?: string
}

export function DescriptionBlock({
  shortDescription,
  longHtml,
  className,
}: DescriptionBlockProps) {
  const [expanded, setExpanded] = useState(false)
  const hasShort = Boolean(shortDescription && shortDescription.trim().length > 0)
  const hasLong = Boolean(longHtml && longHtml.trim().length > 0)

  if (!hasShort && !hasLong) return null

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {hasShort && (
        <p className="max-w-prose whitespace-pre-line text-sm leading-relaxed text-navy-500">
          {shortDescription}
        </p>
      )}

      {hasLong && (
        <>
          {!hasShort && !expanded && (
            <p className="max-w-prose text-sm leading-relaxed text-navy-500">
              Klik &lsquo;Lees meer&rsquo; voor de volledige achtergrond,
              werkingsmechanisme en onderzoekscontext.
            </p>
          )}

          <div
            id="description-long"
            className={cn(
              "grid transition-[grid-template-rows,opacity] duration-300 ease-in-out",
              expanded
                ? "grid-rows-[1fr] opacity-100"
                : "grid-rows-[0fr] opacity-0"
            )}
            aria-hidden={!expanded}
          >
            <div className="overflow-hidden">
              <RichDescription html={longHtml ?? ""} className="pt-2" />
            </div>
          </div>

          <button
            type="button"
            aria-expanded={expanded}
            aria-controls="description-long"
            onClick={() => setExpanded((v) => !v)}
            className="inline-flex w-fit items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-mauve-500 transition-colors hover:text-mauve-400"
          >
            {expanded ? "Toon minder" : "Lees meer"}
            <ChevronDown
              className={cn(
                "size-3.5 transition-transform duration-200",
                expanded && "rotate-180"
              )}
            />
          </button>
        </>
      )}
    </div>
  )
}
