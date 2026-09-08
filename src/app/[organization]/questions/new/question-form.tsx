'use client'

import {
  useActionState,
  useState,
} from 'react'
import Link from 'next/link'
import {
  CheckCircle2,
  CircleHelp,
  FileText,
  Hash,
  Info,
  ListChecks,
  PenLine,
  Send,
  Sparkles,
  ToggleLeft,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

import { createQuestion } from './actions'

type Module = {
  id: string
  title: string
}

type QuestionFormProps = {
  organizationSlug: string
  modules: Module[]
  selectedModuleId?: string
}

type FormState = {
  success: boolean
  error?: string
}

const initialState: FormState = {
  success: false,
}

const optionLabels = [
  'A',
  'B',
  'C',
  'D',
]

export function QuestionForm({
  organizationSlug,
  modules,
  selectedModuleId = '',
}: QuestionFormProps) {
  const [
    questionType,
    setQuestionType,
  ] = useState(
    'multiple_choice',
  )

  const action = async (
    _previousState: FormState,
    formData: FormData,
  ): Promise<FormState> => {
    const result =
      await createQuestion(
        organizationSlug,
        formData,
      )

    return (
      result ?? {
        success: true,
      }
    )
  }

  const [
    state,
    formAction,
    isPending,
  ] = useActionState(
    action,
    initialState,
  )

  return (
    <form action={formAction}>
      <Card className="overflow-hidden border-slate-200 bg-white shadow-[0_18px_55px_rgba(15,23,42,0.06)]">
        <CardContent className="space-y-7 !p-5 sm:space-y-8 sm:!p-6 lg:!p-7">
          {/* MODULE */}
          <div>
            <label
              htmlFor="module_id"
              className="mb-2 block text-sm font-medium text-slate-800"
            >
              Modul
            </label>

            <select
              id="module_id"
              name="module_id"
              required
              disabled={isPending}
              defaultValue={
                selectedModuleId
              }
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none transition-colors focus:border-violet-400 focus:ring-2 focus:ring-violet-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-60"
            >
              <option
                value=""
                disabled
              >
                Pilih modul
              </option>

              {modules.map(
                (module) => (
                  <option
                    key={
                      module.id
                    }
                    value={
                      module.id
                    }
                  >
                    {module.title}
                  </option>
                ),
              )}
            </select>

            {modules.length ===
              0 && (
              <p className="mt-2 text-xs leading-5 text-amber-600">
                Belum ada modul. Buat modul terlebih
                dahulu sebelum membuat soal.
              </p>
            )}
          </div>

          {/* TITLE */}
          <div>
            <label
              htmlFor="title"
              className="mb-2 block text-sm font-medium text-slate-800"
            >
              Judul soal
            </label>

            <Input
              id="title"
              name="title"
              type="text"
              required
              disabled={isPending}
              placeholder="Contoh: Menyelesaikan persamaan linear"
              className="h-11 rounded-xl border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-violet-400 focus:ring-violet-100"
            />
          </div>

          {/* QUESTION TYPE */}
          <div>
            <label
              htmlFor="question_type"
              className="mb-2 block text-sm font-medium text-slate-800"
            >
              Jenis soal
            </label>

            <select
              id="question_type"
              name="question_type"
              value={
                questionType
              }
              onChange={(
                event,
              ) => {
                setQuestionType(
                  event.target
                    .value,
                )
              }}
              disabled={
                isPending
              }
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none transition-colors focus:border-violet-400 focus:ring-2 focus:ring-violet-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-60"
            >
              <option value="multiple_choice">
                Pilihan Ganda
              </option>

              <option value="true_false">
                Benar / Salah
              </option>

              <option value="short_answer">
                Jawaban Singkat
              </option>

              <option value="numeric">
                Numerik
              </option>

              <option value="essay">
                Esai
              </option>
            </select>
          </div>

          {/* QUESTION */}
          <div>
            <div className="mb-2 flex items-center gap-2">
              <label
                htmlFor="content"
                className="block text-sm font-medium text-slate-800"
              >
                Pertanyaan
              </label>

              <CircleHelp className="h-3.5 w-3.5 text-slate-400" />
            </div>

            <Textarea
              id="content"
              name="content"
              required
              rows={7}
              disabled={isPending}
              placeholder="Tulis pertanyaan matematika di sini..."
              className="resize-none rounded-xl border-slate-200 bg-white leading-6 text-slate-900 placeholder:text-slate-400 focus:border-violet-400 focus:ring-violet-100"
            />

            <p className="mt-2 text-xs leading-5 text-slate-400">
              Tulis pertanyaan dengan jelas agar mudah
              dipahami siswa.
            </p>
          </div>

          {/* MULTIPLE CHOICE */}
          {questionType ===
            'multiple_choice' && (
            <div className="rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-50 via-white to-indigo-50/40 p-4 sm:p-5">
              <div className="mb-5 flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-violet-200 bg-violet-100">
                  <ListChecks className="h-5 w-5 text-violet-600" />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    Pilihan Jawaban
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Masukkan empat pilihan dan tentukan
                    jawaban yang benar.
                  </p>
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                {optionLabels.map(
                  (
                    label,
                    index,
                  ) => (
                    <div
                      key={label}
                      className="flex flex-wrap items-center gap-2.5 sm:flex-nowrap sm:gap-3"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-violet-200 bg-violet-50 text-sm font-semibold text-violet-700">
                        {label}
                      </div>

                      <Input
                        type="text"
                        name={`option_${index}`}
                        required
                        disabled={
                          isPending
                        }
                        placeholder={`Pilihan ${label}`}
                        className="h-11 min-w-0 flex-1 rounded-xl border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-violet-400 focus:ring-violet-100"
                      />

                      <label className="flex min-h-10 shrink-0 cursor-pointer items-center gap-2 rounded-lg px-2 text-xs text-slate-500 transition-colors hover:bg-violet-50 hover:text-violet-700">
                        <input
                          type="radio"
                          name="correct_option"
                          value={index}
                          required
                          disabled={
                            isPending
                          }
                          className="h-4 w-4 accent-violet-600"
                        />

                        <span>
                          Benar
                        </span>
                      </label>
                    </div>
                  ),
                )}
              </div>
            </div>
          )}

          {/* TRUE / FALSE */}
          {questionType ===
            'true_false' && (
            <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-emerald-50/40 p-4 sm:p-5">
              <div className="mb-5 flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-100">
                  <ToggleLeft className="h-5 w-5 text-emerald-600" />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    Jawaban Benar
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Tentukan apakah pernyataan benar atau
                    salah.
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-emerald-300 hover:bg-emerald-50/50">
                  <input
                    type="radio"
                    name="true_false_answer"
                    value="true"
                    required
                    disabled={
                      isPending
                    }
                    className="h-4 w-4 accent-emerald-600"
                  />

                  <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  </span>

                  <span className="text-sm font-medium text-slate-700">
                    Benar
                  </span>
                </label>

                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-rose-300 hover:bg-rose-50/50">
                  <input
                    type="radio"
                    name="true_false_answer"
                    value="false"
                    required
                    disabled={
                      isPending
                    }
                    className="h-4 w-4 accent-rose-600"
                  />

                  <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-rose-200 bg-rose-50">
                    <span className="text-sm font-semibold text-rose-600">
                      ×
                    </span>
                  </span>

                  <span className="text-sm font-medium text-slate-700">
                    Salah
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* SHORT ANSWER */}
          {questionType ===
            'short_answer' && (
            <div className="rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-50 via-white to-sky-50/40 p-4 sm:p-5">
              <div className="mb-5 flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-sky-200 bg-sky-100">
                  <PenLine className="h-5 w-5 text-sky-600" />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    Jawaban yang Diharapkan
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Masukkan jawaban yang diharapkan dari
                    siswa.
                  </p>
                </div>
              </div>

              <Input
                type="text"
                name="short_answer"
                required
                disabled={
                  isPending
                }
                placeholder="Contoh: x = 5"
                className="h-11 rounded-xl border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-sky-400 focus:ring-sky-100"
              />
            </div>
          )}

          {/* NUMERIC */}
          {questionType ===
            'numeric' && (
            <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 via-white to-amber-50/40 p-4 sm:p-5">
              <div className="mb-5 flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-amber-200 bg-amber-100">
                  <Hash className="h-5 w-5 text-amber-600" />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    Jawaban Numerik
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Masukkan jawaban numerik yang tepat.
                  </p>
                </div>
              </div>

              <Input
                type="number"
                name="numeric_answer"
                required
                disabled={
                  isPending
                }
                step="any"
                placeholder="Contoh: 42"
                className="h-11 rounded-xl border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-amber-400 focus:ring-amber-100"
              />
            </div>
          )}

          {/* ESSAY */}
          {questionType ===
            'essay' && (
            <div className="rounded-2xl border border-rose-200 bg-gradient-to-br from-rose-50 via-white to-rose-50/40 p-4 sm:p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-rose-200 bg-rose-100">
                  <FileText className="h-5 w-5 text-rose-600" />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    Penilaian Manual
                  </h3>

                  <p className="mt-1 text-xs leading-6 text-slate-500">
                    Soal esai tidak memerlukan jawaban
                    otomatis. Guru akan memeriksa dan
                    memberikan nilai secara manual.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* EXPLANATION */}
          <div>
            <div className="mb-2 flex items-center gap-2">
              <label
                htmlFor="explanation"
                className="block text-sm font-medium text-slate-800"
              >
                Penjelasan
              </label>

              <span className="text-xs font-normal text-slate-400">
                Opsional
              </span>
            </div>

            <Textarea
              id="explanation"
              name="explanation"
              rows={5}
              disabled={
                isPending
              }
              placeholder="Jelaskan solusi atau langkah penyelesaiannya..."
              className="resize-none rounded-xl border-slate-200 bg-white leading-6 text-slate-900 placeholder:text-slate-400 focus:border-emerald-400 focus:ring-emerald-100"
            />

            <p className="mt-2 text-xs leading-5 text-slate-400">
              Penjelasan dapat digunakan untuk membantu
              siswa memahami langkah penyelesaian.
            </p>
          </div>

          {/* ERROR */}
          {state.error && (
            <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />

              <p className="text-sm leading-5 text-rose-700">
                {state.error}
              </p>
            </div>
          )}

          {/* ACTIONS */}
          <div className="flex flex-col gap-4 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-2 text-xs leading-5 text-slate-400">
              <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-violet-500" />

              <span>
                Soal akan tersimpan di Bank Soal.
              </span>
            </div>

            <div className="flex w-full flex-col-reverse gap-2.5 sm:w-auto sm:flex-row sm:items-center">
              <Link
                href={`/${organizationSlug}/questions`}
                className="inline-flex h-11 w-full items-center justify-center rounded-xl px-4 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-800 sm:w-auto"
              >
                Batal
              </Link>

              <Button
                type="submit"
                disabled={
                  isPending ||
                  modules.length === 0
                }
                className="h-11 w-full bg-gradient-to-r from-violet-600 to-indigo-600 shadow-md shadow-violet-200/60 hover:from-violet-700 hover:to-indigo-700 sm:w-auto"
              >
                {isPending ? (
                  'Membuat soal...'
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Buat Soal
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}