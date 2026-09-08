'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Loader2,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { createModule } from './actions'

type ModuleFormProps = {
  organizationSlug: string
}

type FormState = {
  success: boolean
  error?: string
}

const initialState: FormState = {
  success: false,
}

export function ModuleForm({
  organizationSlug,
}: ModuleFormProps) {
  const action = async (
    _previousState: FormState,
    formData: FormData,
  ): Promise<FormState> => {
    const result = await createModule(
      organizationSlug,
      formData,
    )

    return result ?? { success: true }
  }

  const [state, formAction, isPending] =
    useActionState(
      action,
      initialState,
    )

  return (
    <form action={formAction}>
      <Card className="overflow-hidden border-slate-200 bg-white shadow-sm shadow-slate-200/50">
        <div className="border-b border-slate-100 bg-gradient-to-br from-violet-50 via-white to-indigo-50/50 px-5 py-5 sm:px-6 sm:py-6">
          <div className="flex items-start gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100">
              <BookOpen className="h-5 w-5 text-violet-600" />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-slate-900 sm:text-base">
                Informasi Modul
              </h2>

              <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
                Masukkan nama dan deskripsi singkat
                untuk modul pembelajaran ini.
              </p>
            </div>
          </div>
        </div>

        <CardContent className="space-y-5 !p-5 sm:space-y-6 sm:!p-6">
          <div>
            <label
              htmlFor="title"
              className="mb-2 block text-sm font-medium text-slate-800"
            >
              Judul modul
            </label>

            <Input
              id="title"
              name="title"
              type="text"
              placeholder="Contoh: Dasar-Dasar Aljabar"
              required
              disabled={isPending}
              className="h-11 rounded-xl border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-violet-400 focus:ring-violet-100"
            />

            <p className="mt-2 text-xs leading-5 text-slate-400">
              Gunakan judul yang mudah dikenali oleh Anda dan siswa.
            </p>
          </div>

          <div>
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-medium text-slate-800"
            >
              Deskripsi
            </label>

            <Textarea
              id="description"
              name="description"
              rows={5}
              placeholder="Jelaskan secara singkat apa yang akan dipelajari siswa dalam modul ini..."
              disabled={isPending}
              className="resize-none rounded-xl border-slate-200 bg-white leading-6 text-slate-900 placeholder:text-slate-400 focus:border-violet-400 focus:ring-violet-100"
            />

            <p className="mt-2 text-xs leading-5 text-slate-400">
              Deskripsi membantu menjelaskan tujuan dan isi modul.
            </p>
          </div>

          {state.error && (
            <div
              role="alert"
              className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3"
            >
              <p className="text-sm leading-5 text-rose-700">
                {state.error}
              </p>
            </div>
          )}

          <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-end sm:gap-3">
            <Link
              href={`/${organizationSlug}/modules`}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800 sm:w-auto"
            >
              <ArrowLeft className="h-4 w-4" />
              Batal
            </Link>

            <Button
              type="submit"
              disabled={isPending}
              className="h-11 w-full bg-gradient-to-r from-violet-600 to-indigo-600 shadow-md shadow-violet-200/60 hover:from-violet-700 hover:to-indigo-700 sm:w-auto"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Membuat modul...
                </>
              ) : (
                <>
                  Buat modul
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}