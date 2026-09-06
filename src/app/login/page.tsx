'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Loader2,
  Sparkles,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] =
    useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    setLoading(true)
    setErrorMessage('')

    const { error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      })

    setLoading(false)

    if (error) {
      setErrorMessage(error.message)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-sky-400/[0.08] blur-3xl" />
        <div className="absolute -bottom-40 -right-32 h-[30rem] w-[30rem] rounded-full bg-violet-400/[0.08] blur-3xl" />
        <div className="absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-emerald-400/[0.035] blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl items-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid w-full overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.02] shadow-2xl shadow-black/20 lg:grid-cols-[1.05fr_0.95fr]">
          {/* Brand panel */}
          <div className="relative hidden overflow-hidden border-r border-white/[0.07] bg-gradient-to-br from-sky-400/[0.09] via-violet-400/[0.05] to-transparent p-10 lg:flex lg:flex-col lg:justify-between xl:p-14">
            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border border-sky-300/[0.08]" />
            <div className="pointer-events-none absolute -bottom-32 -left-32 h-80 w-80 rounded-full border border-violet-300/[0.08]" />

            <div className="relative">
              {/* Logo */}
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-300 to-violet-400 shadow-lg shadow-sky-950/30">
                  <BookOpen className="h-5 w-5 text-slate-950" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-white">
                    Math Teaching
                  </p>
                  <p className="text-xs text-white/35">
                    Teacher Workspace
                  </p>
                </div>
              </div>

              {/* Hero */}
              <div className="mt-24 max-w-md">
                <div className="inline-flex items-center gap-2 rounded-full border border-sky-300/15 bg-sky-300/[0.06] px-3 py-1.5 text-xs font-medium text-sky-200/80">
                  <Sparkles className="h-3.5 w-3.5" />
                  Teaching workspace
                </div>

                <h1 className="mt-6 text-4xl font-semibold leading-tight tracking-tight text-white xl:text-5xl">
                  Buat pembelajaran
                  <span className="block bg-gradient-to-r from-sky-300 via-violet-300 to-emerald-300 bg-clip-text text-transparent">
                    matematika lebih mudah.
                  </span>
                </h1>

                <p className="mt-6 text-sm leading-7 text-white/45">
                  Kelola module, question bank,
                  worksheet, kelas, dan student
                  submissions dalam satu workspace.
                </p>
              </div>
            </div>

            {/* Features */}
            <div className="relative mt-12 space-y-3">
              {[
                'Buat dan kelola soal matematika',
                'Bagikan worksheet kepada siswa',
                'Pantau dan nilai student submissions',
              ].map((feature) => (
                <div
                  key={feature}
                  className="flex items-center gap-3 text-sm text-white/55"
                >
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-300" />
                  {feature}
                </div>
              ))}
            </div>
          </div>

          {/* Login panel */}
          <div className="flex items-center justify-center bg-[#0b0b0b]/80 p-5 sm:p-8 lg:p-10 xl:p-14">
            <Card className="w-full max-w-md border-white/[0.08] bg-white/[0.025] shadow-xl shadow-black/20">
              <CardContent className="p-6 sm:p-8">
                {/* Mobile brand */}
                <div className="mb-8 flex items-center gap-3 lg:hidden">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-300 to-violet-400">
                    <BookOpen className="h-5 w-5 text-slate-950" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-white">
                      Math Teaching
                    </p>
                    <p className="text-xs text-white/35">
                      Teacher Workspace
                    </p>
                  </div>
                </div>

                {/* Heading */}
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-sky-300/70">
                    Welcome back
                  </p>

                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
                    Login ke workspace
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-white/40">
                    Masuk menggunakan akun teacher
                    Anda untuk melanjutkan.
                  </p>
                </div>

                {/* Form */}
                <form
                  onSubmit={handleLogin}
                  className="mt-8 space-y-5"
                >
                  <div>
                    <label
                      htmlFor="email"
                      className="text-sm font-medium text-white"
                    >
                      Email
                    </label>

                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="nama@email.com"
                      value={email}
                      onChange={(event) =>
                        setEmail(event.target.value)
                      }
                      disabled={loading}
                      required
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="password"
                        className="text-sm font-medium text-white"
                      >
                        Password
                      </label>
                    </div>

                    <Input
                      id="password"
                      type="password"
                      autoComplete="current-password"
                      placeholder="Masukkan password"
                      value={password}
                      onChange={(event) =>
                        setPassword(
                          event.target.value,
                        )
                      }
                      disabled={loading}
                      required
                      className="mt-2"
                    />
                  </div>

                  {/* Error */}
                  {errorMessage && (
                    <div className="rounded-xl border border-rose-400/20 bg-rose-400/[0.06] px-4 py-3">
                      <p className="text-sm leading-5 text-rose-300">
                        {errorMessage}
                      </p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={loading}
                    className="h-11 w-full"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        Login
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>

                <div className="mt-8 border-t border-white/[0.07] pt-5">
                  <p className="text-center text-xs leading-5 text-white/30">
                    Gunakan akun teacher yang telah
                    terdaftar untuk mengakses
                    workspace.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}