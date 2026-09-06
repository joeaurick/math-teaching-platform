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
              onClick={onNavigate}
              className={cn(
                'group flex min-h-11 items-center gap-3 rounded-xl px-3',
                'text-sm transition-colors',
                active
                  ? 'bg-white/[0.08] text-white'
                  : 'text-white/45 hover:bg-white/[0.045] hover:text-white/80',
              )}
            >
              <Icon
                className={cn(
                  'h-[18px] w-[18px] shrink-0',
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
      className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-white/60 transition-colors hover:bg-white/[0.07] hover:text-white lg:hidden"
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
              className="fixed inset-0 z-[9998] bg-black/70 backdrop-blur-sm lg:hidden"
            />

            {/* Drawer */}

            <aside className="fixed inset-y-0 left-0 z-[9999] flex w-[min(86vw,320px)] flex-col border-r border-white/[0.08] bg-[#090909] shadow-[20px_0_70px_rgba(0,0,0,0.45)] lg:hidden">

              {/* Header */}

              <div className="flex h-[72px] shrink-0 items-center justify-between border-b border-white/[0.07] px-5">
                <div>
                  <p className="text-sm font-semibold text-white">
                    Math Teaching
                  </p>

                  <p className="text-[11px] text-white/30">
                    Platform
                  </p>
                </div>

                <button
                  type="button"
                  aria-label="Close navigation"
                  onClick={closeDrawer}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-white/40 transition-colors hover:bg-white/[0.06] hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Navigation */}

              <nav className="min-h-0 flex-1 overflow-y-auto p-4">
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

              <div className="shrink-0 border-t border-white/[0.07] p-4">
                <Link
                  href="/dashboard"
                  onClick={closeDrawer}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/40 transition-colors hover:bg-white/[0.045] hover:text-white/75"
                >
                  <FolderKanban className="h-[17px] w-[17px]" />

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