'use client'

import {
  useCallback,
  useState,
} from 'react'

import { ChatMessages } from '@/components/chat/chat-messages'

import { ChatComposer } from './chat-composer'
import { ChatRealtime } from './chat-realtime'

type ChatMessage = {
  id: string
  conversation_id: string
  sender_profile_id: string | null
  sender_student_access_id: string | null
  message: string
  created_at: string
}

type ChatClientProps = {
  token: string
  studentAccessId: string
  conversationId: string | null
  initialMessages: ChatMessage[]
}

export function ChatClient({
  token,
  studentAccessId,
  conversationId,
  initialMessages,
}: ChatClientProps) {
  const [messages, setMessages] =
    useState<ChatMessage[]>(
      initialMessages,
    )

  const handleRealtimeMessage =
    useCallback(
      (message: ChatMessage) => {
        setMessages((current) => {
          if (
            current.some(
              (item) =>
                item.id === message.id,
            )
          ) {
            return current
          }

          return [...current, message]
        })
      },
      [],
    )

  const handleMessageSent =
    useCallback(() => {
      /*
       * Tidak menambahkan optimistic
       * message di sini.
       *
       * Message berasal dari database
       * melalui Realtime.
       */
    }, [])

  const handleMessageRemoved =
    useCallback(
      (_messageId: string) => {
        /*
         * Tidak ada optimistic message
         * yang perlu dihapus.
         */
      },
      [],
    )

  return (
    <>
      {conversationId && (
        <ChatRealtime
          token={token}
          conversationId={
            conversationId
          }
          onMessage={
            handleRealtimeMessage
          }
        />
      )}

      <div className="max-h-[520px] min-h-[420px] overflow-y-auto px-4 py-5 sm:px-6">
        <ChatMessages
          messages={messages}
          emptyMessage="Kirim pesan kepada guru untuk memulai percakapan."
        />
      </div>

      <div className="border-t border-white/[0.07] p-4 sm:p-5">
        <ChatComposer
          token={token}
          studentAccessId={
            studentAccessId
          }
          conversationId={
            conversationId
          }
          onMessageSent={
            handleMessageSent
          }
          onMessageRemoved={
            handleMessageRemoved
          }
        />
      </div>
    </>
  )
}