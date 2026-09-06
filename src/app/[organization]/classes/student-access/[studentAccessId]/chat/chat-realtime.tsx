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
  conversationId: string
  onMessage: (message: ChatMessage) => void
}

export function ChatRealtime({
  conversationId,
  onMessage,
}: ChatRealtimeProps) {
  useEffect(() => {
    if (!conversationId) return

    const supabase = createClient()

    const channel = supabase
      .channel(`chat:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          onMessage(payload.new as ChatMessage)
        },
      )
      .subscribe()

    return () => {
      void supabase.removeChannel(channel)
    }
  }, [conversationId, onMessage])

  return null
}