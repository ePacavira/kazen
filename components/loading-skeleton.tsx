export function ProductCardSkeleton() {
  return (
    <div className="bg-surface-card rounded-xl border border-border shadow-card overflow-hidden animate-pulse-skeleton">
      <div className="aspect-square bg-surface-hover" />
      <div className="p-3 space-y-2">
        <div className="h-4 bg-surface-hover rounded w-3/4" />
        <div className="h-3 bg-surface-hover rounded w-1/2" />
        <div className="h-10 bg-surface-hover rounded mt-2" />
      </div>
    </div>
  )
}

export function ComparisonCardSkeleton() {
  return (
    <div className="bg-surface-card rounded-xl border border-border shadow-card p-4 animate-pulse-skeleton">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-surface-hover rounded-full" />
          <div className="space-y-2">
            <div className="h-4 bg-surface-hover rounded w-24" />
            <div className="h-3 bg-surface-hover rounded w-16" />
          </div>
        </div>
        <div className="h-6 bg-surface-hover rounded w-20" />
      </div>
      <div className="h-2 bg-surface-hover rounded-full mb-4" />
      <div className="space-y-2">
        <div className="h-4 bg-surface-hover rounded" />
        <div className="h-4 bg-surface-hover rounded" />
        <div className="h-4 bg-surface-hover rounded" />
      </div>
      <div className="h-10 bg-surface-hover rounded mt-4" />
    </div>
  )
}

