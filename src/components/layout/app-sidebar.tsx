'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ComponentType } from 'react'
import {
  BarChart3,
  BookOpen,
  Camera,
  ClipboardList,
  FileQuestion,
  FolderKanban,
  GraduationCap,
  LayoutDashboard,
  Library,
  PenLine,
  Settings,
  Shapes,
  Sparkles,
  Users,
  Video,
} from 'lucide-react'

import { cn } from '@/lib/utils'

type AppSidebarProps = {
  organizationSlug: string
  organizationName: string
  role: string
}

type NavigationItem = {
  label: string
  href: string
  icon: ComponentType<{ className?: string }>
}

const workspaceNavigation: NavigationItem[] = [
  {
    label: 'Dashboard',
    href: '',
    icon: LayoutDashboard,
  },
  {
    label: 'My Modules',
    href: '/modules',
    icon: BookOpen,
  },
  {
    label: 'Question Builder',
    href: '/questions',
    icon: PenLine,
  },
  {
    label: 'Geometry',
    href: '/geometry',
    icon: Shapes,
  },
  {
    label: 'Math Symbols',
    href: '/symbols',
    icon: Sparkles,
  },
  {
    label: 'Photo / Scan',
    href: '/photo-scan',
    icon: Camera,
  },
]

const teachingNavigation: NavigationItem[] = [
  {
    label: 'Question Bank',
    href: '/question-bank',
    icon: Library,
  },
  {
    label: 'Worksheets',
    href: '/worksheets',
    icon: ClipboardList,
  },
  {
    label: 'Teaching Mode',
    href: '/teaching-mode',
    icon: GraduationCap,
  },
  {
    label: 'Classes',
    href: '/classes',
    icon: Users,
  },
  {
    label: 'Live Classroom',
    href: '/live-classroom',
    icon: Video,
  },
  {
    label: 'Student Submissions',
    href: '/submissions',
    icon: FileQuestion,
  },
]

function NavigationSection({
  title,
  items,
  basePath,
  pathname,
}: {
  title: string
  items: NavigationItem[]
  basePath: string
  pathname: string
}) {
  return (
    <section className="mb-6">
      <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/25">
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
                'group flex min-h-10 items-center gap-3 rounded-xl px-3',
                'text-sm transition-all duration-200',
                active
                  ? 'bg-white/[0.08] text-white'
                  : 'text-white/45 hover:bg-white/[0.045] hover:text-white/80',
              )}
            >
              <Icon
                className={cn(
                  'h-[17px] w-[17px] shrink-0',
                  active
                    ? 'text-white'
                    : 'text-white/35 group-hover:text-white/60',
                )}
              />

              <span className="truncate">
                {item.label}
              </span>
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
    <aside className="hidden w-64 shrink-0 border-r border-white/[0.07] bg-[#090909] lg:flex lg:flex-col">
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex h-[72px] shrink-0 items-center border-b border-white/[0.07] px-5">
          <Link
            href={basePath}
            className="flex min-w-0 items-center gap-3"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-black">
              <BarChart3 className="h-[18px] w-[18px]" />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold tracking-tight text-white">
                Math Teaching
              </p>

              <p className="text-[11px] text-white/30">
                Platform
              </p>
            </div>
          </Link>
        </div>

        <div className="shrink-0 px-4 py-4">
          <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-3">
            <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-white/25">
              Organization
            </p>

            <p className="mt-1 truncate text-sm font-medium text-white/85">
              {organizationName}
            </p>

            <p className="mt-1 text-[11px] capitalize text-white/30">
              {role}
            </p>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <NavigationSection
            title="Workspace"
            items={workspaceNavigation}
            basePath={basePath}
            pathname={pathname}
          />

          <NavigationSection
            title="Teaching"
            items={teachingNavigation}
            basePath={basePath}
            pathname={pathname}
          />

          <section>
            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/25">
              System
            </p>

            <Link
              href={settingsPath}
              className={cn(
                'flex min-h-10 items-center gap-3 rounded-xl px-3',
                'text-sm transition-colors',
                settingsActive
                  ? 'bg-white/[0.08] text-white'
                  : 'text-white/45 hover:bg-white/[0.045] hover:text-white/80',
              )}
            >
              <Settings className="h-[17px] w-[17px]" />
              <span>Settings</span>
            </Link>
          </section>
        </div>

        <div className="shrink-0 border-t border-white/[0.07] p-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/40 transition-colors hover:bg-white/[0.045] hover:text-white/75"
          >
            <FolderKanban className="h-[17px] w-[17px]" />
            <span>All Organizations</span>
          </Link>
        </div>
      </div>
    </aside>
  )
}