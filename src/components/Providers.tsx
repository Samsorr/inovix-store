"use client"

import { type ReactNode } from "react"
import { AuthProvider } from "@/lib/context/auth-context"
import { CartProvider } from "@/lib/context/cart-context"
import { CartSheet } from "@/components/CartSheet"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        {children}
        <CartSheet />
      </CartProvider>
    </AuthProvider>
  )
}
