'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  LogOut,
  Settings,
  User,
  ChevronDown,
} from 'lucide-react'
import { useRouter } from 'next/navigation'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { createClient } from '@/lib/supabase/client'

type UserMenuProps = {
  email?: string | null
  role?: string
}

export function UserMenu({
  email,
  role,
}: UserMenuProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleSignOut() {
    if (loading) {
      return
    }

    setLoading(true)

    const supabase = createClient()

    const { error } = await supabase.auth.signOut()

    if (error) {
      setLoading(false)
      return
    }

    router.push('/login')
    router.refresh()
  }

  const displayEmail = email || 'User'
  const initial = displayEmail.charAt(0).toUpperCase()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          disabled={loading}
          aria-label="Open user menu"
          className="group flex h-10 items-center gap-2 rounded-full px-1.5 py-1 transition-colors duration-200 hover:bg-slate-100 disabled:pointer-events-none disabled:opacity-50"
        >
          {/* Avatar */}
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary via-violet-500 to-fuchsia-500 text-xs font-semibold text-white">
            {initial}
          </div>

          {/* User info */}
          <div className="hidden max-w-[150px] min-w-0 text-left sm:block">
            <p className="truncate text-sm font-medium text-slate-900">
              {displayEmail}
            </p>

            {role && (
              <p className="truncate text-[11px] capitalize text-slate-500">
                {role}
              </p>
            )}
          </div>

          <ChevronDown className="hidden h-3.5 w-3.5 text-slate-400 transition-transform duration-200 group-data-[state=open]:rotate-180 sm:block" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={10}
        className="w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-200/70"
      >
        {/* User header */}
        <div className="flex items-center gap-3 rounded-xl px-2.5 py-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary via-violet-500 to-fuchsia-500 text-sm font-semibold text-white">
            {initial}
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900">
              {displayEmail}
            </p>

            {role && (
              <p className="mt-0.5 truncate text-xs capitalize text-slate-500">
                {role}
              </p>
            )}
          </div>
        </div>

        <DropdownMenuSeparator className="my-1.5 bg-slate-100" />

        {/* Profile */}
        <DropdownMenuItem
          asChild
          className="h-10 cursor-pointer rounded-xl px-3 text-slate-700 focus:bg-slate-100 focus:text-slate-900"
        >
          <Link href="/dashboard">
            <User className="h-4 w-4 text-slate-500" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>

        {/* Settings */}
        <DropdownMenuItem
          asChild
          className="h-10 cursor-pointer rounded-xl px-3 text-slate-700 focus:bg-slate-100 focus:text-slate-900"
        >
          <Link href="/dashboard">
            <Settings className="h-4 w-4 text-slate-500" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-1.5 bg-slate-100" />

        {/* Sign out */}
        <DropdownMenuItem
          onSelect={(event) => {
            event.preventDefault()
            void handleSignOut()
          }}
          className="h-10 cursor-pointer rounded-xl px-3 text-rose-600 focus:bg-rose-50 focus:text-rose-700"
        >
          <LogOut className="h-4 w-4" />

          <span>
            {loading ? 'Signing out...' : 'Sign out'}
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}