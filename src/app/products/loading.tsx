export default function ProductsLoading() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 h-12 animate-pulse rounded bg-surface-secondary" />
      <div className="mb-6 h-8 w-48 animate-pulse rounded bg-surface-secondary" />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-3 rounded-lg border border-border p-4">
            <div className="h-48 animate-pulse rounded bg-surface-secondary" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-surface-secondary" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-surface-secondary" />
          </div>
        ))}
      </div>
    </main>
  )
}
