"use client"

import { useEffect } from "react"

export function HideDefaultNavbar() {
  useEffect(() => {
    const el = document.getElementById("default-navbar")
    if (el) el.style.display = "none"
    return () => {
      if (el) el.style.display = ""
    }
  }, [])

  return null
}
