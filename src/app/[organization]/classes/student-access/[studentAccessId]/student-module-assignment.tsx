'use client'

import { useTransition } from 'react'
import {
  Check,
  Plus,
  BookOpen,
  Loader2,
} from 'lucide-react'
import { toast } from 'sonner'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
} from '@/components/ui/card'

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
  const [isPending, startTransition] =
    useTransition()

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
        const isAssigned =
          assignedModuleIds.includes(module.id)

        return (
          <Card
            key={module.id}
            className={
              isAssigned
                ? 'overflow-hidden border-emerald-200 bg-gradient-to-r from-emerald-50 via-white to-white shadow-sm shadow-emerald-100/60 transition-all duration-200 hover:border-emerald-300'
                : 'overflow-hidden border-slate-200 bg-white shadow-sm shadow-slate-200/50 transition-all duration-200 hover:border-sky-200 hover:shadow-md hover:shadow-sky-100/40'
            }
          >
            <CardContent className="!p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-start gap-4">
                  <div
                    className={
                      isAssigned
                        ? 'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50'
                        : 'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-sky-200 bg-sky-50'
                    }
                  >
                    {isAssigned ? (
                      <Check className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <BookOpen className="h-4 w-4 text-sky-600" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-semibold text-slate-900">
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

                      {isAssigned && (
                        <Badge
                          variant="success"
                          className="border-emerald-200 bg-emerald-50 text-emerald-700"
                        >
                          Assigned
                        </Badge>
                      )}
                    </div>

                    {module.description && (
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                        {module.description}
                      </p>
                    )}
                  </div>
                </div>

                <Button
                  variant={
                    isAssigned
                      ? 'secondary'
                      : 'outline'
                  }
                  size="sm"
                  disabled={isPending}
                  onClick={() =>
                    handleToggle(
                      module.id,
                      !isAssigned,
                    )
                  }
                  className={
                    isAssigned
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:border-emerald-300 hover:bg-emerald-100'
                      : 'border-sky-200 bg-white text-sky-700 hover:border-sky-300 hover:bg-sky-50'
                  }
                >
                  {isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : isAssigned ? (
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
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}