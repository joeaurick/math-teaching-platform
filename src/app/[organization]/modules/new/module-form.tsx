'use client'

import { useActionState } from 'react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
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

  const [state, formAction, isPending] = useActionState(
    action,
    initialState,
  )

  return (
    <form action={formAction}>
      <Card>
        <CardContent className="space-y-6 p-6">
          <div>
            <label
              htmlFor="title"
              className="mb-2 block text-sm font-medium text-white"
            >
              Module title
            </label>

            <input
              id="title"
              name="title"
              type="text"
              placeholder="e.g. Algebra Basics"
              required
              disabled={isPending}
              className="h-11 w-full rounded-xl border border-white/[0.10] bg-white/[0.04] px-3 text-sm text-white outline-none placeholder:text-white/25 transition-colors focus:border-white/[0.20] focus:bg-white/[0.06] disabled:opacity-50"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-medium text-white"
            >
              Description
            </label>

            <textarea
              id="description"
              name="description"
              rows={5}
              placeholder="Describe what students will learn in this module..."
              disabled={isPending}
              className="w-full resize-none rounded-xl border border-white/[0.10] bg-white/[0.04] px-3 py-3 text-sm leading-6 text-white outline-none placeholder:text-white/25 transition-colors focus:border-white/[0.20] focus:bg-white/[0.06] disabled:opacity-50"
            />
          </div>

          {state.error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/[0.08] px-4 py-3 text-sm text-red-300">
              {state.error}
            </div>
          )}

          <div className="flex items-center justify-end gap-3 border-t border-white/[0.07] pt-5">
            <Link
              href={`/${organizationSlug}/modules`}
              className="inline-flex h-10 items-center justify-center rounded-xl px-4 text-sm font-medium text-white/60 transition-colors hover:bg-white/[0.06] hover:text-white"
            >
              Cancel
            </Link>

            <Button
              type="submit"
              disabled={isPending}
            >
              {isPending ? 'Creating...' : 'Create Module'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}