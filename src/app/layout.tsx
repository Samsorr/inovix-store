import type { Metadata, Viewport } from "next"
import { Sora, JetBrains_Mono } from "next/font/google"
import "./globals.css"

import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"

import { Providers } from "@/components/Providers"

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
})

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://inovix-peptides.com"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Inovix | Research Peptides",
    template: "%s | Inovix",
  },
  description:
    "Premium peptiden voor wetenschappelijk laboratoriumonderzoek. Geleverd binnen de EU.",
  applicationName: "Inovix",
  openGraph: {
    type: "website",
    locale: "nl_NL",
    url: siteUrl,
    siteName: "Inovix",
    title: "Inovix | Research Peptides",
    description:
      "Premium peptiden voor wetenschappelijk laboratoriumonderzoek. Geleverd binnen de EU.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Inovix" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Inovix | Research Peptides",
    description:
      "Premium peptiden voor wetenschappelijk laboratoriumonderzoek. Geleverd binnen de EU.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#162043",
  colorScheme: "light",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="nl" className={`${sora.variable} ${jetbrainsMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-navy-500 focus:shadow-lg focus:outline focus:outline-2 focus:outline-teal-400"
        >
          Ga naar hoofdinhoud
        </a>
        <Providers>
          <div id="default-navbar">
            <Navbar />
          </div>
          <main id="main" className="flex-1">
            {children}
          </main>
          <div id="default-footer">
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  )
}
