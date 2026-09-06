'use client'

import Link from 'next/link'
import {
  ChevronsUpDown,
  FolderKanban,
  Plus,
} from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

type OrganizationSwitcherProps = {
  organizationSlug: string
  organizationName: string
}

export function OrganizationSwitcher({
  organizationSlug,
  organizationName,
}: OrganizationSwitcherProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="group flex min-w-0 max-w-[240px] items-center gap-2 rounded-xl border border-sky-200 bg-gradient-to-r from-sky-50 via-blue-50 to-violet-50 px-2 py-1.5 text-left shadow-sm shadow-sky-100/70 transition-all duration-200 hover:border-violet-200 hover:from-sky-100 hover:via-blue-50 hover:to-violet-100 hover:shadow-md hover:shadow-violet-100/60 sm:max-w-[300px]"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/80 bg-white shadow-sm">
            <FolderKanban className="h-4 w-4 text-primary" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-900">
              {organizationName}
            </p>

            <p className="hidden truncate text-[10px] font-medium text-slate-500 sm:block">
              /{organizationSlug}
            </p>
          </div>

          <ChevronsUpDown className="h-4 w-4 shrink-0 text-slate-500 transition-colors group-hover:text-violet-600" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        sideOffset={8}
        className="w-64 border border-slate-200 bg-white p-1.5 text-slate-900 shadow-xl shadow-slate-200/60"
      >
        <div className="rounded-xl bg-gradient-to-r from-sky-50 via-blue-50 to-violet-50 px-3 py-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-primary">
            Current workspace
          </p>

          <p className="mt-1 truncate text-sm font-semibold text-slate-900">
            {organizationName}
          </p>

          <p className="mt-0.5 truncate text-[10px] text-slate-500">
            /{organizationSlug}
          </p>
        </div>

        <DropdownMenuSeparator className="my-1.5 bg-slate-100" />

        <DropdownMenuItem
          asChild
          className="cursor-pointer rounded-lg text-slate-700 focus:bg-sky-50 focus:text-slate-900"
        >
          <Link href={`/${organizationSlug}`}>
            <FolderKanban className="h-4 w-4 text-sky-600" />
            <span>Open workspace</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-1.5 bg-slate-100" />

        <DropdownMenuItem
          asChild
          className="cursor-pointer rounded-lg text-slate-700 focus:bg-violet-50 focus:text-slate-900"
        >
          <Link href="/dashboard">
            <FolderKanban className="h-4 w-4 text-violet-600" />
            <span>All organizations</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem
          asChild
          className="cursor-pointer rounded-lg text-slate-700 focus:bg-emerald-50 focus:text-slate-900"
        >
          <Link href="/create-organization">
            <Plus className="h-4 w-4 text-emerald-600" />
            <span>New organization</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}