'use client'

import {
  useState,
  useTransition,
} from 'react'
import { Send } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'

import {
  getOrCreateChatConversation,
  sendTeacherChatMessage,
} from '../chat-actions'

type ChatComposerProps = {
  organizationId: string
  studentAccessId: string
  conversationId: string | null
}

export function ChatComposer({
  organizationId,
  studentAccessId,
  conversationId,
}: ChatComposerProps) {
  const router = useRouter()

  const [message, setMessage] = useState('')
  const [isPending, startTransition] =
    useTransition()

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    const trimmedMessage = message.trim()

    if (!trimmedMessage || isPending) {
      return
    }

    startTransition(async () => {
      let currentConversationId: string

      if (conversationId) {
        currentConversationId =
          conversationId
      } else {
        const result =
          await getOrCreateChatConversation(
            organizationId,
            studentAccessId,
          )

        if (!result.success) {
          window.alert(
            result.error ??
              'Gagal membuat conversation.',
          )
          return
        }

        currentConversationId =
          result.conversationId
      }

      const result =
        await sendTeacherChatMessage(
          currentConversationId,
          trimmedMessage,
        )

      if (!result.success) {
        window.alert(
          result.error ??
            'Gagal mengirim pesan.',
        )
        return
      }

      setMessage('')

      /*
       * Jangan menambahkan pesan secara manual
       * ke ChatRoom di sini.
       *
       * Pesan akan masuk melalui Supabase Realtime
       * setelah berhasil tersimpan di database.
       */
      router.refresh()
    })
  }

  function handleKeyDown(
    event: React.KeyboardEvent<HTMLTextAreaElement>,
  ) {
    if (
      event.key === 'Enter' &&
      (event.ctrlKey || event.metaKey)
    ) {
      event.preventDefault()

      event.currentTarget.form?.requestSubmit()
    }
  }

  return (
    <div className="space-y-2">
      <form
        onSubmit={handleSubmit}
        className="flex items-end gap-3"
      >
        <textarea
          value={message}
          onChange={(event) =>
            setMessage(event.target.value)
          }
          onKeyDown={handleKeyDown}
          placeholder="Ketik pesan..."
          rows={2}
          maxLength={5000}
          disabled={isPending}
          className="min-h-[52px] flex-1 resize-none rounded-xl border border-white/[0.10] bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/25 focus:border-white/[0.20] disabled:cursor-not-allowed disabled:opacity-50"
        />

        <Button
          type="submit"
          size="icon"
          disabled={
            isPending ||
            message.trim().length === 0
          }
          aria-label="Kirim pesan"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>

      <div className="flex items-center justify-between px-1">
        <p className="text-[10px] text-white/20">
          Ctrl + Enter untuk mengirim
        </p>

        <p className="text-[10px] text-white/20">
          {message.length}/5000
        </p>
      </div>
    </div>
  )
}