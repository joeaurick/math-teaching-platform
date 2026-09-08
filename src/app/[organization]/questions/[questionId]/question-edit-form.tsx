'use client'

import { useActionState, useState } from 'react'
import Link from 'next/link'
import {
  CheckCircle2,
  FileText,
  Hash,
  Info,
  ListChecks,
  PenLine,
  Save,
  Sparkles,
  ToggleLeft,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

import { updateQuestion } from './actions'

type Module = {
  id: string
  title: string
}

type QuestionOption = {
  id: string
  option_text: string
  is_correct: boolean
  sort_order: number
}

type QuestionEditFormProps = {
  organizationSlug: string
  questionId: string
  modules: Module[]
  initialData: {
    moduleId: string
    title: string
    questionType: string
    content: string
    explanation: string
    status: string
    options: QuestionOption[]
  }
}

type FormState = {
  success: boolean
  error?: string
}

const initialState: FormState = {
  success: false,
}

const optionLabels = ['A', 'B', 'C', 'D']

export function QuestionEditForm({
  organizationSlug,
  questionId,
  modules,
  initialData,
}: QuestionEditFormProps) {
  const [questionType, setQuestionType] = useState(
    initialData.questionType,
  )

  const action = async (
    _previousState: FormState,
    formData: FormData,
  ): Promise<FormState> => {
    const result = await updateQuestion(
      organizationSlug,
      questionId,
      formData,
    )

    return result ?? { success: true }
  }

  const [state, formAction, isPending] = useActionState(
    action,
    initialState,
  )

  const getOptionValue = (index: number) => {
    return (
      initialData.options.find(
        (option) => option.sort_order === index,
      )?.option_text ?? ''
    )
  }

  const getCorrectOption = () => {
    const correctOption = initialData.options.find(
      (option) => option.is_correct,
    )

    return correctOption
      ? String(correctOption.sort_order)
      : ''
  }

  return (
    <form action={formAction}>
      <Card className="overflow-hidden border-slate-200 bg-white shadow-[0_18px_55px_rgba(15,23,42,0.06)]">
        <CardContent className="space-y-7 !p-5 sm:space-y-8 sm:!p-6 lg:!p-7">
          {/* MODUL */}
          <div>
            <label
              htmlFor="module_id"
              className="mb-2 block text-sm font-medium text-slate-800"
            >
              Modul
            </label>

            <Select
              name="module_id"
              defaultValue={initialData.moduleId}
              disabled={isPending}
              required
            >
              <SelectTrigger
                id="module_id"
                className="h-11 w-full rounded-xl border-slate-200 bg-white text-slate-800 shadow-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
              >
                <SelectValue placeholder="Pilih modul" />
              </SelectTrigger>

              <SelectContent>
                {modules.map((module) => (
                  <SelectItem
                    key={module.id}
                    value={module.id}
                  >
                    {module.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {modules.length === 0 && (
              <p className="mt-2 text-xs leading-5 text-amber-600">
                Tidak ada modul yang tersedia.
              </p>
            )}
          </div>

          {/* JUDUL SOAL */}
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
              defaultValue={initialData.title}
              placeholder="Contoh: Menyelesaikan persamaan linear"
              className="h-11 rounded-xl border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 shadow-none focus:border-violet-400 focus:ring-violet-100"
            />
          </div>

          {/* JENIS SOAL */}
          <div>
            <label
              htmlFor="question_type"
              className="mb-2 block text-sm font-medium text-slate-800"
            >
              Jenis soal
            </label>

            <Select
              name="question_type"
              value={questionType}
              onValueChange={setQuestionType}
              disabled={isPending}
            >
              <SelectTrigger
                id="question_type"
                className="h-11 w-full rounded-xl border-slate-200 bg-white text-slate-800 shadow-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
              >
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="multiple_choice">
                  Pilihan Ganda
                </SelectItem>

                <SelectItem value="true_false">
                  Benar / Salah
                </SelectItem>

                <SelectItem value="short_answer">
                  Jawaban Singkat
                </SelectItem>

                <SelectItem value="numeric">
                  Numerik
                </SelectItem>

                <SelectItem value="essay">
                  Esai
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* PERTANYAAN */}
          <div>
            <div className="mb-2 flex items-center gap-2">
              <label
                htmlFor="content"
                className="block text-sm font-medium text-slate-800"
              >
                Pertanyaan
              </label>

              <span className="text-xs text-slate-400">
                Isi soal
              </span>
            </div>

            <Textarea
              id="content"
              name="content"
              required
              rows={7}
              disabled={isPending}
              defaultValue={initialData.content}
              placeholder="Tulis pertanyaan matematika di sini..."
              className="resize-none rounded-xl border-slate-200 bg-white leading-6 text-slate-900 placeholder:text-slate-400 shadow-none focus:border-violet-400 focus:ring-violet-100"
            />
          </div>

          {/* PILIHAN GANDA */}
          {questionType === 'multiple_choice' && (
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
                    Perbarui empat pilihan jawaban dan tentukan jawaban yang benar.
                  </p>
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                {optionLabels.map((label, index) => (
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
                      disabled={isPending}
                      defaultValue={getOptionValue(index)}
                      placeholder={`Pilihan ${label}`}
                      className="h-11 min-w-0 flex-1 rounded-xl border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 shadow-none focus:border-violet-400 focus:ring-violet-100"
                    />

                    <label className="flex min-h-10 shrink-0 cursor-pointer items-center gap-2 rounded-lg px-2 text-xs text-slate-500 transition-colors hover:bg-violet-50 hover:text-violet-700">
                      <input
                        type="radio"
                        name="correct_option"
                        value={index}
                        required
                        disabled={isPending}
                        defaultChecked={
                          getCorrectOption() ===
                          String(index)
                        }
                        className="h-4 w-4 accent-violet-600"
                      />

                      <span>Benar</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* BENAR / SALAH */}
          {questionType === 'true_false' && (
            <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-emerald-50/40 p-4 sm:p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-100">
                  <ToggleLeft className="h-5 w-5 text-emerald-600" />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    Jawaban Benar / Salah
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Konfigurasi jawaban untuk jenis soal ini pada bagian yang sesuai.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* JAWABAN SINGKAT */}
          {questionType === 'short_answer' && (
            <div className="rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-50 via-white to-sky-50/40 p-4 sm:p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-sky-200 bg-sky-100">
                  <PenLine className="h-5 w-5 text-sky-600" />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    Jawaban Singkat
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Gunakan jawaban singkat sesuai konfigurasi soal yang sudah tersimpan.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* NUMERIK */}
          {questionType === 'numeric' && (
            <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 via-white to-amber-50/40 p-4 sm:p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-amber-200 bg-amber-100">
                  <Hash className="h-5 w-5 text-amber-600" />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    Jawaban Numerik
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Gunakan jawaban numerik sesuai konfigurasi soal yang sudah tersimpan.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ESAI */}
          {questionType === 'essay' && (
            <div className="rounded-2xl border border-rose-200 bg-gradient-to-br from-rose-50 via-white to-rose-50/40 p-4 sm:p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-rose-200 bg-rose-100">
                  <FileText className="h-5 w-5 text-rose-600" />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    Soal Esai
                  </h3>

                  <p className="mt-1 text-xs leading-6 text-slate-500">
                    Jawaban esai akan diperiksa dan dinilai secara manual oleh guru.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* PENJELASAN */}
          <div>
            <label
              htmlFor="explanation"
              className="mb-2 block text-sm font-medium text-slate-800"
            >
              Penjelasan
              <span className="ml-2 text-xs font-normal text-slate-400">
                Opsional
              </span>
            </label>

            <Textarea
              id="explanation"
              name="explanation"
              rows={5}
              disabled={isPending}
              defaultValue={initialData.explanation}
              placeholder="Jelaskan solusi atau langkah penyelesaian..."
              className="resize-none rounded-xl border-slate-200 bg-white leading-6 text-slate-900 placeholder:text-slate-400 shadow-none focus:border-violet-400 focus:ring-violet-100"
            />

            <p className="mt-2 text-xs leading-5 text-slate-400">
              Penjelasan dapat digunakan untuk membantu siswa memahami solusi.
            </p>
          </div>

          {/* STATUS */}
          <div>
            <label
              htmlFor="status"
              className="mb-2 block text-sm font-medium text-slate-800"
            >
              Status
            </label>

            <Select
              name="status"
              defaultValue={initialData.status}
              disabled={isPending}
              required
            >
              <SelectTrigger
                id="status"
                className="h-11 w-full rounded-xl border-slate-200 bg-white text-slate-800 shadow-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
              >
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="draft">
                  Draft
                </SelectItem>

                <SelectItem value="published">
                  Dipublikasikan
                </SelectItem>

                <SelectItem value="archived">
                  Diarsipkan
                </SelectItem>
              </SelectContent>
            </Select>
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

          {/* ACTION */}
          <div className="flex flex-col gap-4 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-2 text-xs leading-5 text-slate-400">
              <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-violet-500" />

              <span>
                Perubahan akan disimpan ke soal ini.
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
                  'Menyimpan...'
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Simpan Perubahan
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