'use client'

import { useState } from 'react'
import {
  Check,
  Copy,
  Link2,
  Loader2,
  Plus,
  Trash2,
  Users,
} from 'lucide-react'
import { toast } from 'sonner'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
} from '@/components/ui/card'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'

import {
  deleteStudentAccess,
  generateStudentLink,
  toggleStudentAccess,
} from './actions'

type StudentAccess = {
  id: string
  token: string
  student_name: string | null
  is_active: boolean
  expires_at: string | null
}

type StudentAccessClientProps = {
  organizationId: string
  organizationSlug: string
  studentAccesses: StudentAccess[]
}

export function StudentAccessClient({
  organizationId,
  organizationSlug,
  studentAccesses,
}: StudentAccessClientProps) {
  const [studentName, setStudentName] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] =
    useState<StudentAccess | null>(null)

  async function handleGenerate() {
    if (!studentName.trim()) {
      toast.error('Nama siswa wajib diisi.')
      return
    }

    setIsGenerating(true)

    try {
      const result = await generateStudentLink(
        organizationId,
        studentName.trim(),
      )

      if (!result.success) {
        toast.error(
          result.error ?? 'Gagal membuat student link.',
        )
        return
      }

      if (!result.token) {
        toast.error(
          'Student link tidak berhasil dibuat.',
        )
        return
      }

      const studentUrl =
        `${window.location.origin}/student/${result.token}`

      await navigator.clipboard.writeText(studentUrl)

      setStudentName('')

      toast.success(
        'Student link berhasil dibuat dan disalin.',
        {
          description: studentUrl,
        },
      )

      window.location.reload()
    } catch (error) {
      console.error(
        'Generate student link error:',
        error,
      )

      toast.error(
        'Gagal membuat atau menyalin student link.',
      )
    } finally {
      setIsGenerating(false)
    }
  }

  async function handleCopy(
    access: StudentAccess,
  ) {
    const studentUrl =
      `${window.location.origin}/student/${access.token}`

    try {
      if (!navigator.clipboard) {
        throw new Error(
          'Clipboard API tidak tersedia.',
        )
      }

      await navigator.clipboard.writeText(studentUrl)

      setCopiedId(access.id)

      toast.success(
        'Link berhasil disalin.',
        {
          description: studentUrl,
        },
      )

      window.setTimeout(() => {
        setCopiedId((current) =>
          current === access.id
            ? null
            : current,
        )
      }, 2000)
    } catch (error) {
      console.error(
        'Copy student link error:',
        error,
      )

      toast.error(
        'Link gagal disalin.',
        {
          description:
            'Silakan salin link secara manual.',
        },
      )
    }
  }

  async function handleToggleStatus(
    access: StudentAccess,
  ) {
    if (updatingId || deletingId) {
      return
    }

    const nextStatus = !access.is_active

    setUpdatingId(access.id)

    try {
      const result =
        await toggleStudentAccess(
          organizationId,
          access.id,
          nextStatus,
        )

      if (!result.success) {
        toast.error(
          result.error ??
            'Gagal mengubah status student.',
        )
        return
      }

      toast.success(
        nextStatus
          ? 'Student berhasil diaktifkan.'
          : 'Student berhasil dinonaktifkan.',
      )

      window.location.reload()
    } catch (error) {
      console.error(
        'Toggle student status error:',
        error,
      )

      toast.error(
        'Gagal mengubah status student.',
      )
    } finally {
      setUpdatingId(null)
    }
  }

  async function handleDelete(
    access: StudentAccess,
  ) {
    if (access.is_active) {
      toast.error(
        'Student aktif tidak dapat dihapus.',
      )
      return
    }

    if (deletingId || updatingId) {
      return
    }

    setDeletingId(access.id)

    try {
      const result =
        await deleteStudentAccess(
          organizationId,
          access.id,
        )

      if (!result.success) {
        toast.error(
          result.error ??
            'Gagal menghapus student access.',
        )
        return
      }

      toast.success(
        'Student access berhasil dihapus.',
      )

      setDeleteTarget(null)

      window.location.reload()
    } catch (error) {
      console.error(
        'Delete student access error:',
        error,
      )

      toast.error(
        'Gagal menghapus student access.',
      )
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* ====================================================== */}
      {/* Generate Student Link                                  */}
      {/* ====================================================== */}

      <Card className="overflow-hidden border-sky-200 bg-gradient-to-br from-sky-50 via-white to-white shadow-sm shadow-sky-100/60">
        <CardContent className="!p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-sky-200 bg-sky-50">
              <Link2 className="h-5 w-5 text-sky-600" />
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base font-semibold text-slate-900">
                  Generate Student Link
                </h2>

                <Badge
                  variant="info"
                  className="border-sky-200 bg-sky-50 text-sky-700"
                >
                  Secure Access
                </Badge>
              </div>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                Buat link khusus untuk siswa agar dapat
                mengakses workspace mereka tanpa login.
              </p>
            </div>
          </div>

          <div className="mt-6">
            <label
              htmlFor="student-name"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Student name
            </label>

            <Input
              id="student-name"
              type="text"
              value={studentName}
              onChange={(event) =>
                setStudentName(event.target.value)
              }
              onKeyDown={(event) => {
                if (
                  event.key === 'Enter' &&
                  !isGenerating
                ) {
                  event.preventDefault()
                  void handleGenerate()
                }
              }}
              placeholder="e.g. Ahmad"
              disabled={isGenerating}
            />
          </div>

          <div className="mt-4">
            <Button
              onClick={() =>
                void handleGenerate()
              }
              disabled={
                isGenerating ||
                !studentName.trim()
              }
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Membuat Link...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Generate Student Link
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ====================================================== */}
      {/* Student Access List                                    */}
      {/* ====================================================== */}

      <div className="space-y-3">
        {studentAccesses.length === 0 ? (
          <Card className="border-amber-200 bg-gradient-to-br from-amber-50 via-white to-white shadow-sm shadow-amber-100/50">
            <CardContent className="flex flex-col items-center justify-center !p-10 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-200 bg-amber-50">
                <Users className="h-5 w-5 text-amber-600" />
              </div>

              <h3 className="mt-4 text-sm font-semibold text-slate-900">
                Belum ada student access
              </h3>

              <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                Buat student link di atas untuk memberikan
                akses ke learning environment siswa.
              </p>
            </CardContent>
          </Card>
        ) : (
          studentAccesses.map((access) => {
            const isCopied =
              copiedId === access.id

            const isUpdating =
              updatingId === access.id

            const isDeleting =
              deletingId === access.id

            return (
              <Card
                key={access.id}
                className={
                  access.is_active
                    ? 'overflow-hidden border-slate-200 bg-white shadow-sm shadow-slate-200/50 transition-all duration-200 hover:border-violet-200 hover:shadow-md hover:shadow-violet-100/40'
                    : 'overflow-hidden border-slate-200 bg-slate-50/70 shadow-sm shadow-slate-200/40 transition-all duration-200 hover:border-slate-300'
                }
              >
                <CardContent className="!p-6">
                  <div className="flex flex-col gap-5">
                    {/* Student information */}

                    <div className="flex min-w-0 items-start gap-4">
                      <div
                        className={
                          access.is_active
                            ? 'flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-50 text-violet-600'
                            : 'flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-500'
                        }
                      >
                        <Users className="h-4 w-4" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-semibold text-slate-900">
                            {access.student_name ||
                              'Unnamed Student'}
                          </h3>

                          <Badge
                            variant={
                              access.is_active
                                ? 'success'
                                : 'muted'
                            }
                            className="capitalize"
                          >
                            {access.is_active
                              ? 'Active'
                              : 'Inactive'}
                          </Badge>
                        </div>

                        <p className="mt-3 break-all rounded-xl border border-slate-200 bg-white px-3 py-2 font-mono text-xs text-slate-500">
                          {access.token}
                        </p>

                        {access.expires_at && (
                          <p className="mt-2 text-xs text-slate-500">
                            Expires:{' '}
                            {new Intl.DateTimeFormat(
                              'id-ID',
                              {
                                dateStyle: 'medium',
                                timeStyle: 'short',
                              },
                            ).format(
                              new Date(
                                access.expires_at,
                              ),
                            )}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Actions */}

                    <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
                      <Button
                        variant={
                          access.is_active
                            ? 'secondary'
                            : 'outline'
                        }
                        size="sm"
                        disabled={
                          isUpdating ||
                          isDeleting
                        }
                        onClick={() =>
                          void handleToggleStatus(
                            access,
                          )
                        }
                        className={
                          access.is_active
                            ? 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:border-emerald-300 hover:bg-emerald-100'
                            : 'border-slate-200 bg-white text-slate-600 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700'
                        }
                      >
                        {isUpdating ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : access.is_active ? (
                          <>
                            <Check className="h-4 w-4" />
                            Active
                          </>
                        ) : (
                          'Inactive'
                        )}
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        disabled={
                          isUpdating ||
                          isDeleting
                        }
                        onClick={() => {
                          window.location.href =
                            `/${organizationSlug}/classes/student-access/${access.id}`
                        }}
                      >
                        Manage Modules
                      </Button>

                      <Button
                        variant={
                          isCopied
                            ? 'secondary'
                            : 'outline'
                        }
                        size="sm"
                        disabled={
                          isUpdating ||
                          isDeleting
                        }
                        onClick={() =>
                          void handleCopy(
                            access,
                          )
                        }
                      >
                        {isCopied ? (
                          <>
                            <Check className="h-4 w-4" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4" />
                            Copy Link
                          </>
                        )}
                      </Button>

                      {!access.is_active && (
                        <AlertDialog
                          open={
                            deleteTarget?.id ===
                            access.id
                          }
                          onOpenChange={(open) => {
                            if (!open) {
                              setDeleteTarget(null)
                            }
                          }}
                        >
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="danger"
                              size="sm"
                              disabled={
                                isDeleting ||
                                isUpdating
                              }
                              onClick={() =>
                                setDeleteTarget(access)
                              }
                            >
                              {isDeleting ? (
                                <>
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                  Deleting...
                                </>
                              ) : (
                                <>
                                  <Trash2 className="h-4 w-4" />
                                  Delete
                                </>
                              )}
                            </Button>
                          </AlertDialogTrigger>

                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Hapus Student Access?
                              </AlertDialogTitle>

                              <AlertDialogDescription>
                                Student{' '}
                                <span className="font-medium text-white/80">
                                  "
                                  {access.student_name ||
                                    'Unnamed Student'}
                                  "
                                </span>{' '}
                                akan dihapus secara permanen.
                                Student access yang sudah
                                dihapus tidak dapat
                                dikembalikan.
                              </AlertDialogDescription>
                            </AlertDialogHeader>

                            <AlertDialogFooter>
  <AlertDialogCancel
    disabled={isDeleting}
    className="inline-flex h-9 items-center justify-center rounded-md border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
  >
    Batal
  </AlertDialogCancel>

  <AlertDialogAction
    disabled={isDeleting}
    onClick={(event) => {
      event.preventDefault()
      void handleDelete(access)
    }}
    className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-red-600 px-4 text-sm font-medium text-white shadow-sm transition-colors hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
  >
    {isDeleting ? (
      <>
        <Loader2 className="h-4 w-4 animate-spin" />
        Menghapus...
      </>
    ) : (
      <>
        <Trash2 className="h-4 w-4" />
        Hapus Permanen
      </>
    )}
  </AlertDialogAction>
</AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}