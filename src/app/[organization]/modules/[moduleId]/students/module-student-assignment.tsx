'use client'

import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import {
  Check,
  Loader2,
  Plus,
  UserRound,
} from 'lucide-react'
import { toast } from 'sonner'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
} from '@/components/ui/card'

import { toggleModuleStudent } from './actions'

type Student = {
  id: string
  student_name: string | null
  is_active: boolean
  expires_at: string | null
}

type ModuleStudentAssignmentProps = {
  organizationSlug: string
  organizationId: string
  moduleId: string
  moduleStatus: string
  students: Student[]
  assignedStudentIds: string[]
}

export function ModuleStudentAssignment({
  organizationSlug,
  organizationId,
  moduleId,
  moduleStatus,
  students,
  assignedStudentIds,
}: ModuleStudentAssignmentProps) {
  const router = useRouter()

  const [isPending, startTransition] =
    useTransition()

  function handleToggle(
    studentAccessId: string,
    assign: boolean,
  ) {
    startTransition(async () => {
      const result =
        await toggleModuleStudent(
          organizationSlug,
          organizationId,
          moduleId,
          studentAccessId,
          assign,
        )

      if (!result.success) {
        toast.error(result.error)
        return
      }

      toast.success(
        assign
          ? 'Module diberikan ke siswa.'
          : 'Module dilepas dari siswa.',
      )

      router.refresh()
    })
  }

  return (
    <div className="space-y-3">
      {students.map((student) => {
        const isAssigned =
          assignedStudentIds.includes(
            student.id,
          )

        const studentName =
          student.student_name?.trim() ||
          'Siswa tanpa nama'

        return (
          <Card
            key={student.id}
            className={
              isAssigned
                ? 'overflow-hidden border-emerald-200 bg-gradient-to-r from-emerald-50 via-white to-white shadow-sm shadow-emerald-100/60'
                : 'overflow-hidden border-slate-200 bg-white shadow-sm transition-all hover:border-sky-200 hover:bg-sky-50/30 hover:shadow-md hover:shadow-sky-100/50'
            }
          >
            <CardContent className="!p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-center gap-4">
                  <div
                    className={
                      isAssigned
                        ? 'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50'
                        : 'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-sky-200 bg-sky-50'
                    }
                  >
                    {isAssigned ? (
                      <Check className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <UserRound className="h-4 w-4 text-sky-600" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-semibold text-slate-900">
                        {studentName}
                      </h3>

                      {isAssigned && (
                        <Badge
                          variant="success"
                        >
                          Diberikan
                        </Badge>
                      )}

                      {!student.is_active && (
                        <Badge variant="muted">
                          Tidak aktif
                        </Badge>
                      )}

                      {student.is_active &&
                        moduleStatus ===
                          'published' && (
                          <Badge variant="info">
                            Bisa mengakses
                          </Badge>
                        )}
                    </div>

                    <p className="mt-1 text-xs text-slate-400">
                      Student Access
                    </p>
                  </div>
                </div>

                <Button
                  type="button"
                  variant={
                    isAssigned
                      ? 'secondary'
                      : 'outline'
                  }
                  size="sm"
                  disabled={isPending}
                  onClick={() =>
                    handleToggle(
                      student.id,
                      !isAssigned,
                    )
                  }
                  className={
                    isAssigned
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:border-emerald-300 hover:bg-emerald-100'
                      : 'border-sky-200 text-sky-700 hover:border-sky-300 hover:bg-sky-50'
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
                      Diberikan
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      Berikan
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