"use client"

import { type ReactNode } from "react"
import { CartProvider } from "@/lib/context/cart-context"
import { CartSheet } from "@/components/CartSheet"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      {children}
      <CartSheet />
    </CartProvider>
  )
}
