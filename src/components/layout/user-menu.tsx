'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ChevronDown,
  LogOut,
  Settings,
  UserRound,
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

    const { error } =
      await supabase.auth.signOut()

    if (error) {
      setLoading(false)
      return
    }

    router.push('/login')
    router.refresh()
  }

  const displayEmail =
    email || 'Pengguna'

  const displayRole =
    role === 'owner'
      ? 'Pemilik'
      : role === 'admin'
        ? 'Admin'
        : role === 'teacher'
          ? 'Guru'
          : role

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          disabled={loading}
          aria-label="Buka menu pengguna"
          className="group flex h-10 min-w-0 items-center gap-2 rounded-full border border-slate-200 bg-white px-1.5 py-1 shadow-sm shadow-slate-200/60 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md disabled:pointer-events-none disabled:opacity-50 sm:h-11 sm:gap-2.5 sm:px-1.5"
        >
          {/* Avatar */}

          <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 text-white shadow-md shadow-violet-200/70 ring-2 ring-white sm:h-9 sm:w-9">
            <UserRound
              className="h-[17px] w-[17px] stroke-[1.8] sm:h-[18px] sm:w-[18px]"
            />

            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
          </div>

          {/* Informasi pengguna */}

          <div className="hidden min-w-0 max-w-[170px] text-left sm:block">
            <p className="truncate text-xs font-semibold leading-4 text-slate-900">
              {displayEmail}
            </p>

            {displayRole && (
              <p className="mt-0.5 truncate text-[10px] font-medium leading-3 text-slate-400">
                {displayRole}
              </p>
            )}
          </div>

          <ChevronDown className="hidden h-3.5 w-3.5 shrink-0 text-slate-400 transition-transform duration-200 group-data-[state=open]:rotate-180 sm:block" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={10}
        className="w-[min(300px,calc(100vw-2rem))] rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_20px_60px_rgba(15,23,42,0.12)]"
      >
        {/* Header pengguna */}

        <div className="rounded-xl bg-gradient-to-br from-slate-50 via-white to-violet-50/60 px-3 py-4 sm:px-3.5 sm:py-4">
          <div className="flex min-w-0 items-center gap-3.5">
            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-200/60 ring-4 ring-white">
              <UserRound
                className="h-6 w-6 stroke-[1.7]"
              />

              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-900">
                {displayEmail}
              </p>

              {displayRole && (
                <div className="mt-1 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                  <p className="truncate text-xs font-medium text-slate-500">
                    {displayRole}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <DropdownMenuSeparator className="my-2 bg-slate-100" />

        {/* Profil */}

        <DropdownMenuItem
          asChild
          className="min-h-11 cursor-pointer rounded-xl px-3 text-slate-700 transition-colors focus:bg-slate-50 focus:text-slate-900"
        >
          <Link href="/dashboard">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100">
              <UserRound className="h-4 w-4 text-slate-500" />
            </div>

            <div className="min-w-0 flex-1">
              <span className="block text-sm font-medium">
                Profil
              </span>

              <span className="block truncate text-[10px] text-slate-400">
                Lihat profil Anda
              </span>
            </div>
          </Link>
        </DropdownMenuItem>

        {/* Pengaturan */}

        <DropdownMenuItem
          asChild
          className="min-h-11 cursor-pointer rounded-xl px-3 text-slate-700 transition-colors focus:bg-slate-50 focus:text-slate-900"
        >
          <Link href="/dashboard">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-50">
              <Settings className="h-4 w-4 text-violet-500" />
            </div>

            <div className="min-w-0 flex-1">
              <span className="block text-sm font-medium">
                Pengaturan
              </span>

              <span className="block truncate text-[10px] text-slate-400">
                Atur preferensi akun
              </span>
            </div>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-2 bg-slate-100" />

        {/* Keluar */}

        <DropdownMenuItem
          onSelect={(event) => {
            event.preventDefault()
            void handleSignOut()
          }}
          className="min-h-11 cursor-pointer rounded-xl px-3 text-rose-600 transition-colors focus:bg-rose-50 focus:text-rose-700"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-rose-50">
            <LogOut className="h-4 w-4 text-rose-500" />
          </div>

          <div className="min-w-0 flex-1">
            <span className="block text-sm font-medium">
              {loading
                ? 'Sedang keluar...'
                : 'Keluar'}
            </span>

            <span className="block truncate text-[10px] text-rose-400">
              Keluar dari akun ini
            </span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}