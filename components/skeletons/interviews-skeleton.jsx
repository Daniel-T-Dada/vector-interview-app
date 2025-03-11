import { Skeleton } from "@/components/ui/skeleton";

export function InterviewsSkeleton() {
  return (
    <main className="p-4 sm:p-6 pt-16 md:pt-6 animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto">
        {/* Header section skeleton */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div>
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-64" />
            </div>
            
            {/* Mobile filter toggle skeleton */}
            <div className="flex items-center gap-2 md:hidden">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-10" />
            </div>
          </div>
          
          {/* Search and filters skeleton */}
          <div className="grid gap-4 grid-cols-1 md:grid-cols-12 mt-4">
            <Skeleton className="h-10 md:col-span-5 lg:col-span-6" />
            <Skeleton className="h-10 md:col-span-3" />
            <Skeleton className="h-10 hidden md:block md:col-span-4 lg:col-span-3" />
          </div>
        </div>
        
        {/* Table skeleton */}
        <div className="overflow-hidden rounded-md border border-border">
          {/* Table header */}
          <div className="bg-muted/30 p-4 border-b border-border grid grid-cols-12 gap-4">
            <Skeleton className="h-6 col-span-1" />
            <Skeleton className="h-6 col-span-3" />
            <Skeleton className="h-6 col-span-3" />
            <Skeleton className="h-6 col-span-2" />
            <Skeleton className="h-6 col-span-2" />
            <Skeleton className="h-6 col-span-1" />
          </div>
          
          {/* Table rows */}
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="p-4 border-b border-border grid grid-cols-12 gap-4">
              <Skeleton className="h-6 col-span-1" />
              <Skeleton className="h-6 col-span-3" />
              <Skeleton className="h-6 col-span-3" />
              <Skeleton className="h-6 col-span-2" />
              <Skeleton className="h-6 col-span-2" />
              <Skeleton className="h-6 col-span-1" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
} 