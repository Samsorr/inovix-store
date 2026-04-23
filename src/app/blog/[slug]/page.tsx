import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { MDXRemote } from "next-mdx-remote/rsc"

import { mdxComponents } from "@/app/blog/_components/MdxComponents"
import {
  formatPostDate,
  getAllPostSlugs,
  getPostBySlug,
} from "@/lib/blog"

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  return (
    <div className="section-y">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-teal-400 transition-colors hover:text-teal-500 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-400"
        >
          <ArrowLeft className="size-3.5" aria-hidden />
          Terug naar onderzoeksnotities
        </Link>

        <header className="mt-8 border-b border-border pb-8 sm:mt-10 sm:pb-10">
          <time
            dateTime={post.date}
            className="text-xs tabular-nums text-navy-400"
          >
            {formatPostDate(post.date)}
          </time>
          <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-navy-900 md:text-5xl">
            {post.title}
          </h1>
        </header>

        <article className="blog-prose mx-auto mt-10 max-w-[68ch] sm:mt-12">
          <MDXRemote source={post.content} components={mdxComponents} />
        </article>

        <p className="mx-auto mt-16 max-w-[68ch] border-t border-border pt-8 text-xs leading-relaxed text-navy-400">
          Alle inhoud is uitsluitend bedoeld voor wetenschappelijk onderzoek.
          Niet voor menselijke of veterinaire consumptie.
        </p>
      </div>
    </div>
  )
}
