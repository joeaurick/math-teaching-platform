'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'
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

export default function RegisterPage() {
  const supabase = createClient()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleRegister(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    setLoading(true)
    setMessage('')

    const { error } =
      await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })

    setLoading(false)

    if (error) {
      setMessage(error.message)
      return
    }

    setMessage(
      'Registrasi berhasil. Silakan cek email untuk verifikasi jika diperlukan.',
    )
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-50">
      {/* Latar dekoratif */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[26rem] w-[26rem] rounded-full bg-violet-400/10 blur-3xl sm:h-[32rem] sm:w-[32rem]" />
        <div className="absolute -bottom-48 -right-40 h-[30rem] w-[30rem] rounded-full bg-indigo-400/10 blur-3xl sm:h-[36rem] sm:w-[36rem]" />
        <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-300/5 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl items-center px-4 py-5 sm:px-6 sm:py-8 lg:px-8">
        <div className="grid w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.08)] sm:rounded-3xl lg:grid-cols-[1.05fr_0.95fr]">
          {/* Informasi */}
          <div className="relative hidden overflow-hidden border-r border-slate-200 bg-gradient-to-br from-violet-50 via-indigo-50/70 to-white p-10 lg:flex lg:flex-col lg:justify-between xl:p-14">
            <div className="pointer-events-none absolute -right-28 -top-28 h-80 w-80 rounded-full border border-violet-200/60" />
            <div className="pointer-events-none absolute -bottom-32 -left-32 h-72 w-72 rounded-full border border-indigo-200/40" />

            <div className="relative">
              {/* Merek */}
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-200/60">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Math Teaching
                  </p>

                  <p className="text-xs text-slate-500">
                    Ruang Kerja Guru
                  </p>
                </div>
              </div>

              {/* Headline */}
              <div className="mt-20 max-w-md">
                <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white/80 px-3 py-1.5 text-xs font-medium text-violet-700 shadow-sm">
                  <Sparkles className="h-3.5 w-3.5" />
                  Ruang kerja guru
                </div>

                <h1 className="mt-6 text-4xl font-semibold leading-[1.12] tracking-tight text-slate-900 xl:text-5xl">
                  Mengajar matematika
                  <span className="block bg-gradient-to-r from-violet-500 via-indigo-500 to-fuchsia-500 bg-clip-text text-transparent">
                    jadi lebih teratur.
                  </span>
                </h1>

                <p className="mt-6 max-w-sm text-sm leading-7 text-slate-600">
                  Satu tempat untuk membuat soal,
                  menyusun worksheet, mengelola kelas,
                  dan melihat hasil pekerjaan siswa.
                </p>
              </div>

              {/* Fitur utama */}
              <div className="mt-10 space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />

                  <div>
                    <p className="text-sm font-medium text-slate-800">
                      Buat soal dengan mudah
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Kelola berbagai jenis soal
                      matematika dalam satu bank soal.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-indigo-500" />

                  <div>
                    <p className="text-sm font-medium text-slate-800">
                      Bagikan tugas kepada siswa
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Susun soal menjadi worksheet dan
                      bagikan kepada siswa dengan mudah.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-violet-500" />

                  <div>
                    <p className="text-sm font-medium text-slate-800">
                      Pantau pekerjaan siswa
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Lihat jawaban, berikan nilai, dan
                      berikan umpan balik kepada siswa.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <p className="relative text-xs leading-5 text-slate-400">
              Dibuat untuk membantu guru fokus pada
              kegiatan mengajar.
            </p>
          </div>

          {/* Form */}
          <div className="flex min-h-full items-center justify-center bg-slate-50/70 p-4 sm:p-8 lg:p-10 xl:p-14">
            <Card className="w-full max-w-md border-slate-200 bg-white shadow-[0_18px_55px_rgba(15,23,42,0.07)]">
              <CardContent className="!p-5 sm:!p-8">
                {/* Merek mobile */}
                <div className="mb-7 flex items-center gap-3 lg:hidden">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-md shadow-violet-200/60">
                    <BookOpen className="h-5 w-5 text-white" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Math Teaching
                    </p>

                    <p className="text-xs text-slate-500">
                      Ruang Kerja Guru
                    </p>
                  </div>
                </div>

                {/* Heading */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-600">
                    Mulai sekarang
                  </p>

                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 sm:text-[1.7rem]">
                    Buat akun guru
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Buat akun untuk mulai membuat
                    materi dan mengelola pembelajaran
                    matematika.
                  </p>
                </div>

                {/* Form */}
                <form
                  onSubmit={handleRegister}
                  className="mt-7 space-y-5 sm:mt-8"
                >
                  <div>
                    <label
                      htmlFor="fullName"
                      className="text-sm font-medium text-slate-800"
                    >
                      Nama lengkap
                    </label>

                    <Input
                      id="fullName"
                      type="text"
                      autoComplete="name"
                      placeholder="Nama lengkap Anda"
                      value={fullName}
                      onChange={(event) =>
                        setFullName(
                          event.target.value,
                        )
                      }
                      disabled={loading}
                      required
                      className="mt-2 h-11"
                    />
                  </div>

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
                        setEmail(
                          event.target.value,
                        )
                      }
                      disabled={loading}
                      required
                      className="mt-2 h-11"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="text-sm font-medium text-slate-800"
                    >
                      Kata sandi
                    </label>

                    <Input
                      id="password"
                      type="password"
                      autoComplete="new-password"
                      placeholder="Minimal 6 karakter"
                      value={password}
                      onChange={(event) =>
                        setPassword(
                          event.target.value,
                        )
                      }
                      disabled={loading}
                      required
                      minLength={6}
                      className="mt-2 h-11"
                    />

                    <p className="mt-2 text-xs leading-5 text-slate-400">
                      Gunakan minimal 6 karakter.
                    </p>
                  </div>

                  {/* Pesan */}
                  {message && (
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                      <p className="text-sm leading-5 text-emerald-700">
                        {message}
                      </p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={loading}
                    className="h-11 w-full bg-gradient-to-r from-violet-600 to-indigo-600 shadow-md shadow-violet-200/60 transition-all duration-200 hover:from-violet-700 hover:to-indigo-700 hover:shadow-lg hover:shadow-violet-200/70"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Membuat akun...
                      </>
                    ) : (
                      <>
                        Buat akun
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>

                {/* Login */}
                <div className="mt-7 border-t border-slate-100 pt-5 text-center">
                  <p className="text-xs text-slate-400">
                    Sudah memiliki akun?
                  </p>

                  <Link
                    href="/login"
                    className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-violet-600 transition-colors hover:text-violet-700"
                  >
                    Masuk ke akun
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}