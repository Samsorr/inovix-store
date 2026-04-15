import type { MetadataRoute } from "next"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://inovix.eu"

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/products`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/over-ons`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/kwaliteit`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/voorwaarden`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/compliance`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ]

  return staticRoutes
}
