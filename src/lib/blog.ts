import fs from "node:fs"
import path from "node:path"

import matter from "gray-matter"

const BLOG_DIR = path.join(process.cwd(), "src/content/blog")

export interface BlogPostFrontmatter {
  title: string
  date: string
  excerpt: string
}

export interface BlogPostSummary extends BlogPostFrontmatter {
  slug: string
}

export interface BlogPost extends BlogPostSummary {
  content: string
}

function readPostFile(slug: string): BlogPost | null {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return null

  const raw = fs.readFileSync(filePath, "utf8")
  const parsed = matter(raw)
  const data = parsed.data as Partial<BlogPostFrontmatter>

  if (!data.title || !data.date || !data.excerpt) {
    throw new Error(
      `Blog post ${slug} is missing required frontmatter (title, date, excerpt).`
    )
  }

  return {
    slug,
    title: data.title,
    date: data.date,
    excerpt: data.excerpt,
    content: parsed.content,
  }
}

export function getAllPostSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return []
  return fs
    .readdirSync(BLOG_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""))
}

export function getAllPosts(): BlogPostSummary[] {
  return getAllPostSlugs()
    .map((slug) => {
      const post = readPostFile(slug)
      if (!post) return null
      const { content: _content, ...summary } = post
      return summary
    })
    .filter((p): p is BlogPostSummary => p !== null)
    .sort((a, b) => (a.date < b.date ? 1 : -1))
}

export function getPostBySlug(slug: string): BlogPost | null {
  return readPostFile(slug)
}

const dateFormatter = new Intl.DateTimeFormat("nl-NL", {
  day: "numeric",
  month: "long",
  year: "numeric",
})

export function formatPostDate(isoDate: string): string {
  return dateFormatter.format(new Date(isoDate))
}
