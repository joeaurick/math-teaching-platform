'use client'

import { useCallback, useState } from 'react'

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
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.04]">
              <span className="text-lg">
                💬
              </span>
            </div>

            <p className="mt-4 text-sm font-medium text-white/70">
              Conversation siap digunakan
            </p>

            <p className="mt-1 max-w-sm text-xs leading-5 text-white/30">
              Kirim pesan pertama kepada
              siswa.
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

      <div className="border-t border-white/[0.08] p-4 sm:p-5">
        <ChatComposer
          organizationId={organizationId}
          studentAccessId={studentAccessId}
          conversationId={conversationId}
        />
      </div>
    </>
  )
}