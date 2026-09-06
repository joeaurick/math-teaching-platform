'use client'

import { useState } from 'react'
import Link from 'next/link'
import { LogOut, Settings, User } from 'lucide-react'
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
          className="flex h-10 items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.025] px-1.5 pr-2.5 transition-colors hover:border-white/[0.12] hover:bg-white/[0.05] disabled:pointer-events-none disabled:opacity-50"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-xs font-semibold text-black">
            {initial}
          </div>

          <div className="hidden max-w-[150px] text-left sm:block">
            <p className="truncate text-xs font-medium text-white/75">
              {displayEmail}
            </p>

            {role && (
              <p className="mt-0.5 text-[10px] capitalize text-white/30">
                {role}
              </p>
            )}
          </div>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-56"
      >
        <div className="px-2.5 py-2">
          <p className="truncate text-sm font-medium text-white">
            {displayEmail}
          </p>

          {role && (
            <p className="mt-1 text-xs capitalize text-white/30">
              {role}
            </p>
          )}
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="/dashboard">
            <User className="h-4 w-4 text-white/40" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/dashboard">
            <Settings className="h-4 w-4 text-white/40" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onSelect={(event) => {
            event.preventDefault()
            void handleSignOut()
          }}
          className="text-red-300 focus:bg-red-400/10 focus:text-red-300"
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