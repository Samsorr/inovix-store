"use client"

import { useState, type ReactNode } from "react"
import { cn } from "@/lib/utils"

interface Tab {
  id: string
  label: string
  content: ReactNode
}

interface ProductTabsProps {
  tabs: Tab[]
  className?: string
}

export function ProductTabs({ tabs, className }: ProductTabsProps) {
  const visibleTabs = tabs.filter(
    (tab) => tab.content !== null && tab.content !== undefined && tab.content !== false
  )

  const [activeTabId, setActiveTabId] = useState(visibleTabs[0]?.id ?? "")

  if (visibleTabs.length === 0) return null

  const activeTab = visibleTabs.find((tab) => tab.id === activeTabId) ?? visibleTabs[0]

  return (
    <div className={cn(className)}>
      <div className="border-t border-border">
        <div
          className="-mx-4 flex overflow-x-auto px-4 sm:mx-0 sm:px-0"
          role="tablist"
        >
          {visibleTabs.map((tab) => (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              role="tab"
              aria-selected={tab.id === activeTab.id}
              aria-controls={`panel-${tab.id}`}
              onClick={() => setActiveTabId(tab.id)}
              className={cn(
                "shrink-0 whitespace-nowrap px-4 py-3.5 text-[11px] font-semibold uppercase tracking-widest transition-colors sm:px-5",
                tab.id === activeTab.id
                  ? "text-navy-500 border-b-2 border-mauve-500 -mb-px"
                  : "text-muted-foreground hover:text-navy-300"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-border">
        <div
          id={`panel-${activeTab.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${activeTab.id}`}
          className="py-6"
        >
          {activeTab.content}
        </div>
      </div>
    </div>
  )
}
