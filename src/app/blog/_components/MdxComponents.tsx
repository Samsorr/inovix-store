import type { ComponentPropsWithoutRef } from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"

function isExternalHref(href: string): boolean {
  return /^https?:\/\//i.test(href)
}

export const mdxComponents = {
  a: ({ href, className, children, ...rest }: ComponentPropsWithoutRef<"a">) => {
    const safeHref = href ?? "#"
    const external = isExternalHref(safeHref)
    const classes = cn(
      "text-teal-400 underline decoration-teal-200 underline-offset-[3px] transition-colors hover:text-teal-500 hover:decoration-teal-400",
      className
    )
    if (external) {
      return (
        <a
          href={safeHref}
          className={classes}
          target="_blank"
          rel="noopener noreferrer"
          {...rest}
        >
          {children}
        </a>
      )
    }
    return (
      <Link href={safeHref} className={classes} {...rest}>
        {children}
      </Link>
    )
  },
}
