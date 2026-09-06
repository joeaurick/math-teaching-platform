'use client'

import { useState } from 'react'
import { Check, Copy, Plus, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

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

      toast.success('Student link berhasil dibuat dan disalin.', {
        description: studentUrl,
      })

      window.location.reload()
    } catch (error) {
      console.error('Generate student link error:', error)

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
          current === access.id ? null : current,
        )
      }, 2000)
    } catch (error) {
      console.error('Copy student link error:', error)

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

      <Card>
        <CardContent className="p-6">
          <div>
            <h2 className="text-base font-semibold">
              Generate Student Link
            </h2>

            <p className="mt-1 text-sm text-white/40">
              Buat link khusus untuk siswa agar dapat mengakses
              workspace mereka tanpa login.
            </p>
          </div>

          <div className="mt-6">
            <label
              htmlFor="student-name"
              className="mb-2 block text-sm text-white/65"
            >
              Student name
            </label>

            <input
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
              className="h-11 w-full rounded-xl border border-white/[0.10] bg-white/[0.03] px-4 text-sm text-white outline-none placeholder:text-white/25 transition-colors focus:border-white/25 disabled:cursor-not-allowed disabled:opacity-50"
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
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-sm text-white/40">
                Belum ada student access.
              </p>
            </CardContent>
          </Card>
        ) : (
          studentAccesses.map((access) => {
            const isCopied =
              copiedId === access.id

            return (
              <Card key={access.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    {/* Student information */}

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-semibold">
                          {access.student_name ||
                            'Unnamed Student'}
                        </h3>

                        <Badge>
                          {access.is_active
                            ? 'Active'
                            : 'Inactive'}
                        </Badge>
                      </div>

                      <p className="mt-2 break-all font-mono text-xs text-white/30">
                        {access.token}
                      </p>

                      {access.expires_at && (
                        <p className="mt-2 text-xs text-white/30">
                          Expired:{' '}
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

                    <div className="flex shrink-0 items-center gap-2">
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