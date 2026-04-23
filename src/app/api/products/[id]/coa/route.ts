import { NextResponse } from "next/server"

import medusa from "@/lib/medusa"
import { getDefaultRegionId } from "@/lib/region"

function slugify(value: string): string {
  return (
    value
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{M}/gu, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "product"
  )
}

function extensionFromUrl(url: string): string {
  try {
    const path = new URL(url).pathname
    const m = path.match(/\.([a-zA-Z0-9]{1,5})$/)
    return m ? m[1].toLowerCase() : "pdf"
  } catch {
    return "pdf"
  }
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  let product
  try {
    const regionId = await getDefaultRegionId()
    const result = await medusa.store.product.retrieve(id, {
      region_id: regionId,
      fields: "id,title,metadata",
    })
    product = result.product
  } catch {
    return new NextResponse("Product niet gevonden", { status: 404 })
  }

  const metadata = (product.metadata ?? {}) as Record<string, unknown>
  const coaUrl = typeof metadata.coa_url === "string" ? metadata.coa_url : null

  if (!coaUrl) {
    return new NextResponse("Geen certificaat beschikbaar", { status: 404 })
  }

  let upstream: Response
  try {
    upstream = await fetch(coaUrl, { cache: "no-store" })
  } catch {
    return new NextResponse("Certificaat niet bereikbaar", { status: 502 })
  }

  if (!upstream.ok || !upstream.body) {
    return new NextResponse("Certificaat niet bereikbaar", {
      status: upstream.status === 404 ? 404 : 502,
    })
  }

  const ext = extensionFromUrl(coaUrl)
  const slug = slugify(product.title ?? "product")
  const filename = `${slug}-coa.${ext}`
  const contentType =
    upstream.headers.get("content-type") ||
    (ext === "pdf" ? "application/pdf" : "application/octet-stream")
  const contentLength = upstream.headers.get("content-length")

  const headers = new Headers({
    "content-type": contentType,
    "content-disposition": `attachment; filename="${filename}"`,
    "cache-control": "public, max-age=3600",
  })
  if (contentLength) headers.set("content-length", contentLength)

  return new NextResponse(upstream.body, {
    status: 200,
    headers,
  })
}
