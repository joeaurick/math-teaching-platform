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
          className="flex min-w-0 max-w-[240px] items-center gap-2 rounded-xl border border-transparent px-2 py-1.5 text-left transition-colors hover:border-slate-200 hover:bg-slate-50 sm:max-w-[300px]"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50">
            <FolderKanban className="h-4 w-4 text-slate-600" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-slate-800">
              {organizationName}
            </p>

            <p className="hidden truncate text-[10px] text-slate-500 sm:block">
              /{organizationSlug}
            </p>
          </div>

          <ChevronsUpDown className="h-4 w-4 shrink-0 text-slate-500" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        sideOffset={8}
        className="w-64"
      >
        <div className="px-2.5 py-2">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">
            Current workspace
          </p>

          <p className="mt-1 truncate text-sm font-medium text-slate-900">
            {organizationName}
          </p>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href={`/${organizationSlug}`}>
            <FolderKanban className="h-4 w-4 text-slate-500" />
            <span>Open workspace</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="/dashboard">
            <FolderKanban className="h-4 w-4 text-slate-500" />
            <span>All organizations</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/create-organization">
            <Plus className="h-4 w-4 text-slate-500" />
            <span>New organization</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}