import type { MetadataRoute } from "next"

import { getAllPosts } from "@/lib/blog"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://inovix-peptides.com"

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/products`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/over-ons`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/kwaliteit`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${siteUrl}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/voorwaarden`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/compliance`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/juridisch`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ]

  const postRoutes: MetadataRoute.Sitemap = getAllPosts().map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "yearly",
    priority: 0.5,
  }))

  return [...staticRoutes, ...postRoutes]
}
