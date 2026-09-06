'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  FolderKanban,
  Menu,
  X,
} from 'lucide-react'
import {
  useEffect,
  useState,
} from 'react'
import { createPortal } from 'react-dom'

import { cn } from '@/lib/utils'
import {
  systemNavigation,
  teachingNavigation,
  workspaceNavigation,
} from './navigation'

type MobileNavProps = {
  organizationSlug: string
}

function NavigationSection({
  title,
  items,
  basePath,
  pathname,
  onNavigate,
}: {
  title: string
  items: typeof workspaceNavigation
  basePath: string
  pathname: string
  onNavigate: () => void
}) {
  return (
    <section className="mb-7">
      <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
        {title}
      </p>

      <nav className="space-y-0.5">
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
              onClick={onNavigate}
              className={cn(
                'group relative flex min-h-11 items-center gap-3 rounded-xl px-3',
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
                  'h-[18px] w-[18px] shrink-0 transition-colors',
                  active
                    ? 'text-primary'
                    : 'text-slate-400 group-hover:text-slate-600',
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

export function MobileNav({
  organizationSlug,
}: MobileNavProps) {
  const pathname = usePathname()

  const [open, setOpen] =
    useState(false)

  const [mounted, setMounted] =
    useState(false)

  const basePath =
    `/${organizationSlug}`

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!open) {
      return
    }

    function handleKeyDown(
      event: KeyboardEvent,
    ) {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }

    const previousOverflow =
      document.body.style.overflow

    document.body.style.overflow =
      'hidden'

    window.addEventListener(
      'keydown',
      handleKeyDown,
    )

    return () => {
      document.body.style.overflow =
        previousOverflow

      window.removeEventListener(
        'keydown',
        handleKeyDown,
      )
    }
  }, [open])

  const closeDrawer = () => {
    setOpen(false)
  }

  const trigger = (
    <button
      type="button"
      aria-label={
        open
          ? 'Close navigation'
          : 'Open navigation'
      }
      aria-expanded={open}
      onClick={() =>
        setOpen((value) => !value)
      }
      className="flex h-10 w-10 items-center justify-center rounded-full text-slate-500 transition-colors duration-150 hover:bg-slate-100 hover:text-slate-900 lg:hidden"
    >
      {open ? (
        <X className="h-5 w-5" />
      ) : (
        <Menu className="h-5 w-5" />
      )}
    </button>
  )

  const drawer =
    mounted && open
      ? createPortal(
          <>
            {/* Overlay */}

            <button
              type="button"
              aria-label="Close navigation"
              onClick={closeDrawer}
              className="fixed inset-0 z-[9998] bg-slate-900/25 backdrop-blur-[2px] lg:hidden"
            />

            {/* Drawer */}

            <aside className="fixed inset-y-0 left-0 z-[9999] flex w-[min(86vw,320px)] flex-col bg-white shadow-[12px_0_50px_rgba(15,23,42,0.12)] lg:hidden">
              {/* Header */}

              <div className="flex h-[72px] shrink-0 items-center justify-between border-b border-slate-100 px-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-violet-500 to-fuchsia-500 text-white shadow-sm shadow-primary/20">
                    <FolderKanban className="h-[17px] w-[17px]" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold tracking-tight text-slate-900">
                      Math Teaching
                    </p>

                    <p className="text-[11px] text-slate-400">
                      Platform
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  aria-label="Close navigation"
                  onClick={closeDrawer}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-900"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Navigation */}

              <nav className="min-h-0 flex-1 overflow-y-auto px-4 py-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <NavigationSection
                  title="Workspace"
                  items={workspaceNavigation}
                  basePath={basePath}
                  pathname={pathname}
                  onNavigate={closeDrawer}
                />

                <NavigationSection
                  title="Teaching"
                  items={teachingNavigation}
                  basePath={basePath}
                  pathname={pathname}
                  onNavigate={closeDrawer}
                />

                <NavigationSection
                  title="System"
                  items={systemNavigation}
                  basePath={basePath}
                  pathname={pathname}
                  onNavigate={closeDrawer}
                />
              </nav>

              {/* Footer */}

              <div className="shrink-0 border-t border-slate-100 px-4 py-3">
                <Link
                  href="/dashboard"
                  onClick={closeDrawer}
                  className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900"
                >
                  <FolderKanban className="h-[17px] w-[17px] text-slate-400 transition-colors group-hover:text-slate-600" />

                  <span>
                    All Organizations
                  </span>
                </Link>
              </div>
            </aside>
          </>,
          document.body,
        )
      : null

  return (
    <>
      {trigger}
      {drawer}
    </>
  )
}