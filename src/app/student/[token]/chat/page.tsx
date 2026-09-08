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
    (workspaceData?.[0] as
      | StudentWorkspace
      | undefined) ?? null

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

    messages =
      (messageData ?? []) as ChatMessage[]
  }

  const studentName =
    workspace.student_name?.trim() || 'Siswa'

  return (
    <div className="min-h-screen">
      <main className="mx-auto w-full max-w-5xl px-4 py-5 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        {/* Header */}

        <div className="mb-6 sm:mb-8">
          <Link
            href={`/student/${token}`}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-500 shadow-sm transition-colors hover:border-violet-200 hover:bg-violet-50 hover:text-violet-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Ruang Belajar
          </Link>

          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <p className="text-sm font-medium text-violet-600">
                {workspace.organization_name}
              </p>

              <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Chat dengan Guru
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
                Percakapan langsung dengan guru untuk membantu
                Anda dalam proses belajar.
              </p>
            </div>

            <Badge className="w-fit">
              {studentName}
            </Badge>
          </div>
        </div>

        {/* Chat */}

        <Card className="overflow-hidden border-slate-200 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.07)]">
          <CardContent className="p-0">
            <div className="border-b border-slate-200 bg-gradient-to-r from-violet-50 via-white to-indigo-50 px-4 py-4 sm:px-6 sm:py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-violet-200 bg-violet-100 text-violet-600">
                  <MessageCircle className="h-5 w-5" />
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-900">
                    Percakapan Pribadi
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Tanya sesuatu kepada guru Anda.
                  </p>
                </div>
              </div>
            </div>

            <ChatClient
              token={token}
              studentAccessId={
                workspace.access_id
              }
              conversationId={
                conversation?.conversation_id ??
                null
              }
              initialMessages={messages}
            />
          </CardContent>
        </Card>

        <div className="h-12" />
      </main>
    </div>
  )
}