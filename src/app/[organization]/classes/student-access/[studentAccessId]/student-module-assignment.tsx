'use client'

import { useTransition } from 'react'
import { Check, Plus } from 'lucide-react'
import { toast } from 'sonner'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { toggleStudentModule } from './actions'

type Module = {
  id: string
  title: string
  description: string | null
  status: string
}

type StudentModuleAssignmentProps = {
  organizationSlug: string
  organizationId: string
  studentAccessId: string
  modules: Module[]
  assignedModuleIds: string[]
}

export function StudentModuleAssignment({
  organizationSlug,
  organizationId,
  studentAccessId,
  modules,
  assignedModuleIds,
}: StudentModuleAssignmentProps) {
  const [isPending, startTransition] = useTransition()

  function handleToggle(
    moduleId: string,
    assign: boolean,
  ) {
    startTransition(async () => {
      const result = await toggleStudentModule(
        organizationSlug,
        organizationId,
        studentAccessId,
        moduleId,
        assign,
      )

      if (!result.success) {
        toast.error(result.error)
        return
      }

      toast.success(
        assign
          ? 'Module assigned.'
          : 'Module removed.',
      )
    })
  }

  return (
    <div className="space-y-3">
      {modules.map((module) => {
        const isAssigned = assignedModuleIds.includes(
          module.id,
        )

        return (
          <div
            key={module.id}
            className="flex flex-col gap-4 rounded-xl border border-white/[0.08] bg-white/[0.02] p-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-medium text-white">
                  {module.title}
                </h3>

                <Badge
                  variant={
                    module.status === 'published'
                      ? 'success'
                      : 'muted'
                  }
                  className="capitalize"
                >
                  {module.status}
                </Badge>
              </div>

              {module.description && (
                <p className="mt-2 text-sm leading-6 text-white/35">
                  {module.description}
                </p>
              )}
            </div>

            <Button
              variant={isAssigned ? 'secondary' : 'outline'}
              size="sm"
              disabled={isPending}
              onClick={() =>
                handleToggle(
                  module.id,
                  !isAssigned,
                )
              }
            >
              {isAssigned ? (
                <>
                  <Check className="h-4 w-4" />
                  Assigned
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Assign
                </>
              )}
            </Button>
          </div>
        )
      })}
    </div>
  )
}