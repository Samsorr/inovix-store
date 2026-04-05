import type { Metadata } from "next"
import { Sora } from "next/font/google"
import "./globals.css"

import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"

import { Providers } from "@/components/Providers"

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "Inovix | Research Peptides",
  description:
    "Premium peptiden voor wetenschappelijk laboratoriumonderzoek. Geleverd binnen de EU.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="nl" className={`${sora.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <Providers>
          <div id="default-navbar">
            <Navbar />
          </div>
          <main className="flex-1">{children}</main>
          <div id="default-footer">
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  )
}
