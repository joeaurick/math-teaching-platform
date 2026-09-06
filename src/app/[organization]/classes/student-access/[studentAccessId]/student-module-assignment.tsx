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
                ? 'overflow-hidden border-emerald-300/25 bg-gradient-to-r from-emerald-400/[0.07] via-white/[0.025] to-transparent transition-all duration-200'
                : 'overflow-hidden border-white/[0.08] bg-white/[0.025] transition-all duration-200 hover:border-sky-300/25 hover:bg-white/[0.035]'
            }
          >
            <CardContent className="p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-start gap-4">
                  <div
                    className={
                      isAssigned
                        ? 'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-300/25 bg-emerald-400/10'
                        : 'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-sky-300/20 bg-sky-400/10'
                    }
                  >
                    {isAssigned ? (
                      <Check className="h-4 w-4 text-emerald-300" />
                    ) : (
                      <BookOpen className="h-4 w-4 text-sky-300" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-semibold text-white">
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
                          className="border-emerald-300/20 bg-emerald-400/10 text-emerald-200"
                        >
                          Assigned
                        </Badge>
                      )}
                    </div>

                    {module.description && (
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/40">
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
                      ? 'border-emerald-300/20 bg-emerald-400/10 text-emerald-100 hover:border-emerald-300/30 hover:bg-emerald-400/15'
                      : 'border-sky-300/20 text-sky-100 hover:border-sky-300/30 hover:bg-sky-400/10'
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