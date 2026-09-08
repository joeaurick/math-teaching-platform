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
  const [message, setMessage] = useState('')

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
        className="flex items-end gap-2 sm:gap-3"
      >
        <textarea
          value={message}
          onChange={(event) =>
            setMessage(event.target.value)
          }
          onKeyDown={handleKeyDown}
          placeholder="Tulis pesan kepada guru..."
          rows={2}
          maxLength={5000}
          disabled={
            isPending ||
            !conversationId
          }
          className="min-h-[54px] flex-1 resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-100 disabled:cursor-not-allowed disabled:opacity-60"
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
          className="h-[54px] w-[54px] shrink-0 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-sm shadow-violet-200 transition-all hover:from-violet-700 hover:to-indigo-700 hover:shadow-md disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>

      <div className="flex items-center justify-between px-1">
        <p className="text-[10px] text-slate-400">
          Ctrl + Enter untuk mengirim
        </p>

        <p className="text-[10px] text-slate-400">
          {message.length}/5000
        </p>
      </div>
    </div>
  )
}