'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  BarChart3,
  ChevronRight,
  FolderKanban,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import {
  systemNavigation,
  teachingNavigation,
  workspaceNavigation,
} from './navigation'

type AppSidebarProps = {
  organizationSlug: string
  organizationName: string
  role: string
}

function NavigationSection({
  title,
  items,
  basePath,
  pathname,
}: {
  title: string
  items: typeof workspaceNavigation
  basePath: string
  pathname: string
}) {
  return (
    <section className="mb-6">
      <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
        {title}
      </p>

      <nav className="space-y-1">
        {items.map((item) => {
          const href = `${basePath}${item.href}`

          const active =
            item.href === ''
              ? pathname === basePath
              : pathname === href ||
                pathname.startsWith(`${href}/`)

          const Icon = item.icon

          return (
            <Link
              key={item.label}
              href={href}
              className={cn(
                'group relative flex min-h-10 w-full items-center gap-3 rounded-xl px-3 py-2',
                'text-sm font-medium',
                'transition-all duration-150',
                active
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900',
              )}
            >
              {active && (
                <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-primary" />
              )}

              <Icon
                className={cn(
                  'h-[17px] w-[17px] shrink-0 transition-colors',
                  active
                    ? 'text-primary'
                    : 'text-slate-400 group-hover:text-slate-600',
                )}
              />

              <span className="min-w-0 flex-1 truncate">
                {item.label}
              </span>

              {active && (
                <ChevronRight className="ml-auto h-3.5 w-3.5 shrink-0 text-slate-400" />
              )}
            </Link>
          )
        })}
      </nav>
    </section>
  )
}

export function AppSidebar({
  organizationSlug,
  organizationName,
  role,
}: AppSidebarProps) {
  const pathname = usePathname()
  const basePath = `/${organizationSlug}`

  const settingsPath = `${basePath}/settings`

  const settingsActive =
    pathname === settingsPath ||
    pathname.startsWith(`${settingsPath}/`)

  return (
    <aside className="hidden w-[248px] shrink-0 bg-white lg:flex lg:flex-col">
      <div className="flex min-h-0 flex-1 flex-col">
        {/* Header */}

        <div className="flex min-h-[72px] shrink-0 items-center px-4 sm:px-5">
          <Link
            href={basePath}
            className="group flex min-w-0 items-center gap-3"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-violet-500 to-fuchsia-500 text-white shadow-sm shadow-primary/20 transition-transform duration-200 group-hover:scale-[1.03]">
              <BarChart3 className="h-[18px] w-[18px]" />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold tracking-tight text-slate-900">
                Math Teaching
              </p>

              <p className="text-[11px] text-slate-400">
                Platform
              </p>
            </div>
          </Link>
        </div>

        {/* Organisasi */}

        <div className="shrink-0 px-3 pb-5 sm:px-4">
          <div className="flex min-w-0 items-center gap-3 rounded-xl bg-gradient-to-r from-sky-50 via-blue-50 to-violet-50 px-3 py-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-xs font-semibold text-primary shadow-sm">
              {organizationName
                .charAt(0)
                .toUpperCase()}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-800">
                {organizationName}
              </p>

              <p className="mt-0.5 truncate text-[10px] capitalize text-slate-500">
                {role}
              </p>
            </div>
          </div>
        </div>

        {/* Navigasi */}

        <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-4 sm:px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <NavigationSection
            title="Ruang Kerja"
            items={workspaceNavigation}
            basePath={basePath}
            pathname={pathname}
          />

          <NavigationSection
            title="Mengajar"
            items={teachingNavigation}
            basePath={basePath}
            pathname={pathname}
          />

          <NavigationSection
            title="Sistem"
            items={systemNavigation}
            basePath={basePath}
            pathname={pathname}
          />
        </div>

        {/* Footer */}

        <div className="shrink-0 px-3 pb-4 pt-2 sm:px-4">
          <Link
            href="/dashboard"
            className={cn(
              'group flex min-h-10 w-full items-center gap-3 rounded-xl px-3 py-2',
              'text-sm font-medium text-slate-500',
              'transition-colors duration-150',
              'hover:bg-slate-50 hover:text-slate-900',
              settingsActive &&
                'bg-slate-100 text-slate-900',
            )}
          >
            <FolderKanban
              className={cn(
                'h-[17px] w-[17px] shrink-0',
                settingsActive
                  ? 'text-primary'
                  : 'text-slate-400 group-hover:text-slate-600',
              )}
            />

            <span className="min-w-0 flex-1 truncate">
              Semua Organisasi
            </span>
          </Link>
        </div>
      </div>
    </aside>
  )
}