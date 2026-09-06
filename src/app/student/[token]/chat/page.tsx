import Link from 'next/link'
import {
  ArrowLeft,
  MessageCircle,
} from 'lucide-react'
import { notFound } from 'next/navigation'

import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
} from '@/components/ui/card'
import { createClient } from '@/lib/supabase/server'

import { ChatClient } from './chat-client'

type StudentChatPageProps = {
  params: Promise<{
    token: string
  }>
}

type StudentWorkspace = {
  access_id: string
  organization_id: string
  organization_name: string
  organization_slug: string
  student_name: string | null
}

type ChatConversation = {
  conversation_id: string
  organization_id: string
  student_access_id: string
  teacher_profile_id: string
  created_at: string
  updated_at: string
}

type ChatMessage = {
  id: string
  conversation_id: string
  sender_profile_id: string | null
  sender_student_access_id: string | null
  message: string
  created_at: string
}

export default async function StudentChatPage({
  params,
}: StudentChatPageProps) {
  const { token } = await params

  const supabase = await createClient()

  // ------------------------------------------------------------
  // Student workspace
  // ------------------------------------------------------------

  const {
    data: workspaceData,
    error: workspaceError,
  } = await supabase.rpc(
    'get_student_workspace_by_token',
    {
      access_token: token,
    },
  )

  if (workspaceError) {
    throw new Error(
      `Gagal memeriksa student access: ${workspaceError.message}`,
    )
  }

  const workspace =
    (workspaceData?.[0] as StudentWorkspace | undefined) ??
    null

  if (!workspace) {
    notFound()
  }

  // ------------------------------------------------------------
  // Conversation
  // ------------------------------------------------------------

  const {
    data: conversationData,
    error: conversationError,
  } = await supabase.rpc(
    'get_student_chat_conversation_by_token',
    {
      access_token: token,
    },
  )

  if (conversationError) {
    throw new Error(
      `Gagal mengambil conversation: ${conversationError.message}`,
    )
  }

  const conversation =
    (conversationData?.[0] as
      | ChatConversation
      | undefined) ?? null

  // ------------------------------------------------------------
  // Messages
  // ------------------------------------------------------------

  let messages: ChatMessage[] = []

  if (conversation) {
    const {
      data: messageData,
      error: messagesError,
    } = await supabase.rpc(
      'get_student_chat_messages_by_token',
      {
        access_token: token,
        target_conversation_id:
          conversation.conversation_id,
      },
    )

    if (messagesError) {
      throw new Error(
        `Gagal mengambil messages: ${messagesError.message}`,
      )
    }

    messages = (messageData ?? []) as ChatMessage[]
  }

  const studentName =
    workspace.student_name?.trim() || 'Student'

  return (
    <div className="min-h-screen bg-[#090909] text-white">
      <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        {/* Header */}

        <div className="flex flex-col gap-5">
          <Link
            href={`/student/${token}`}
            className="inline-flex w-fit items-center gap-2 text-sm text-white/40 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Workspace
          </Link>

          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-white/40">
                {workspace.organization_name}
              </p>

              <h1 className="mt-2 text-3xl font-semibold tracking-tight">
                Chat
              </h1>

              <p className="mt-2 text-sm text-white/45">
                Percakapan langsung dengan guru.
              </p>
            </div>

            <Badge>
              {studentName}
            </Badge>
          </div>
        </div>

        {/* Chat */}

        <Card className="mt-8 overflow-hidden">
          <CardContent className="p-0">
            <div className="border-b border-white/[0.08] px-5 py-4 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.06]">
                  <MessageCircle className="h-5 w-5 text-white/60" />
                </div>

                <div>
                  <p className="text-sm font-medium text-white">
                    Teacher Chat
                  </p>

                  <p className="mt-0.5 text-xs text-white/35">
                    Tanya sesuatu kepada guru Anda.
                  </p>
                </div>
              </div>
            </div>

            <ChatClient
  token={token}
  studentAccessId={workspace.access_id}
  conversationId={
    conversation?.conversation_id ?? null
  }
  initialMessages={messages}
/>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}