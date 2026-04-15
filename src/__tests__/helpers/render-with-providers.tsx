import { render, type RenderOptions } from "@testing-library/react"
import { type ReactElement, type ReactNode } from "react"
import { AuthProvider } from "@/lib/context/auth-context"
import { CartProvider } from "@/lib/context/cart-context"

function AllProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>{children}</CartProvider>
    </AuthProvider>
  )
}

export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) {
  return render(ui, { wrapper: AllProviders, ...options })
}

export { render }
