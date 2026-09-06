'use client'

import { useEffect } from 'react'

import { createClient } from '@/lib/supabase/client'

type ChatMessage = {
  id: string
  conversation_id: string
  sender_profile_id: string | null
  sender_student_access_id: string | null
  message: string
  created_at: string
}

type ChatRealtimeProps = {
  token: string
  conversationId: string
  onMessage: (
    message: ChatMessage,
  ) => void
}

export function ChatRealtime({
  token,
  conversationId,
  onMessage,
}: ChatRealtimeProps) {
  useEffect(() => {
    if (
      !token ||
      !conversationId
    ) {
      return
    }

    const supabase = createClient()

    const channel = supabase
      .channel(
        `student-chat:${token}`,
      )
      .on(
        'broadcast',
        {
          event: 'INSERT',
        },
        (payload) => {
          const message =
            payload.payload as ChatMessage

          if (!message) {
            return
          }

          if (
            message.conversation_id !==
            conversationId
          ) {
            return
          }

          /*
           * Semua pesan dari database
           * diterima.
           *
           * Tidak ada lagi filtering:
           * "kalau student jangan diterima".
           *
           * Dedup dilakukan di state widget
           * berdasarkan database message ID.
           */
          onMessage(message)
        },
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(
            '[STUDENT CHAT] Realtime connected',
          )
        }

        if (
          status === 'CHANNEL_ERROR'
        ) {
          console.error(
            '[STUDENT CHAT] Realtime channel error',
          )
        }

        if (
          status === 'TIMED_OUT'
        ) {
          console.error(
            '[STUDENT CHAT] Realtime timeout',
          )
        }
      })

    return () => {
      void supabase.removeChannel(
        channel,
      )
    }
  }, [
    token,
    conversationId,
    onMessage,
  ])

  return null
}