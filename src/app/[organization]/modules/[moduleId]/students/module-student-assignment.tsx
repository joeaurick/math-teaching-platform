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
                ? 'overflow-hidden border-emerald-300/25 bg-gradient-to-r from-emerald-400/[0.07] via-white/[0.025] to-transparent'
                : 'overflow-hidden border-white/[0.08] bg-white/[0.025] transition-all hover:border-sky-300/20 hover:bg-white/[0.035]'
            }
          >
            <CardContent className="p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-center gap-4">
                  <div
                    className={
                      isAssigned
                        ? 'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-emerald-300/20 bg-emerald-400/10'
                        : 'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-sky-300/20 bg-sky-400/10'
                    }
                  >
                    {isAssigned ? (
                      <Check className="h-4 w-4 text-emerald-300" />
                    ) : (
                      <UserRound className="h-4 w-4 text-sky-300" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-semibold text-white">
                        {studentName}
                      </h3>

                      {isAssigned && (
                        <Badge
                          variant="success"
                          className="border-emerald-300/20 bg-emerald-400/10 text-emerald-200"
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

                    <p className="mt-1 text-xs text-white/30">
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