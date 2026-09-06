'use client'

import { useActionState, useState } from 'react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { createQuestion } from './actions'

type Module = {
  id: string
  title: string
}

type QuestionFormProps = {
  organizationSlug: string
  modules: Module[]
}

type FormState = {
  success: boolean
  error?: string
}

const initialState: FormState = {
  success: false,
}

const optionLabels = ['A', 'B', 'C', 'D']

export function QuestionForm({
  organizationSlug,
  modules,
}: QuestionFormProps) {
  const [questionType, setQuestionType] = useState(
    'multiple_choice',
  )

  const action = async (
    _previousState: FormState,
    formData: FormData,
  ): Promise<FormState> => {
    const result = await createQuestion(
      organizationSlug,
      formData,
    )

    return result ?? { success: true }
  }

  const [state, formAction, isPending] = useActionState(
    action,
    initialState,
  )

  return (
    <form action={formAction}>
      <Card>
        <CardContent className="space-y-6 p-6">

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
              defaultValue=""
              className="h-11 w-full rounded-xl border border-white/[0.10] bg-[#111111] px-3 text-sm text-white outline-none transition-colors focus:border-white/[0.20] disabled:opacity-50"
            >
              <option value="" disabled>
                Select a module
              </option>

              {modules.map((module) => (
                <option
                  key={module.id}
                  value={module.id}
                >
                  {module.title}
                </option>
              ))}
            </select>
          </div>

          {/* TITLE */}
          <div>
            <label
              htmlFor="title"
              className="mb-2 block text-sm font-medium text-white"
            >
              Question title
            </label>

            <input
              id="title"
              name="title"
              type="text"
              required
              disabled={isPending}
              placeholder="e.g. Solve a linear equation"
              className="h-11 w-full rounded-xl border border-white/[0.10] bg-white/[0.04] px-3 text-sm text-white outline-none placeholder:text-white/25 transition-colors focus:border-white/[0.20] focus:bg-white/[0.06] disabled:opacity-50"
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
              value={questionType}
              onChange={(event) => {
                setQuestionType(event.target.value)
              }}
              disabled={isPending}
              className="h-11 w-full rounded-xl border border-white/[0.10] bg-[#111111] px-3 text-sm text-white outline-none transition-colors focus:border-white/[0.20] disabled:opacity-50"
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
            <label
              htmlFor="content"
              className="mb-2 block text-sm font-medium text-white"
            >
              Question
            </label>

            <textarea
              id="content"
              name="content"
              required
              rows={7}
              disabled={isPending}
              placeholder="Write your mathematics question here..."
              className="w-full resize-none rounded-xl border border-white/[0.10] bg-white/[0.04] px-3 py-3 text-sm leading-6 text-white outline-none placeholder:text-white/25 transition-colors focus:border-white/[0.20] focus:bg-white/[0.06] disabled:opacity-50"
            />
          </div>

          {/* MULTIPLE CHOICE */}
          {questionType === 'multiple_choice' && (
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
              <div className="mb-5">
                <h3 className="text-sm font-semibold text-white">
                  Answer Options
                </h3>

                <p className="mt-1 text-xs text-white/35">
                  Enter four options and select the correct answer.
                </p>
              </div>

              <div className="space-y-4">
                {optionLabels.map((label, index) => (
                  <div
                    key={label}
                    className="flex items-center gap-3"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-sm font-medium text-white/60">
                      {label}
                    </div>

                    <input
                      type="text"
                      name={`option_${index}`}
                      required
                      disabled={isPending}
                      placeholder={`Option ${label}`}
                      className="h-11 min-w-0 flex-1 rounded-xl border border-white/[0.10] bg-white/[0.04] px-3 text-sm text-white outline-none placeholder:text-white/25 transition-colors focus:border-white/[0.20] focus:bg-white/[0.06] disabled:opacity-50"
                    />

                    <label className="flex shrink-0 cursor-pointer items-center gap-2 text-xs text-white/45">
                      <input
                        type="radio"
                        name="correct_option"
                        value={index}
                        required
                        disabled={isPending}
                        className="h-4 w-4"
                      />

                      Correct
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TRUE / FALSE */}
          {questionType === 'true_false' && (
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
              <div className="mb-5">
                <h3 className="text-sm font-semibold text-white">
                  Correct Answer
                </h3>

                <p className="mt-1 text-xs text-white/35">
                  Select whether the statement is true or false.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.03] p-4 transition-colors hover:bg-white/[0.06]">
                  <input
                    type="radio"
                    name="true_false_answer"
                    value="true"
                    required
                    disabled={isPending}
                    className="h-4 w-4"
                  />

                  <span className="text-sm text-white/75">
                    True
                  </span>
                </label>

                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.03] p-4 transition-colors hover:bg-white/[0.06]">
                  <input
                    type="radio"
                    name="true_false_answer"
                    value="false"
                    required
                    disabled={isPending}
                    className="h-4 w-4"
                  />

                  <span className="text-sm text-white/75">
                    False
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* SHORT ANSWER */}
          {questionType === 'short_answer' && (
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
              <div className="mb-5">
                <h3 className="text-sm font-semibold text-white">
                  Expected Answer
                </h3>

                <p className="mt-1 text-xs text-white/35">
                  Enter the answer expected from the student.
                </p>
              </div>

              <input
                type="text"
                name="short_answer"
                required
                disabled={isPending}
                placeholder="e.g. x = 5"
                className="h-11 w-full rounded-xl border border-white/[0.10] bg-white/[0.04] px-3 text-sm text-white outline-none placeholder:text-white/25 transition-colors focus:border-white/[0.20] focus:bg-white/[0.06] disabled:opacity-50"
              />
            </div>
          )}

          {/* NUMERIC */}
          {questionType === 'numeric' && (
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
              <div className="mb-5">
                <h3 className="text-sm font-semibold text-white">
                  Correct Numeric Answer
                </h3>

                <p className="mt-1 text-xs text-white/35">
                  Enter the exact numeric answer.
                </p>
              </div>

              <input
                type="number"
                name="numeric_answer"
                required
                disabled={isPending}
                step="any"
                placeholder="e.g. 42"
                className="h-11 w-full rounded-xl border border-white/[0.10] bg-white/[0.04] px-3 text-sm text-white outline-none placeholder:text-white/25 transition-colors focus:border-white/[0.20] focus:bg-white/[0.06] disabled:opacity-50"
              />
            </div>
          )}

          {/* ESSAY */}
          {questionType === 'essay' && (
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] text-xs text-white/50">
                  i
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-white">
                    Manual Grading
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-white/35">
                    Essay questions do not require an automatic answer.
                    The teacher will review and grade the student's response
                    manually.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* EXPLANATION */}
          <div>
            <label
              htmlFor="explanation"
              className="mb-2 block text-sm font-medium text-white"
            >
              Explanation
              <span className="ml-2 text-xs font-normal text-white/30">
                Optional
              </span>
            </label>

            <textarea
              id="explanation"
              name="explanation"
              rows={5}
              disabled={isPending}
              placeholder="Explain the solution or reasoning..."
              className="w-full resize-none rounded-xl border border-white/[0.10] bg-white/[0.04] px-3 py-3 text-sm leading-6 text-white outline-none placeholder:text-white/25 transition-colors focus:border-white/[0.20] focus:bg-white/[0.06] disabled:opacity-50"
            />
          </div>

          {/* ERROR */}
          {state.error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/[0.08] px-4 py-3 text-sm text-red-300">
              {state.error}
            </div>
          )}

          {/* ACTIONS */}
          <div className="flex items-center justify-end gap-3 border-t border-white/[0.07] pt-5">
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
              {isPending
                ? 'Creating...'
                : 'Create Question'}
            </Button>
          </div>

        </CardContent>
      </Card>
    </form>
  )
}