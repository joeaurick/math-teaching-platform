import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="min-h-full">
      <div className="mx-auto w-full max-w-7xl px-4 py-7 sm:px-6 lg:px-8 lg:py-10">
        {/* Page Header */}

        <div className="space-y-3">
          <Skeleton className="h-3 w-36 bg-sky-400/15" />

          <Skeleton className="h-8 w-56 bg-white/10" />

          <Skeleton className="h-4 w-full max-w-2xl bg-white/7" />
        </div>

        {/* Back Link */}

        <div className="mt-6">
          <Skeleton className="h-5 w-32 bg-sky-400/10" />
        </div>

        {/* Summary */}

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Skeleton className="h-[82px] rounded-2xl bg-sky-400/8" />

          <Skeleton className="h-[82px] rounded-2xl bg-violet-400/8" />
        </div>

        {/* Student Access Content */}

        <div className="mt-8 space-y-4">
          <Skeleton className="h-10 w-44 bg-white/8" />

          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
            <div className="space-y-4">
              <Skeleton className="h-5 w-48 bg-white/8" />

              <Skeleton className="h-10 w-full bg-white/7" />

              <Skeleton className="h-10 w-full bg-white/7" />

              <Skeleton className="h-10 w-32 bg-white/8" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}