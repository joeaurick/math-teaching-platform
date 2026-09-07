'use client'

import { useState } from 'react'
import { Loader2, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
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

import { deleteQuestion } from './actions'

type QuestionActionsProps = {
  organizationSlug: string
  questionId: string
  questionTitle: string
  isUsed: boolean
}

export function QuestionActions({
  organizationSlug,
  questionId,
  questionTitle,
  isUsed,
}: QuestionActionsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  async function handleDelete() {
    setIsLoading(true)

    try {
      const result = await deleteQuestion(
        organizationSlug,
        questionId,
      )

      if (!result.success) {
        toast.error(result.message)
        return
      }

      toast.success('Soal berhasil dihapus.')

      setIsOpen(false)

      window.location.reload()
    } catch (error) {
      console.error(error)

      toast.error('Gagal menghapus soal.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!isLoading) {
          setIsOpen(open)
        }
      }}
    >
      <AlertDialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(true)}
          disabled={isLoading}
          className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Hapus soal ini?
          </AlertDialogTitle>

          <AlertDialogDescription>
            Soal{' '}
            <strong className="font-medium text-slate-700">
              &quot;{questionTitle}&quot;
            </strong>{' '}
            akan dihapus dari daftar soal.

            {isUsed && (
              <>
                {' '}
                Soal ini sudah pernah digunakan, tetapi data
                worksheet dan submission siswa tetap aman.
              </>
            )}

            {' '}
            Soal tidak akan muncul lagi di menu dan pemilihan
            soal baru.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={isLoading}
            className="inline-flex h-9 items-center justify-center rounded-md border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          >
            Batal
          </AlertDialogCancel>

          <AlertDialogAction
            disabled={isLoading}
            onClick={(event) => {
              event.preventDefault()
              void handleDelete()
            }}
            className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-red-600 px-4 text-sm font-medium text-white shadow-sm transition-colors hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          >
            {isLoading && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}

            {isLoading ? 'Menghapus...' : 'Hapus'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}