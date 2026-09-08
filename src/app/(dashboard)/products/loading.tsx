import { Card, CardContent, CardHeader } from '@/components/ui/card'

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-muted ${className ?? ''}`} />
}

export default function ProductsLoading() {
  return (
    <div className="min-w-0 space-y-6">
      <div>
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-4 w-80 mt-2" />
      </div>

      <Card className="border-0 shadow-sm overflow-hidden">
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-56 mt-1" />
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="border-b last:border-0 p-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-6 w-20 rounded-full hidden sm:block" />
                  <Skeleton className="h-4 w-14 hidden md:block" />
                  <Skeleton className="h-4 w-10" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
