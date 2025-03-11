import { Skeleton } from "@/components/ui/skeleton";

export function SettingsSkeleton() {
  return (
    <main className="p-6 pt-16 md:pt-6 animate-in fade-in duration-500">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <Skeleton className="h-10 w-40 mb-2" />
          <Skeleton className="h-5 w-64" />
        </div>

        {/* Tabs skeleton */}
        <div className="space-y-6">
          <div className="border-b border-border">
            <div className="flex space-x-2">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>

          {/* Content skeleton */}
          <div className="space-y-6">
            <div className="bg-card rounded-lg shadow border border-border">
              <div className="p-6 border-b border-border">
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-64" />
              </div>
              <div className="p-6 space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-1">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-8 w-full" />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card rounded-lg shadow border border-border">
              <div className="p-6 border-b border-border">
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-64" />
              </div>
              <div className="p-6 space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-4 w-48" />
                    </div>
                    <Skeleton className="h-6 w-12 rounded-full" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    </main>
  );
} 