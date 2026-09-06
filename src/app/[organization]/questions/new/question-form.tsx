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
      <Card className="overflow-hidden border-sky-200/10 bg-gradient-to-br from-sky-400/[0.035] via-white/[0.02] to-transparent shadow-[0_16px_50px_rgba(56,189,248,0.04)]">
        <CardContent className="space-y-7 p-5 sm:p-6 lg:p-7">
          {/* MODULE */}
          <div>
            <label
              htmlFor="module_id"
              className="mb-2 block text-sm font-medium text-white"
            >
              Module
            </label>

            <select
              id="module_id"
              name="module_id"
              required
              disabled={isPending}
              defaultValue={
                selectedModuleId
              }
              className="h-11 w-full rounded-xl border border-sky-200/[0.10] bg-[#111111] px-3 text-sm text-white outline-none transition-colors focus:border-sky-300/30 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option
                value=""
                disabled
              >
                Select a module
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
              <p className="mt-2 text-xs text-amber-300/70">
                Belum ada module. Buat
                module terlebih dahulu
                sebelum membuat question.
              </p>
            )}
          </div>

          {/* TITLE */}
          <div>
            <label
              htmlFor="title"
              className="mb-2 block text-sm font-medium text-white"
            >
              Question title
            </label>

            <Input
              id="title"
              name="title"
              type="text"
              required
              disabled={isPending}
              placeholder="e.g. Solve a linear equation"
              className="h-11 rounded-xl border-white/[0.10] bg-white/[0.04] text-white placeholder:text-white/25 focus:border-sky-300/30 focus:bg-white/[0.06]"
            />
          </div>

          {/* QUESTION TYPE */}
          <div>
            <label
              htmlFor="question_type"
              className="mb-2 block text-sm font-medium text-white"
            >
              Question type
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
              className="h-11 w-full rounded-xl border border-violet-200/[0.10] bg-[#111111] px-3 text-sm text-white outline-none transition-colors focus:border-violet-300/30 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="multiple_choice">
                Multiple Choice
              </option>

              <option value="true_false">
                True / False
              </option>

              <option value="short_answer">
                Short Answer
              </option>

              <option value="numeric">
                Numeric
              </option>

              <option value="essay">
                Essay
              </option>
            </select>
          </div>

          {/* QUESTION */}
          <div>
            <div className="mb-2 flex items-center gap-2">
              <label
                htmlFor="content"
                className="block text-sm font-medium text-white"
              >
                Question
              </label>

              <CircleHelp className="h-3.5 w-3.5 text-sky-300/40" />
            </div>

            <Textarea
              id="content"
              name="content"
              required
              rows={7}
              disabled={isPending}
              placeholder="Write your mathematics question here..."
              className="resize-none rounded-xl border-sky-200/[0.10] bg-white/[0.04] leading-6 text-white placeholder:text-white/25 focus:border-sky-300/30 focus:bg-white/[0.06]"
            />

            <p className="mt-2 text-xs text-white/25">
              Tulis pertanyaan dengan jelas
              agar mudah dipahami siswa.
            </p>
          </div>

          {/* MULTIPLE CHOICE */}
          {questionType ===
            'multiple_choice' && (
            <div className="rounded-2xl border border-violet-300/15 bg-gradient-to-br from-violet-400/[0.07] via-white/[0.02] to-transparent p-5">
              <div className="mb-5 flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-violet-300/20 bg-violet-400/10">
                  <ListChecks className="h-5 w-5 text-violet-300" />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-white">
                    Answer Options
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-white/35">
                    Enter four options and
                    select the correct answer.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {optionLabels.map(
                  (
                    label,
                    index,
                  ) => (
                    <div
                      key={label}
                      className="flex items-center gap-3"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-violet-300/20 bg-violet-400/10 text-sm font-semibold text-violet-200">
                        {label}
                      </div>

                      <Input
                        type="text"
                        name={`option_${index}`}
                        required
                        disabled={
                          isPending
                        }
                        placeholder={`Option ${label}`}
                        className="h-11 min-w-0 flex-1 rounded-xl border-white/[0.10] bg-white/[0.04] text-white placeholder:text-white/25 focus:border-violet-300/25 focus:bg-white/[0.06]"
                      />

                      <label className="flex shrink-0 cursor-pointer items-center gap-2 text-xs text-white/45">
                        <input
                          type="radio"
                          name="correct_option"
                          value={index}
                          required
                          disabled={
                            isPending
                          }
                          className="h-4 w-4 accent-violet-400"
                        />

                        <span className="hidden sm:inline">
                          Correct
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
            <div className="rounded-2xl border border-emerald-300/15 bg-gradient-to-br from-emerald-400/[0.07] via-white/[0.02] to-transparent p-5">
              <div className="mb-5 flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-300/20 bg-emerald-400/10">
                  <ToggleLeft className="h-5 w-5 text-emerald-300" />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-white">
                    Correct Answer
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-white/35">
                    Select whether the statement
                    is true or false.
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.03] p-4 transition-all duration-200 hover:border-emerald-300/20 hover:bg-emerald-400/[0.05]">
                  <input
                    type="radio"
                    name="true_false_answer"
                    value="true"
                    required
                    disabled={
                      isPending
                    }
                    className="h-4 w-4 accent-emerald-400"
                  />

                  <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-300/15 bg-emerald-400/10">
                    <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                  </span>

                  <span className="text-sm font-medium text-white/75">
                    True
                  </span>
                </label>

                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.03] p-4 transition-all duration-200 hover:border-rose-300/20 hover:bg-rose-400/[0.05]">
                  <input
                    type="radio"
                    name="true_false_answer"
                    value="false"
                    required
                    disabled={
                      isPending
                    }
                    className="h-4 w-4 accent-rose-400"
                  />

                  <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-rose-300/15 bg-rose-400/10">
                    <span className="text-sm font-semibold text-rose-300">
                      ×
                    </span>
                  </span>

                  <span className="text-sm font-medium text-white/75">
                    False
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* SHORT ANSWER */}
          {questionType ===
            'short_answer' && (
            <div className="rounded-2xl border border-sky-300/15 bg-gradient-to-br from-sky-400/[0.07] via-white/[0.02] to-transparent p-5">
              <div className="mb-5 flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-sky-300/20 bg-sky-400/10">
                  <PenLine className="h-5 w-5 text-sky-300" />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-white">
                    Expected Answer
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-white/35">
                    Enter the answer expected
                    from the student.
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
                placeholder="e.g. x = 5"
                className="h-11 rounded-xl border-sky-200/[0.10] bg-white/[0.04] text-white placeholder:text-white/25 focus:border-sky-300/30 focus:bg-white/[0.06]"
              />
            </div>
          )}

          {/* NUMERIC */}
          {questionType ===
            'numeric' && (
            <div className="rounded-2xl border border-amber-300/15 bg-gradient-to-br from-amber-400/[0.07] via-white/[0.02] to-transparent p-5">
              <div className="mb-5 flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-amber-300/20 bg-amber-400/10">
                  <Hash className="h-5 w-5 text-amber-300" />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-white">
                    Correct Numeric Answer
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-white/35">
                    Enter the exact numeric
                    answer.
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
                placeholder="e.g. 42"
                className="h-11 rounded-xl border-amber-200/[0.10] bg-white/[0.04] text-white placeholder:text-white/25 focus:border-amber-300/30 focus:bg-white/[0.06]"
              />
            </div>
          )}

          {/* ESSAY */}
          {questionType ===
            'essay' && (
            <div className="rounded-2xl border border-rose-300/15 bg-gradient-to-br from-rose-400/[0.07] via-white/[0.02] to-transparent p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-rose-300/20 bg-rose-400/10">
                  <FileText className="h-5 w-5 text-rose-300" />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-white">
                    Manual Grading
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-white/35">
                    Essay questions do not require
                    an automatic answer. The teacher
                    will review and grade the student's
                    response manually.
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
                className="block text-sm font-medium text-white"
              >
                Explanation
              </label>

              <span className="text-xs font-normal text-white/30">
                Optional
              </span>
            </div>

            <Textarea
              id="explanation"
              name="explanation"
              rows={5}
              disabled={
                isPending
              }
              placeholder="Explain the solution or reasoning..."
              className="resize-none rounded-xl border-emerald-200/[0.10] bg-white/[0.04] leading-6 text-white placeholder:text-white/25 focus:border-emerald-300/25 focus:bg-white/[0.06]"
            />

            <p className="mt-2 text-xs text-white/25">
              Explanation dapat digunakan untuk
              membantu siswa memahami langkah
              penyelesaian.
            </p>
          </div>

          {/* ERROR */}
          {state.error && (
            <div className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/[0.08] px-4 py-3">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-red-300" />

              <p className="text-sm leading-5 text-red-300">
                {state.error}
              </p>
            </div>
          )}

          {/* ACTIONS */}
          <div className="flex flex-col-reverse gap-3 border-t border-white/[0.07] pt-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-xs text-white/25">
              <Sparkles className="h-3.5 w-3.5 text-sky-300/50" />

              <span>
                Question akan tersimpan di
                Question Bank.
              </span>
            </div>

            <div className="flex items-center justify-end gap-3">
              <Link
                href={`/${organizationSlug}/questions`}
                className="inline-flex h-10 items-center justify-center rounded-xl px-4 text-sm font-medium text-white/60 transition-colors hover:bg-white/[0.06] hover:text-white"
              >
                Cancel
              </Link>

              <Button
                type="submit"
                disabled={
                  isPending ||
                  modules.length === 0
                }
              >
                {isPending ? (
                  'Creating...'
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Create Question
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