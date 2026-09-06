import Link from 'next/link'
import {
  ArrowLeft,
  MessageCircle,
} from 'lucide-react'
import { notFound, redirect } from 'next/navigation'

import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
} from '@/components/ui/card'
import { PageHeader } from '@/components/ui/page-header'
import { createClient } from '@/lib/supabase/server'

import { ChatRoom } from './chat-room'

type StudentChatPageProps = {
  params: Promise<{
    organization: string
    studentAccessId: string
  }>
}

export default async function StudentChatPage({
  params,
}: StudentChatPageProps) {
  const {
    organization: organizationSlug,
    studentAccessId,
  } = await params

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const {
    data: organization,
    error: organizationError,
  } = await supabase
    .from('organizations')
    .select('id, name, slug')
    .eq('slug', organizationSlug)
    .maybeSingle()

  if (organizationError) {
    throw new Error(
      `Gagal mengambil organization: ${organizationError.message}`,
    )
  }

  if (!organization) {
    notFound()
  }

  const {
    data: membership,
    error: membershipError,
  } = await supabase
    .from('organization_members')
    .select('id, role')
    .eq('organization_id', organization.id)
    .eq('user_id', user.id)
    .maybeSingle()

  if (membershipError) {
    throw new Error(
      `Gagal mengambil membership: ${membershipError.message}`,
    )
  }

  if (!membership) {
    notFound()
  }

  const {
    data: studentAccess,
    error: studentAccessError,
  } = await supabase
    .from('student_access')
    .select(`
      id,
      student_name,
      is_active,
      expires_at
    `)
    .eq('id', studentAccessId)
    .eq('organization_id', organization.id)
    .maybeSingle()

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
  } = await supabase
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
    .eq('student_access_id', studentAccess.id)
    .eq('teacher_profile_id', user.id)
    .maybeSingle()

  if (conversationError) {
    throw new Error(
      `Gagal mengambil conversation: ${conversationError.message}`,
    )
  }

  let messages: Array<{
    id: string
    conversation_id: string
    sender_profile_id: string | null
    sender_student_access_id: string | null
    message: string
    created_at: string
  }> = []

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
          className="inline-flex items-center gap-2 text-sm text-white/40 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Student
        </Link>
      </div>

      <Card className="mt-8 overflow-hidden">
        <CardContent className="p-0">
          <div className="border-b border-white/[0.08] px-5 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04]">
                <MessageCircle className="h-5 w-5 text-white/60" />
              </div>

              <div>
                <p className="text-sm font-medium text-white">
                  {studentAccess.student_name ||
                    'Unnamed Student'}
                </p>

                <p className="mt-0.5 text-xs text-white/35">
                  Direct conversation
                </p>
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
  )
}