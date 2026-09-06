import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft,
  MessageCircle,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
} from '@/components/ui/card'
import { PageHeader } from '@/components/ui/page-header'
import { getOrganizationContext } from '@/lib/organization/get-organization-context'

import { ChatRoom } from './chat-room'

type StudentChatPageProps = {
  params: Promise<{
    organization: string
    studentAccessId: string
  }>
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
  const {
    organization: organizationSlug,
    studentAccessId,
  } = await params

  const {
    supabase,
    organization,
    user,
  } = await getOrganizationContext(
    organizationSlug,
  )

  const [
    studentAccessResult,
    conversationResult,
  ] = await Promise.all([
    supabase
      .from('student_access')
      .select(`
        id,
        student_name,
        is_active,
        expires_at
      `)
      .eq('id', studentAccessId)
      .eq('organization_id', organization.id)
      .maybeSingle(),

    supabase
      .from('chat_conversations')
      .select(`
        id,
        organization_id,
        student_access_id,
        teacher_profile_id,
        created_at,
        updated_at
      `)
      .eq('organization_id', organization.id)
      .eq('student_access_id', studentAccessId)
      .eq('teacher_profile_id', user.id)
      .maybeSingle(),
  ])

  const {
    data: studentAccess,
    error: studentAccessError,
  } = studentAccessResult

  if (studentAccessError) {
    throw new Error(
      `Gagal mengambil student access: ${studentAccessError.message}`,
    )
  }

  if (!studentAccess) {
    notFound()
  }

  const {
    data: conversation,
    error: conversationError,
  } = conversationResult

  if (conversationError) {
    throw new Error(
      `Gagal mengambil conversation: ${conversationError.message}`,
    )
  }

  let messages: ChatMessage[] = []

  if (conversation) {
    const {
      data: messageData,
      error: messagesError,
    } = await supabase
      .from('chat_messages')
      .select(`
        id,
        conversation_id,
        sender_profile_id,
        sender_student_access_id,
        message,
        created_at
      `)
      .eq('conversation_id', conversation.id)
      .order('created_at', {
        ascending: true,
      })

    if (messagesError) {
      throw new Error(
        `Gagal mengambil messages: ${messagesError.message}`,
      )
    }

    messages = messageData ?? []
  }

  return (
    <div className="min-h-full">
      <div className="mx-auto w-full max-w-5xl px-4 py-7 sm:px-6 lg:px-8 lg:py-10">
        <PageHeader
          eyebrow="Classes / Student Access / Chat"
          title={
            studentAccess.student_name ||
            'Student Chat'
          }
          description="Percakapan langsung antara guru dan siswa."
          actions={
            <Badge
              variant={
                studentAccess.is_active
                  ? 'success'
                  : 'muted'
              }
              className={
                studentAccess.is_active
                  ? 'border-emerald-300/20 bg-emerald-400/10 text-emerald-200'
                  : ''
              }
            >
              {studentAccess.is_active
                ? 'Active'
                : 'Inactive'}
            </Badge>
          }
        />

        <div className="mt-6">
          <Link
            href={`/${organization.slug}/classes/student-access/${studentAccess.id}`}
            className="group inline-flex items-center gap-2 text-sm font-medium text-sky-300/70 transition-colors hover:text-sky-200"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
            Back to Student
          </Link>
        </div>

        <Card className="mt-8 overflow-hidden border-violet-200/50 bg-gradient-to-br from-violet-50/[0.08] via-white/[0.025] to-transparent shadow-[0_16px_50px_rgba(139,92,246,0.05)]">
          <CardContent className="p-0">
            <div className="border-b border-violet-200/10 bg-violet-400/[0.035] px-5 py-4 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-300/25 bg-violet-400/10">
                  <MessageCircle className="h-5 w-5 text-violet-300" />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">
                    {studentAccess.student_name ||
                      'Unnamed Student'}
                  </p>

                  <p className="mt-0.5 text-xs text-white/35">
                    Direct conversation
                  </p>
                </div>

                <div className="ml-auto hidden sm:block">
                  <Badge
                    variant="info"
                    className="border-sky-300/20 bg-sky-400/10 text-sky-200"
                  >
                    Live Chat
                  </Badge>
                </div>
              </div>
            </div>

            <ChatRoom
              organizationId={organization.id}
              studentAccessId={studentAccess.id}
              conversationId={
                conversation?.id ?? null
              }
              initialMessages={messages}
              currentTeacherProfileId={user.id}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}