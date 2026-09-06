'use client'

import { useState, useTransition } from 'react'
import {
  Check,
  Loader2,
  Users,
} from 'lucide-react'
import { toast } from 'sonner'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

import {
  updateWorksheetStudentAssignments,
} from './actions'

type StudentAccess = {
  id: string
  student_name: string | null
  is_active: boolean
  expires_at: string | null
}

type WorksheetStudentAssignmentProps = {
  organizationSlug: string
  worksheetId: string
  studentAccesses: StudentAccess[]
  assignedStudentAccessIds: string[]
  worksheetStatus: string
}

export function WorksheetStudentAssignment({
  organizationSlug,
  worksheetId,
  studentAccesses,
  assignedStudentAccessIds,
  worksheetStatus,
}: WorksheetStudentAssignmentProps) {
  const [selectedIds, setSelectedIds] =
    useState<string[]>(
      assignedStudentAccessIds,
    )

  const [isPending, startTransition] =
    useTransition()

  function toggleStudent(
    studentAccessId: string,
  ) {
    setSelectedIds((current) =>
      current.includes(studentAccessId)
        ? current.filter(
            (id) => id !== studentAccessId,
          )
        : [...current, studentAccessId],
    )
  }

  function handleSave() {
    startTransition(async () => {
      const result =
        await updateWorksheetStudentAssignments({
          organizationSlug,
          worksheetId,
          studentAccessIds: selectedIds,
        })

      if (!result.success) {
        toast.error(result.error)
        return
      }

      toast.success(
        'Assignment student berhasil diperbarui.',
      )
    })
  }

  const activeStudents = studentAccesses.filter(
    (student) => student.is_active,
  )

  const selectedCount = selectedIds.length

  return (
    <Card className="overflow-hidden border-violet-200/10 bg-gradient-to-br from-violet-400/[0.035] via-white/[0.015] to-transparent">
      <CardContent className="p-5 sm:p-6">
        <div className="flex flex-col gap-5">
          {/* Header */}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-violet-300/20 bg-violet-400/10">
                <Users className="h-5 w-5 text-violet-300" />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-white">
                  Assign Students
                </h3>

                <p className="mt-1 text-sm leading-5 text-white/40">
                  Pilih student yang dapat mengakses
                  worksheet ini.
                </p>
              </div>
            </div>

            <Badge
              variant="info"
              className="w-fit border-sky-300/20 bg-sky-400/10 text-sky-200"
            >
              {selectedCount}{' '}
              {selectedCount === 1
                ? 'Student'
                : 'Students'}
            </Badge>
          </div>

          {/* Published requirement */}

          {worksheetStatus !== 'published' ? (
            <div className="rounded-xl border border-amber-300/15 bg-gradient-to-r from-amber-400/[0.08] to-transparent px-4 py-3">
              <p className="text-sm font-medium text-amber-200">
                Worksheet belum dipublish
              </p>

              <p className="mt-1 text-xs leading-5 text-amber-200/60">
                Publish worksheet terlebih dahulu
                sebelum memberikan akses kepada
                student.
              </p>
            </div>
          ) : activeStudents.length === 0 ? (
            <div className="rounded-2xl border border-sky-200/10 bg-sky-400/[0.025] px-4 py-10 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-sky-300/15 bg-sky-400/10">
                <Users className="h-5 w-5 text-sky-300/60" />
              </div>

              <p className="mt-4 text-sm font-medium text-white/75">
                Belum ada Student Access
              </p>

              <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-white/35">
                Buat Student Access terlebih dahulu
                melalui menu Classes.
              </p>
            </div>
          ) : (
            <>
              {/* Student list */}

              <div className="space-y-2">
                {activeStudents.map(
                  (student) => {
                    const isSelected =
                      selectedIds.includes(
                        student.id,
                      )

                    return (
                      <button
                        key={student.id}
                        type="button"
                        disabled={isPending}
                        onClick={() =>
                          toggleStudent(
                            student.id,
                          )
                        }
                        className={`group flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-all duration-200 ${
                          isSelected
                            ? 'border-emerald-300/20 bg-emerald-400/[0.07] shadow-[0_8px_25px_rgba(52,211,153,0.04)]'
                            : 'border-white/[0.08] bg-white/[0.02] hover:border-sky-300/15 hover:bg-sky-400/[0.035]'
                        } disabled:pointer-events-none disabled:opacity-50`}
                      >
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all duration-200 ${
                            isSelected
                              ? 'border border-emerald-300/20 bg-emerald-400/15 text-emerald-300'
                              : 'border border-sky-300/10 bg-sky-400/[0.05] text-sky-300/40 group-hover:bg-sky-400/[0.10] group-hover:text-sky-300/60'
                          }`}
                        >
                          {isSelected ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Users className="h-4 w-4" />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-white">
                            {student.student_name ||
                              'Student'}
                          </p>

                          <p className="mt-1 text-xs text-white/35">
                            Student Access
                          </p>
                        </div>

                        {isSelected && (
                          <Badge
                            variant="success"
                            className="shrink-0"
                          >
                            Assigned
                          </Badge>
                        )}
                      </button>
                    )
                  },
                )}
              </div>

              {/* Save */}

              <div className="flex flex-col gap-3 border-t border-white/[0.08] pt-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-white/30">
                  {selectedCount === 0
                    ? 'Belum ada student yang dipilih.'
                    : `${selectedCount} student akan mendapatkan worksheet ini.`}
                </p>

                <Button
                  disabled={isPending}
                  onClick={handleSave}
                >
                  {isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      Simpan Assignment
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}