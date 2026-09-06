export default function OrganizationLoading() {
  return (
    <div className="min-h-screen bg-[#090909] text-white">
      <div className="flex min-h-screen">

        {/* Sidebar */}

        <aside className="hidden w-64 shrink-0 border-r border-white/[0.07] bg-[#090909] lg:block">
          <div className="h-[72px] border-b border-white/[0.07]" />

          <div className="space-y-3 px-4 py-5">
            <div className="h-16 animate-pulse rounded-xl bg-white/[0.04]" />

            <div className="h-9 animate-pulse rounded-xl bg-white/[0.025]" />
            <div className="h-9 animate-pulse rounded-xl bg-white/[0.025]" />
            <div className="h-9 animate-pulse rounded-xl bg-white/[0.025]" />
            <div className="h-9 animate-pulse rounded-xl bg-white/[0.025]" />
          </div>
        </aside>

        {/* Content */}

        <div className="flex min-w-0 flex-1 flex-col">

          {/* Topbar */}

          <div className="h-[72px] shrink-0 border-b border-white/[0.07]" />

          {/* Main */}

          <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">

              <div className="h-8 w-48 animate-pulse rounded-lg bg-white/[0.05]" />

              <div className="mt-3 h-4 w-72 animate-pulse rounded bg-white/[0.035]" />

              <div className="mt-8 grid gap-4 md:grid-cols-2">
                <div className="h-32 animate-pulse rounded-2xl border border-white/[0.06] bg-white/[0.025]" />
                <div className="h-32 animate-pulse rounded-2xl border border-white/[0.06] bg-white/[0.025]" />
              </div>

              <div className="mt-4 h-48 animate-pulse rounded-2xl border border-white/[0.06] bg-white/[0.025]" />

            </div>
          </main>
        </div>
      </div>
    </div>
  )
}