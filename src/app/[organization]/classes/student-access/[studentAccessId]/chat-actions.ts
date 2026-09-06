'use server'

import { createClient } from '@/lib/supabase/server'

export async function getOrCreateChatConversation(
  organizationId: string,
  studentAccessId: string,
) {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return {
      success: false,
      error: 'Anda harus login.',
    }
  }

  const { data, error } = await supabase.rpc(
    'get_or_create_teacher_conversation',
    {
      target_organization_id: organizationId,
      target_student_access_id: studentAccessId,
    },
  )

  if (error) {
    return {
      success: false,
      error: error.message,
    }
  }

  const conversation = Array.isArray(data)
    ? data[0]
    : data

  if (!conversation?.conversation_id) {
    return {
      success: false,
      error: 'Conversation tidak berhasil dibuat.',
    }
  }

  return {
    success: true,
    conversationId: conversation.conversation_id,
  }
}


export async function sendTeacherChatMessage(
  conversationId: string,
  message: string,
) {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return {
      success: false,
      error: 'Anda harus login.',
    }
  }

  const trimmedMessage = message.trim()

  if (!trimmedMessage) {
    return {
      success: false,
      error: 'Pesan tidak boleh kosong.',
    }
  }

  if (trimmedMessage.length > 5000) {
    return {
      success: false,
      error: 'Pesan terlalu panjang.',
    }
  }

  const { error } = await supabase
    .from('chat_messages')
    .insert({
      conversation_id: conversationId,
      sender_profile_id: user.id,
      sender_student_access_id: null,
      message: trimmedMessage,
    })

  if (error) {
    return {
      success: false,
      error: error.message,
    }
  }

  await supabase
    .from('chat_conversations')
    .update({
      updated_at: new Date().toISOString(),
    })
    .eq('id', conversationId)

  return {
    success: true,
  }
}