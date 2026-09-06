'use client'

import { useCallback, useState } from 'react'
import { MessageCircle } from 'lucide-react'

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

type ChatRoomProps = {
  organizationId: string
  studentAccessId: string
  conversationId: string | null
  initialMessages: ChatMessage[]
  currentTeacherProfileId: string
}

export function ChatRoom({
  organizationId,
  studentAccessId,
  conversationId,
  initialMessages,
  currentTeacherProfileId,
}: ChatRoomProps) {
  const [messages, setMessages] =
    useState<ChatMessage[]>(initialMessages)

  const handleMessage = useCallback(
    (message: ChatMessage) => {
      setMessages((current) => {
        if (
          current.some(
            (item) => item.id === message.id,
          )
        ) {
          return current
        }

        return [...current, message]
      })
    },
    [],
  )

  return (
    <>
      {conversationId && (
        <ChatRealtime
          conversationId={conversationId}
          onMessage={handleMessage}
        />
      )}

      <div className="min-h-[420px]">
        {messages.length === 0 ? (
          <div className="flex min-h-[320px] flex-col items-center justify-center px-5 text-center sm:px-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-300/20 bg-gradient-to-br from-violet-400/15 to-sky-400/10 shadow-[0_12px_30px_rgba(139,92,246,0.08)]">
              <MessageCircle className="h-6 w-6 text-violet-300" />
            </div>

            <p className="mt-4 text-sm font-semibold text-white/75">
              Conversation siap digunakan
            </p>

            <p className="mt-1 max-w-sm text-xs leading-5 text-white/35">
              Kirim pesan pertama kepada siswa
              untuk memulai percakapan.
            </p>
          </div>
        ) : (
          <div className="max-h-[520px] min-h-[420px] overflow-y-auto px-4 py-5 sm:px-6">
            <ChatMessages
              messages={messages}
              currentTeacherProfileId={
                currentTeacherProfileId
              }
              emptyMessage="Mulai percakapan dengan student."
            />
          </div>
        )}
      </div>

      <div className="border-t border-white/[0.08] bg-white/[0.015] p-4 sm:p-5">
        <ChatComposer
          organizationId={organizationId}
          studentAccessId={studentAccessId}
          conversationId={conversationId}
        />
      </div>
    </>
  )
}