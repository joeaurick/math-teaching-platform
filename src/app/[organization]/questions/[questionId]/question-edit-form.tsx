'use client'

import { useActionState, useState } from 'react'
import Link from 'next/link'

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
      <Card>
        <CardContent className="space-y-6 p-6">
          <div>
            <label
              htmlFor="module_id"
              className="mb-2 block text-sm font-medium text-white"
            >
              Module
            </label>

            <Select
              name="module_id"
              defaultValue={initialData.moduleId}
              disabled={isPending}
              required
            >
              <SelectTrigger
                id="module_id"
                className="h-11 w-full rounded-xl border-white/[0.10] bg-white/[0.04] text-white focus:border-white/[0.20]"
              >
                <SelectValue placeholder="Select module" />
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
          </div>

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
              defaultValue={initialData.title}
              className="h-11 rounded-xl border-white/[0.10] bg-white/[0.04] text-white placeholder:text-white/25 focus:border-white/[0.20] focus:bg-white/[0.06]"
            />
          </div>

          <div>
            <label
              htmlFor="question_type"
              className="mb-2 block text-sm font-medium text-white"
            >
              Question type
            </label>

            <Select
              name="question_type"
              value={questionType}
              onValueChange={setQuestionType}
              disabled={isPending}
            >
              <SelectTrigger
                id="question_type"
                className="h-11 w-full rounded-xl border-white/[0.10] bg-white/[0.04] text-white focus:border-white/[0.20]"
              >
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="multiple_choice">
                  Multiple Choice
                </SelectItem>

                <SelectItem value="true_false">
                  True / False
                </SelectItem>

                <SelectItem value="short_answer">
                  Short Answer
                </SelectItem>

                <SelectItem value="numeric">
                  Numeric
                </SelectItem>

                <SelectItem value="essay">
                  Essay
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label
              htmlFor="content"
              className="mb-2 block text-sm font-medium text-white"
            >
              Question
            </label>

            <Textarea
              id="content"
              name="content"
              required
              rows={7}
              disabled={isPending}
              defaultValue={initialData.content}
              className="resize-none rounded-xl border-white/[0.10] bg-white/[0.04] leading-6 text-white placeholder:text-white/25 focus:border-white/[0.20] focus:bg-white/[0.06]"
            />
          </div>

          {questionType === 'multiple_choice' && (
            <div className="rounded-2xl border border-violet-300/10 bg-violet-400/[0.025] p-5">
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
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-violet-300/20 bg-violet-400/10 text-sm font-medium text-violet-200">
                      {label}
                    </div>

                    <Input
                      type="text"
                      name={`option_${index}`}
                      required
                      disabled={isPending}
                      defaultValue={getOptionValue(index)}
                      placeholder={`Option ${label}`}
                      className="h-11 min-w-0 flex-1 rounded-xl border-white/[0.10] bg-white/[0.04] text-white placeholder:text-white/25 focus:border-white/[0.20] focus:bg-white/[0.06]"
                    />

                    <label className="flex shrink-0 cursor-pointer items-center gap-2 text-xs text-white/45">
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
                        className="h-4 w-4"
                      />

                      Correct
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

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

            <Textarea
              id="explanation"
              name="explanation"
              rows={5}
              disabled={isPending}
              defaultValue={initialData.explanation}
              placeholder="Explain the solution or reasoning..."
              className="resize-none rounded-xl border-white/[0.10] bg-white/[0.04] leading-6 text-white placeholder:text-white/25 focus:border-white/[0.20] focus:bg-white/[0.06]"
            />
          </div>

          <div>
            <label
              htmlFor="status"
              className="mb-2 block text-sm font-medium text-white"
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
                className="h-11 w-full rounded-xl border-white/[0.10] bg-white/[0.04] text-white focus:border-white/[0.20]"
              >
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="draft">
                  Draft
                </SelectItem>

                <SelectItem value="published">
                  Published
                </SelectItem>

                <SelectItem value="archived">
                  Archived
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {state.error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/[0.08] px-4 py-3 text-sm text-red-300">
              {state.error}
            </div>
          )}

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
                ? 'Saving...'
                : 'Save Changes'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}