'use client'

import {
  useState,
  useTransition,
} from 'react'
import { Send } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'

type ChatMessage = {
  id: string
  conversation_id: string
  sender_profile_id: string | null
  sender_student_access_id: string | null
  message: string
  created_at: string
}

type ChatComposerProps = {
  token: string
  studentAccessId: string
  conversationId: string | null
  onMessageSent: () => void
  onMessageRemoved: (
    messageId: string,
  ) => void
}

export function ChatComposer({
  token,
  studentAccessId,
  conversationId,
  onMessageSent,
  onMessageRemoved,
}: ChatComposerProps) {
  const [message, setMessage] =
    useState('')

  const [isPending, startTransition] =
    useTransition()

  function handleSubmit() {
    const trimmedMessage =
      message.trim()

    if (
      !trimmedMessage ||
      isPending
    ) {
      return
    }

    if (!conversationId) {
      window.alert(
        'Belum ada percakapan dengan guru.',
      )
      return
    }

    startTransition(async () => {
      const supabase = createClient()

      const { error } =
        await supabase.rpc(
          'send_student_chat_message',
          {
            access_token: token,
            target_conversation_id:
              conversationId,
            message_text:
              trimmedMessage,
          },
        )

      if (error) {
        window.alert(
          `Gagal mengirim pesan: ${error.message}`,
        )
        return
      }

      /*
       * Pesan sudah berhasil masuk database.
       *
       * Widget kemudian mengambil ulang
       * messages dari database.
       *
       * Tidak ada optimistic message,
       * sehingga tidak mungkin double.
       */
      setMessage('')

      onMessageSent()
    })
  }

  function handleKeyDown(
    event: React.KeyboardEvent<HTMLTextAreaElement>,
  ) {
    if (
      event.key === 'Enter' &&
      (event.ctrlKey ||
        event.metaKey)
    ) {
      event.preventDefault()

      handleSubmit()
    }
  }

  return (
    <div className="space-y-2">
      <form
        onSubmit={(event) => {
          event.preventDefault()
          handleSubmit()
        }}
        className="flex items-end gap-3"
      >
        <textarea
          value={message}
          onChange={(event) =>
            setMessage(event.target.value)
          }
          onKeyDown={handleKeyDown}
          placeholder="Ketik pesan kepada guru..."
          rows={2}
          maxLength={5000}
          disabled={
            isPending ||
            !conversationId
          }
          className="min-h-[54px] flex-1 resize-none rounded-2xl border border-white/[0.09] bg-white/[0.035] px-4 py-3 text-sm leading-6 text-white outline-none transition-colors placeholder:text-white/25 focus:border-white/[0.18] focus:bg-white/[0.045] disabled:cursor-not-allowed disabled:opacity-50"
        />

        <Button
          type="submit"
          size="icon"
          disabled={
            isPending ||
            !conversationId ||
            message.trim().length === 0
          }
          aria-label="Kirim pesan"
          className="h-[54px] w-[54px] shrink-0 rounded-2xl"
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