"use client"

import { useState, useMemo } from "react"
import { Search } from "lucide-react"

import { cn } from "@/lib/utils"
import type { ProductCardProps } from "@/components/ProductCard"
import { CatalogCard } from "@/components/product/CatalogCard"

type SortOption = "default" | "price-asc" | "price-desc" | "name-asc"

interface ProductCatalogProps {
  products: ProductCardProps[]
  categories: string[]
}

export function ProductCatalog({ products, categories }: ProductCatalogProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [sort, setSort] = useState<SortOption>("default")
  const [search, setSearch] = useState("")

  const filtered = useMemo(() => {
    let result = products

    if (activeCategory) {
      result = result.filter((p) => p.category === activeCategory)
    }

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.category?.toLowerCase().includes(q) ?? false)
      )
    }

    switch (sort) {
      case "price-asc":
        result = [...result].sort((a, b) => a.price - b.price)
        break
      case "price-desc":
        result = [...result].sort((a, b) => b.price - a.price)
        break
      case "name-asc":
        result = [...result].sort((a, b) => a.name.localeCompare(b.name))
        break
    }

    return result
  }, [products, activeCategory, sort, search])

  return (
    <div>
      {/* Filter bar */}
      <div className="mb-6 space-y-4">
        {/* Search + sort row */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-xs flex-1">
            <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Zoek peptiden..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-border bg-white py-2.5 pl-9 pr-3 text-xs text-navy-500 placeholder:text-muted-foreground focus:border-teal-400 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-5">
            <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              {filtered.length}{" "}
              {filtered.length === 1 ? "product" : "producten"}
            </span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="appearance-none border border-border bg-white bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px_12px] bg-[position:right_0.75rem_center] bg-no-repeat px-3 py-2.5 pr-8 text-xs text-navy-500 focus:border-teal-400 focus:outline-none"
            >
              <option value="default">Standaard</option>
              <option value="price-asc">Prijs: laag - hoog</option>
              <option value="price-desc">Prijs: hoog - laag</option>
              <option value="name-asc">Naam: A - Z</option>
            </select>
          </div>
        </div>

        {/* Category pills */}
        {categories.length > 1 && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCategory(null)}
              className={cn(
                "px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-wider transition-colors",
                activeCategory === null
                  ? "border-2 border-navy-500 bg-navy-500 text-white"
                  : "border border-border text-muted-foreground hover:border-navy-200 hover:text-navy-500"
              )}
            >
              Alle
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() =>
                  setActiveCategory(activeCategory === cat ? null : cat)
                }
                className={cn(
                  "px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-wider transition-colors",
                  activeCategory === cat
                    ? "border-2 border-navy-500 bg-navy-500 text-white"
                    : "border border-border text-muted-foreground hover:border-navy-200 hover:text-navy-500"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="mb-6 border-t border-border" />

      {/* Product grid */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-sm text-muted-foreground">
            Geen producten gevonden
            {search ? ` voor "${search}"` : ""}.
          </p>
          {(activeCategory || search) && (
            <button
              onClick={() => {
                setActiveCategory(null)
                setSearch("")
              }}
              className="mt-2 text-xs font-medium text-teal-400 transition-colors hover:text-teal-500"
            >
              Filters wissen
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((product) => (
            <CatalogCard key={product.productId} {...product} />
          ))}
        </div>
      )}
    </div>
  )
}
