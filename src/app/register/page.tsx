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
    <main className="relative min-h-screen overflow-hidden bg-[#f6f8fc]">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[28rem] w-[28rem] rounded-full bg-sky-400/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-[32rem] w-[32rem] rounded-full bg-violet-400/10 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl items-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60 lg:grid-cols-[1.05fr_0.95fr]">
          {/* Informasi */}
          <div className="relative hidden overflow-hidden border-r border-slate-200 bg-gradient-to-br from-sky-50 via-violet-50 to-white p-10 lg:flex lg:flex-col lg:justify-between xl:p-14">
            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border border-sky-200/70" />

            <div>
              {/* Brand */}
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-violet-500 shadow-lg shadow-sky-200/60">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Math Teaching
                  </p>

                  <p className="text-xs text-slate-500">
                    Workspace Guru
                  </p>
                </div>
              </div>

              {/* Headline */}
              <div className="mt-20 max-w-md">
                <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-medium text-sky-700">
                  <Sparkles className="h-3.5 w-3.5" />
                  Ruang kerja guru
                </div>

                <h1 className="mt-6 text-4xl font-semibold leading-tight tracking-tight text-slate-900 xl:text-5xl">
                  Mengajar matematika
                  <span className="block bg-gradient-to-r from-sky-500 via-violet-500 to-emerald-500 bg-clip-text text-transparent">
                    jadi lebih teratur.
                  </span>
                </h1>

                <p className="mt-6 text-sm leading-7 text-slate-600">
                  Satu tempat untuk membuat soal,
                  menyusun worksheet, mengelola
                  kelas, dan melihat hasil pekerjaan
                  siswa.
                </p>
              </div>

              {/* Poin utama */}
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
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-sky-500" />

                  <div>
                    <p className="text-sm font-medium text-slate-800">
                      Bagikan tugas kepada siswa
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Susun soal menjadi worksheet dan
                      bagikan ke siswa dengan mudah.
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
                      berikan feedback kepada siswa.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-400">
              Dibuat untuk membantu guru fokus pada
              kegiatan mengajar.
            </p>
          </div>

          {/* Form */}
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
                      Workspace Guru
                    </p>
                  </div>
                </div>

                {/* Heading */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                    Mulai sekarang
                  </p>

                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
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
                  className="mt-8 space-y-5"
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
                      className="mt-2"
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
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="text-sm font-medium text-slate-800"
                    >
                      Password
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
                      className="mt-2"
                    />

                    <p className="mt-2 text-xs text-slate-400">
                      Gunakan minimal 6 karakter.
                    </p>
                  </div>

                  {/* Message */}
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
                    className="h-11 w-full"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Membuat akun...
                      </>
                    ) : (
                      <>
                        Buat Akun
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
                    className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary/80"
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