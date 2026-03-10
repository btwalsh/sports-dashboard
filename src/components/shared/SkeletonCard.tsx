export function SkeletonCard() {
  return (
    <div className="glass rounded-2xl p-5 animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-surface-overlay" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-32 bg-surface-overlay rounded" />
          <div className="h-3 w-20 bg-surface-overlay rounded" />
        </div>
      </div>
      <div className="space-y-3">
        <div className="h-3 w-full bg-surface-overlay rounded" />
        <div className="h-3 w-3/4 bg-surface-overlay rounded" />
        <div className="h-3 w-1/2 bg-surface-overlay rounded" />
      </div>
    </div>
  );
}
