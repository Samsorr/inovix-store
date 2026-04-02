"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ShoppingCart, Menu, X, User, Search } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"
import { cn } from "@/lib/utils"

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
  const [cartCount] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const lastScrollY = useRef(0)

  // Lock body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [menuOpen])

  // Hide on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY
      setScrolled(y > 32)
      if (y > lastScrollY.current && y > 80) {
        setHidden(true)
      } else {
        setHidden(false)
      }
      lastScrollY.current = y
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const pastHero = scrolled && transparent
  const showSolid = !menuOpen && (!transparent || scrolled)

  return (
    <>
      <nav
        className={cn(
          "z-50 transition-[transform] duration-300",
          pastHero ? "fixed top-0 left-0 right-0" : "sticky top-0",
          hidden && !menuOpen ? "-translate-y-full" : "translate-y-0",
          showSolid ? "bg-white/95 backdrop-blur-md shadow-sm" : "bg-transparent"
        )}
      >
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 pt-2 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link
            href="/"
            className={cn(
              "relative z-50 text-base font-bold tracking-wide transition-colors duration-300",
              menuOpen ? "text-white" : showSolid ? "text-navy-500" : "text-white"
            )}
          >
            Inovix
          </Link>

          {/* Desktop nav links */}
          <div className="hidden h-full items-center gap-6 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex h-full items-center border-b-2 text-sm font-medium transition-colors duration-300",
                  showSolid
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
            <Link
              href="/cart"
              className={cn(
                "relative z-50 inline-flex rounded-md p-2 transition-colors duration-300",
                menuOpen
                  ? "text-white/60 hover:text-white"
                  : showSolid
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
            </Link>

            <Link
              href="/account"
              className={cn(
                "hidden rounded-md p-2 transition-colors duration-300 md:inline-flex",
                showSolid
                  ? "text-muted-foreground hover:text-navy-500"
                  : "text-white/60 hover:text-white"
              )}
              aria-label="Account"
            >
              <User className="size-[18px]" />
            </Link>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={cn(
                "relative z-50 inline-flex rounded-md p-2 transition-colors duration-300 md:hidden",
                menuOpen
                  ? "text-white/60 hover:text-white"
                  : showSolid
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
            className="fixed inset-0 z-40 flex flex-col bg-navy-500 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
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
                  href="/account"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 text-sm font-medium text-white/50 transition-colors hover:text-white"
                >
                  <User className="size-4" />
                  Account
                </Link>
                <Link
                  href="/search"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 text-sm font-medium text-white/50 transition-colors hover:text-white"
                >
                  <Search className="size-4" />
                  Zoeken
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
