import medusa from "@/lib/medusa"

let cachedRegionId: string | null = null

export async function getDefaultRegionId(): Promise<string> {
  if (cachedRegionId) return cachedRegionId

  const { regions } = await medusa.store.region.list()
  if (!regions.length) throw new Error("No regions configured in Medusa")

  cachedRegionId = regions[0].id
  return cachedRegionId
}
