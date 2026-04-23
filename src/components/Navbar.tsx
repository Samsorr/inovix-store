"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { ShoppingCart, Menu, X, User } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"
import { cn } from "@/lib/utils"
import { useCart } from "@/lib/context/cart-context"
import { useAuth } from "@/lib/context/auth-context"

const navLinks = [
  { label: "Peptiden", href: "/products" },
  { label: "Over Ons", href: "/over-ons" },
  { label: "Kwaliteit", href: "/kwaliteit" },
  { label: "Contact", href: "/contact" },
]

export interface NavbarProps {
  transparent?: boolean
}

export function Navbar({ transparent = false }: NavbarProps) {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const { cartCount, openCart } = useCart()
  const { isAuthenticated, customer } = useAuth()
  const firstLinkRef = useRef<HTMLAnchorElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const hasMountedRef = useRef(false)

  // Lock body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    if (hasMountedRef.current) {
      if (menuOpen) {
        firstLinkRef.current?.focus()
      } else {
        triggerRef.current?.focus()
      }
    } else {
      hasMountedRef.current = true
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [menuOpen])

  useEffect(() => {
    if (!menuOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false)
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [menuOpen])

  const solid = !transparent

  return (
    <>
      <nav
        className={cn(
          "z-50",
          solid
            ? "bg-white border-b border-border"
            : "bg-transparent"
        )}
      >
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 pt-2 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link
            href="/"
            aria-label="Inovix home"
            className="relative z-50 flex items-center"
          >
            <Image
              src="/images/inovix-logo.png"
              alt="Inovix"
              width={142}
              height={24}
              priority
              className={cn(
                "h-5 w-auto sm:h-6",
                (menuOpen || !solid) && "brightness-0 invert"
              )}
            />
          </Link>

          {/* Desktop nav links */}
          <div className="hidden h-full items-center gap-6 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex h-full items-center border-b-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/40",
                  solid
                    ? pathname.startsWith(link.href)
                      ? "border-navy-500 text-navy-500"
                      : "border-transparent text-muted-foreground hover:text-navy-500"
                    : pathname.startsWith(link.href)
                      ? "border-white text-white"
                      : "border-transparent text-white/60 hover:text-white"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <button
              onClick={openCart}
              className={cn(
                "relative z-50 inline-flex p-2.5 transition-colors",
                menuOpen
                  ? "text-white/60 hover:text-white"
                  : solid
                    ? "text-muted-foreground hover:text-navy-500"
                    : "text-white/60 hover:text-white"
              )}
              aria-label="Winkelwagen"
            >
              <ShoppingCart className="size-[18px]" />
              {cartCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-teal-400 text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </button>

            {isAuthenticated ? (
              <Link
                href="/account"
                className={cn(
                  "hidden items-center gap-1.5 px-2 py-1 text-sm font-medium transition-colors md:inline-flex",
                  solid
                    ? "text-muted-foreground hover:text-navy-500"
                    : "text-white/60 hover:text-white"
                )}
              >
                <User className="size-[18px]" />
              </Link>
            ) : (
              <Link
                href="/account/login"
                className={cn(
                  "hidden items-center gap-1.5 px-2 py-1 text-sm font-medium transition-colors md:inline-flex",
                  solid
                    ? "text-muted-foreground hover:text-navy-500"
                    : "text-white/60 hover:text-white"
                )}
              >
                Inloggen
              </Link>
            )}

            {/* Mobile menu toggle */}
            <button
              ref={triggerRef}
              onClick={() => setMenuOpen(!menuOpen)}
              className={cn(
                "relative z-50 inline-flex p-2.5 transition-colors md:hidden",
                menuOpen
                  ? "text-white/60 hover:text-white"
                  : solid
                    ? "text-muted-foreground hover:text-navy-500"
                    : "text-white/60 hover:text-white"
              )}
              aria-label={menuOpen ? "Menu sluiten" : "Menu openen"}
              aria-expanded={menuOpen}
            >
              <AnimatePresence mode="wait" initial={false}>
                {menuOpen ? (
                  <motion.span
                    key="close"
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.15 }}
                  >
                    <X className="size-5" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="menu"
                    initial={{ opacity: 0, rotate: 90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: -90 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Menu className="size-5" />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </nav>

      {/* ── Fullscreen mobile overlay ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Hoofdmenu"
            className="fixed inset-0 z-40 flex flex-col bg-navy-500 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            onKeyDown={(e) => {
              if (e.key !== "Tab") return
              const dialog = e.currentTarget
              const focusables = dialog.querySelectorAll<HTMLElement>(
                'a[href], button:not([disabled])'
              )
              if (focusables.length === 0) return
              const first = focusables[0]
              const last = focusables[focusables.length - 1]
              if (e.shiftKey && document.activeElement === first) {
                e.preventDefault()
                last.focus()
              } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault()
                first.focus()
              }
            }}
          >
            {/* Nav links — staggered entrance */}
            <nav className="flex flex-1 flex-col justify-center px-8">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{
                    duration: 0.3,
                    delay: 0.1 + i * 0.06,
                    ease: "easeOut",
                  }}
                >
                  <Link
                    ref={i === 0 ? firstLinkRef : undefined}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      "block border-b border-white/10 py-5 text-2xl font-medium transition-colors",
                      pathname.startsWith(link.href)
                        ? "text-white"
                        : "text-white/50 hover:text-white"
                    )}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Bottom section — account & search */}
            <motion.div
              className="border-t border-white/10 px-8 pb-10 pt-6"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.3, delay: 0.35, ease: "easeOut" }}
            >
              <div className="flex items-center gap-6">
                <Link
                  href={isAuthenticated ? "/account" : "/account/login"}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 text-sm font-medium text-white/50 transition-colors hover:text-white"
                >
                  <User className="size-4" />
                  {isAuthenticated
                    ? customer?.first_name ?? "Account"
                    : "Inloggen"}
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
