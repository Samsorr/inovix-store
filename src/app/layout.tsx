import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { ResearchBanner } from "@/components/ResearchBanner"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "Inovix — Research Peptides",
  description:
    "Premium peptiden voor wetenschappelijk laboratoriumonderzoek. Geleverd binnen de EU.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="nl" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <div id="default-banner">
          <ResearchBanner />
        </div>
        <div id="default-navbar">
          <Navbar />
        </div>
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
