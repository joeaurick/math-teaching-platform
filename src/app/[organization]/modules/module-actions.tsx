'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  useState,
  useTransition,
} from 'react'
import {
  Check,
  Loader2,
  Send,
  Trash2,
  Undo2,
} from 'lucide-react'
import { toast } from 'sonner'

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
import { Button } from '@/components/ui/button'

import {
  deleteModule,
  updateModuleStatus,
} from './actions'

type ModuleActionsProps = {
  organizationSlug: string
  moduleId: string
  moduleTitle: string
  status: string
}

export function ModuleActions({
  organizationSlug,
  moduleId,
  moduleTitle,
  status,
}: ModuleActionsProps) {
  const router = useRouter()

  const [isPending, startTransition] =
    useTransition()

  const [
    deleteDialogOpen,
    setDeleteDialogOpen,
  ] = useState(false)

  function handleStatusChange(
    nextStatus: 'published' | 'draft',
  ) {
    startTransition(async () => {
      const result =
        await updateModuleStatus(
          organizationSlug,
          moduleId,
          nextStatus,
        )

      if (!result.success) {
        toast.error(result.error)
        return
      }

      toast.success(
        nextStatus === 'published'
          ? 'Module berhasil dipublish.'
          : 'Module dikembalikan menjadi draft.',
      )

      router.refresh()
    })
  }

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteModule(
        organizationSlug,
        moduleId,
      )

      if (!result.success) {
        toast.error(result.error)
        return
      }

      setDeleteDialogOpen(false)

      toast.success(
        'Module berhasil dihapus.',
      )

      router.push(
        `/${organizationSlug}/modules`,
      )

      router.refresh()
    })
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {status === 'published' ? (
        <Button
          type="button"
          variant="secondary"
          size="sm"
          disabled={isPending}
          onClick={() =>
            handleStatusChange('draft')
          }
          className="border-amber-300/25 bg-amber-400/10 text-amber-100 hover:border-amber-300/35 hover:bg-amber-400/15"
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Undo2 className="h-4 w-4" />
          )}

          Unpublish
        </Button>
      ) : (
        <Button
          type="button"
          variant="primary"
          size="sm"
          disabled={isPending}
          onClick={() =>
            handleStatusChange('published')
          }
          className="border-emerald-300/30 bg-emerald-400 text-emerald-950 shadow-[0_4px_18px_rgba(52,211,153,0.12)] hover:bg-emerald-300"
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Check className="h-4 w-4" />
          )}

          Publish
        </Button>
      )}

      <Link
        href={`/${organizationSlug}/modules/${moduleId}/students`}
      >
        <Button
          type="button"
          variant="secondary"
          size="sm"
          disabled={isPending}
          className="border-sky-300/25 bg-sky-400/10 text-sky-100 hover:border-sky-300/35 hover:bg-sky-400/15"
        >
          <Send className="h-4 w-4" />
          Berikan ke Siswa
        </Button>
      </Link>

      <AlertDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      >
        <AlertDialogTrigger asChild>
          <Button
            type="button"
            variant="danger"
            size="sm"
            disabled={isPending}
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Hapus module?
            </AlertDialogTitle>

            <AlertDialogDescription>
              Module{' '}
              <span className="font-medium text-white/70">
                &quot;{moduleTitle}&quot;
              </span>{' '}
              akan dihapus dari workspace. Assignment
              siswa untuk module ini juga akan dilepas.
              Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button
                type="button"
                variant="outline"
                disabled={isPending}
              >
                Batal
              </Button>
            </AlertDialogCancel>

            <AlertDialogAction
              asChild
              onClick={(event) => {
                event.preventDefault()
                handleDelete()
              }}
            >
              <Button
                type="button"
                variant="danger"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Menghapus...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    Ya, Hapus
                  </>
                )}
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}