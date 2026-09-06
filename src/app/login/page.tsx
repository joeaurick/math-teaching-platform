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
  const [errorMessage, setErrorMessage] = useState('')
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
    <main className="relative min-h-screen overflow-hidden bg-[#f6f8fc]">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-sky-400/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-32 h-[30rem] w-[30rem] rounded-full bg-violet-400/10 blur-3xl" />
        <div className="absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-emerald-400/5 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl items-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60 lg:grid-cols-[1.05fr_0.95fr]">
          {/* Brand panel */}
          <div className="relative hidden overflow-hidden border-r border-slate-200 bg-gradient-to-br from-sky-50 via-violet-50 to-white p-10 lg:flex lg:flex-col lg:justify-between xl:p-14">
            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border border-sky-200/70" />
            <div className="pointer-events-none absolute -bottom-32 -left-32 h-80 w-80 rounded-full border border-violet-200/70" />

            <div className="relative">
              {/* Logo */}
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-violet-500 shadow-lg shadow-sky-200/60">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Math Teaching
                  </p>
                  <p className="text-xs text-slate-500">
                    Teacher Workspace
                  </p>
                </div>
              </div>

              {/* Hero */}
              <div className="mt-24 max-w-md">
                <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-medium text-sky-700">
                  <Sparkles className="h-3.5 w-3.5" />
                  Teaching workspace
                </div>

                <h1 className="mt-6 text-4xl font-semibold leading-tight tracking-tight text-slate-900 xl:text-5xl">
                  Buat pembelajaran
                  <span className="block bg-gradient-to-r from-sky-500 via-violet-500 to-emerald-500 bg-clip-text text-transparent">
                    matematika lebih mudah.
                  </span>
                </h1>

                <p className="mt-6 text-sm leading-7 text-slate-600">
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
                  className="flex items-center gap-3 text-sm text-slate-600"
                >
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                  {feature}
                </div>
              ))}
            </div>
          </div>

          {/* Login panel */}
          <div className="flex items-center justify-center bg-slate-50/80 p-5 sm:p-8 lg:p-10 xl:p-14">
            <Card className="w-full max-w-md border-slate-200 bg-white shadow-lg shadow-slate-200/60">
              <CardContent className="!p-6 sm:!p-8">
                {/* Mobile brand */}
                <div className="mb-8 flex items-center gap-3 lg:hidden">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-violet-500 shadow-sm">
                    <BookOpen className="h-5 w-5 text-white" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Math Teaching
                    </p>
                    <p className="text-xs text-slate-500">
                      Teacher Workspace
                    </p>
                  </div>
                </div>

                {/* Heading */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                    Welcome back
                  </p>

                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
                    Login ke workspace
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
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
                      className="text-sm font-medium text-slate-800"
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
                        className="text-sm font-medium text-slate-800"
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
                        setPassword(event.target.value)
                      }
                      disabled={loading}
                      required
                      className="mt-2"
                    />
                  </div>

                  {/* Error */}
                  {errorMessage && (
                    <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3">
                      <p className="text-sm leading-5 text-rose-700">
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

                <div className="mt-8 border-t border-slate-100 pt-5">
                  <p className="text-center text-xs leading-5 text-slate-400">
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