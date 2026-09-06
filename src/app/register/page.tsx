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
    <main className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[28rem] w-[28rem] rounded-full bg-sky-400/[0.08] blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-[32rem] w-[32rem] rounded-full bg-violet-400/[0.08] blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl items-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid w-full overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.02] shadow-2xl shadow-black/20 lg:grid-cols-[1.05fr_0.95fr]">
          {/* Informasi */}
          <div className="relative hidden overflow-hidden border-r border-white/[0.07] bg-gradient-to-br from-sky-400/[0.08] via-violet-400/[0.05] to-transparent p-10 lg:flex lg:flex-col lg:justify-between xl:p-14">
            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border border-sky-300/[0.08]" />

            <div>
              {/* Brand */}
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-300 to-violet-400 shadow-lg shadow-sky-950/30">
                  <BookOpen className="h-5 w-5 text-slate-950" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-white">
                    Math Teaching
                  </p>

                  <p className="text-xs text-white/35">
                    Workspace Guru
                  </p>
                </div>
              </div>

              {/* Headline */}
              <div className="mt-20 max-w-md">
                <div className="inline-flex items-center gap-2 rounded-full border border-sky-300/15 bg-sky-300/[0.06] px-3 py-1.5 text-xs font-medium text-sky-200/80">
                  <Sparkles className="h-3.5 w-3.5" />
                  Ruang kerja guru
                </div>

                <h1 className="mt-6 text-4xl font-semibold leading-tight tracking-tight text-white xl:text-5xl">
                  Mengajar matematika
                  <span className="block bg-gradient-to-r from-sky-300 via-violet-300 to-emerald-300 bg-clip-text text-transparent">
                    jadi lebih teratur.
                  </span>
                </h1>

                <p className="mt-6 text-sm leading-7 text-white/45">
                  Satu tempat untuk membuat soal,
                  menyusun worksheet, mengelola
                  kelas, dan melihat hasil pekerjaan
                  siswa.
                </p>
              </div>

              {/* Poin utama */}
              <div className="mt-10 space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />

                  <div>
                    <p className="text-sm font-medium text-white/75">
                      Buat soal dengan mudah
                    </p>
                    <p className="mt-1 text-xs leading-5 text-white/35">
                      Kelola berbagai jenis soal
                      matematika dalam satu bank soal.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-sky-300" />

                  <div>
                    <p className="text-sm font-medium text-white/75">
                      Bagikan tugas kepada siswa
                    </p>
                    <p className="mt-1 text-xs leading-5 text-white/35">
                      Susun soal menjadi worksheet dan
                      bagikan ke siswa dengan mudah.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-violet-300" />

                  <div>
                    <p className="text-sm font-medium text-white/75">
                      Pantau pekerjaan siswa
                    </p>
                    <p className="mt-1 text-xs leading-5 text-white/35">
                      Lihat jawaban, berikan nilai, dan
                      berikan feedback kepada siswa.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-xs text-white/25">
              Dibuat untuk membantu guru fokus pada
              kegiatan mengajar.
            </p>
          </div>

          {/* Form */}
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
                      Workspace Guru
                    </p>
                  </div>
                </div>

                {/* Heading */}
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-sky-300/70">
                    Mulai sekarang
                  </p>

                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
                    Buat akun guru
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-white/40">
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
                      className="text-sm font-medium text-white"
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
                      className="text-sm font-medium text-white"
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

                    <p className="mt-2 text-xs text-white/30">
                      Gunakan minimal 6 karakter.
                    </p>
                  </div>

                  {/* Message */}
                  {message && (
                    <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/[0.06] px-4 py-3">
                      <p className="text-sm leading-5 text-emerald-300">
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
                <div className="mt-7 border-t border-white/[0.07] pt-5 text-center">
                  <p className="text-xs text-white/35">
                    Sudah memiliki akun?
                  </p>

                  <Link
                    href="/login"
                    className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-sky-300 transition-colors hover:text-sky-200"
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