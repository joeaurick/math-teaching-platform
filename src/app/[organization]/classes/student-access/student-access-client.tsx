'use client'

import { useState } from 'react'
import {
  Check,
  Copy,
  Link2,
  Plus,
  Loader2,
  Users,
} from 'lucide-react'
import { toast } from 'sonner'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'

import { generateStudentLink } from './actions'

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
        toast.error('Student link tidak berhasil dibuat.')
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

      toast.success('Link berhasil disalin.', {
        description: studentUrl,
      })

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

      toast.error('Link gagal disalin.', {
        description:
          'Silakan salin link secara manual.',
      })
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
                  handleGenerate()
                }
              }}
              placeholder="e.g. Ahmad"
              disabled={isGenerating}
            />
          </div>

          <div className="mt-4">
            <Button
              onClick={handleGenerate}
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

            return (
              <Card
                key={access.id}
                className="overflow-hidden border-slate-200 bg-white shadow-sm shadow-slate-200/50 transition-all duration-200 hover:border-violet-200 hover:shadow-md hover:shadow-violet-100/40"
              >
                <CardContent className="!p-6">
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    {/* Student information */}

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-violet-200 bg-violet-50">
                          <Users className="h-4 w-4 text-violet-600" />
                        </div>

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

                      <p className="mt-3 break-all rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-xs text-slate-500">
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

                    {/* Actions */}

                    <div className="flex flex-col gap-2 sm:flex-row lg:shrink-0">
                      <Button
                        variant="outline"
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
                        onClick={() =>
                          handleCopy(access)
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