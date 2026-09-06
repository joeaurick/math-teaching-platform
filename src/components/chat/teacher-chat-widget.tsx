'use client'

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  ArrowLeft,
  ArrowUpRight,
  MessageCircle,
  Minus,
  Send,
  X,
} from 'lucide-react'
import Link from 'next/link'

import { ChatMessages } from '@/components/chat/chat-messages'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'

type StudentAccessRelation = {
  student_name: string | null
}

type ChatConversation = {
  id: string
  organization_id: string
  student_access_id: string
  teacher_profile_id: string
  created_at: string
  updated_at: string
  student_access:
    | StudentAccessRelation[]
    | null
}

type ChatMessage = {
  id: string
  conversation_id: string
  sender_profile_id: string | null
  sender_student_access_id: string | null
  message: string
  created_at: string
}

type TeacherChatWidgetProps = {
  organizationId: string
  organizationSlug: string
  teacherProfileId: string
}

export function TeacherChatWidget({
  organizationId,
  organizationSlug,
  teacherProfileId,
}: TeacherChatWidgetProps) {
  const supabase = useMemo(
    () => createClient(),
    [],
  )

  const [
    conversations,
    setConversations,
  ] = useState<ChatConversation[]>([])

  const [
    messages,
    setMessages,
  ] = useState<ChatMessage[]>([])

  const [
    selectedConversationId,
    setSelectedConversationId,
  ] = useState<string | null>(null)

  const [open, setOpen] =
    useState(false)

  const [minimized, setMinimized] =
    useState(false)

  const [loaded, setLoaded] =
    useState(false)

  const [isSending, setIsSending] =
    useState(false)

  const [message, setMessage] =
    useState('')

  const [unreadCount, setUnreadCount] =
    useState(0)

  const loadConversations =
    useCallback(async () => {
      const {
        data,
        error,
      } = await supabase
        .from('chat_conversations')
        .select(`
          id,
          organization_id,
          student_access_id,
          teacher_profile_id,
          created_at,
          updated_at,
          student_access (
            student_name
          )
        `)
        .eq(
          'organization_id',
          organizationId,
        )
        .eq(
          'teacher_profile_id',
          teacherProfileId,
        )
        .order('updated_at', {
          ascending: false,
        })

      if (error) {
        console.error(
          '[TEACHER CHAT] conversations error:',
          error,
        )
        return
      }

      setConversations(
        (data ?? []) as ChatConversation[],
      )

      setLoaded(true)
    }, [
      organizationId,
      supabase,
      teacherProfileId,
    ])

  const loadMessages = useCallback(
    async (
      conversationId: string,
    ) => {
      const {
        data,
        error,
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
        .eq(
          'conversation_id',
          conversationId,
        )
        .order('created_at', {
          ascending: true,
        })

      if (error) {
        console.error(
          '[TEACHER CHAT] messages error:',
          error,
        )
        return
      }

      setMessages(
        (data ?? []) as ChatMessage[],
      )
    },
    [supabase],
  )

  useEffect(() => {
    void loadConversations()
  }, [loadConversations])

  useEffect(() => {
    const channel = supabase
      .channel(
        `teacher-chat:${organizationId}:${teacherProfileId}`,
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
        },
        (payload) => {
          const incoming =
            payload.new as ChatMessage

          if (
            !incoming ||
            !incoming.conversation_id
          ) {
            return
          }

          setConversations(
            (current) => {
              const existing =
                current.find(
                  (item) =>
                    item.id ===
                    incoming.conversation_id,
                )

              if (!existing) {
                void loadConversations()
                return current
              }

              const updatedConversation =
                {
                  ...existing,
                  updated_at:
                    incoming.created_at,
                }

              return [
                updatedConversation,
                ...current.filter(
                  (item) =>
                    item.id !==
                    incoming.conversation_id,
                ),
              ]
            },
          )

          if (
            selectedConversationId ===
            incoming.conversation_id
          ) {
            setMessages(
              (current) => {
                if (
                  current.some(
                    (item) =>
                      item.id ===
                      incoming.id,
                  )
                ) {
                  return current
                }

                return [
                  ...current,
                  incoming,
                ]
              },
            )
          }

          if (
            incoming.sender_student_access_id &&
            (!open || minimized)
          ) {
            setUnreadCount(
              (current) => current + 1,
            )
          }
        },
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(
            '[TEACHER CHAT] Realtime connected',
          )
        }

        if (
          status === 'CHANNEL_ERROR'
        ) {
          console.error(
            '[TEACHER CHAT] Realtime channel error',
          )
        }

        if (status === 'TIMED_OUT') {
          console.error(
            '[TEACHER CHAT] Realtime timeout',
          )
        }
      })

    return () => {
      void supabase.removeChannel(
        channel,
      )
    }
  }, [
    loadConversations,
    minimized,
    open,
    organizationId,
    selectedConversationId,
    supabase,
    teacherProfileId,
  ])

  async function openConversation(
    conversation: ChatConversation,
  ) {
    setSelectedConversationId(
      conversation.id,
    )

    setMessages([])

    await loadMessages(
      conversation.id,
    )

    setUnreadCount(0)
  }

  function backToInbox() {
    setSelectedConversationId(null)
    setMessages([])
    setMessage('')
  }

  async function sendMessage() {
    const trimmedMessage =
      message.trim()

    if (
      !trimmedMessage ||
      !selectedConversationId ||
      isSending
    ) {
      return
    }

    setIsSending(true)

    try {
      const {
        data,
        error,
      } = await supabase
        .from('chat_messages')
        .insert({
          conversation_id:
            selectedConversationId,
          sender_profile_id:
            teacherProfileId,
          sender_student_access_id:
            null,
          message:
            trimmedMessage,
        })
        .select(`
          id,
          conversation_id,
          sender_profile_id,
          sender_student_access_id,
          message,
          created_at
        `)
        .single()

      if (error) {
        console.error(
          '[TEACHER CHAT] send error:',
          error,
        )

        window.alert(
          `Gagal mengirim pesan: ${error.message}`,
        )

        return
      }

      if (data) {
        const insertedMessage =
          data as ChatMessage

        setMessages(
          (current) => {
            if (
              current.some(
                (item) =>
                  item.id ===
                  insertedMessage.id,
              )
            ) {
              return current
            }

            return [
              ...current,
              insertedMessage,
            ]
          },
        )

        setConversations(
          (current) => {
            const existing =
              current.find(
                (item) =>
                  item.id ===
                  selectedConversationId,
              )

            if (!existing) {
              return current
            }

            return [
              {
                ...existing,
                updated_at:
                  insertedMessage.created_at,
              },
              ...current.filter(
                (item) =>
                  item.id !==
                  selectedConversationId,
              ),
            ]
          },
        )
      }

      setMessage('')
    } finally {
      setIsSending(false)
    }
  }

  function handleKeyDown(
    event: React.KeyboardEvent<HTMLTextAreaElement>,
  ) {
    if (
      event.key === 'Enter' &&
      (event.ctrlKey ||
        event.metaKey)
    ) {
      event.preventDefault()

      void sendMessage()
    }
  }

  function handleOpen() {
    setOpen(true)
    setMinimized(false)
    setUnreadCount(0)

    void loadConversations()
  }

  function handleClose() {
    setOpen(false)
    setMinimized(false)
  }

  function handleMinimize() {
    setMinimized(true)
  }

  function handleRestore() {
    setMinimized(false)
    setOpen(true)
    setUnreadCount(0)

    void loadConversations()

    if (selectedConversationId) {
      void loadMessages(
        selectedConversationId,
      )
    }
  }

  const selectedConversation =
    conversations.find(
      (conversation) =>
        conversation.id ===
        selectedConversationId,
    ) ?? null

  if (!open) {
    return (
      <button
  type="button"
  onClick={handleOpen}
  className="fixed bottom-5 right-5 z-[100] flex h-14 w-14 items-center justify-center rounded-full bg-violet-600 text-white shadow-lg shadow-violet-200/60 transition-all duration-200 hover:-translate-y-0.5 hover:bg-violet-700 hover:shadow-xl hover:shadow-violet-200/70 active:scale-95"
  aria-label="Buka chat"
>
  <Send
    className="h-5 w-5 -rotate-12 text-white"
    strokeWidth={2.25}
  />

  {unreadCount > 0 && (
    <span className="absolute -right-0.5 -top-0.5 flex min-h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-rose-500 px-1 text-[10px] font-semibold text-white">
      {unreadCount > 9 ? '9+' : unreadCount}
    </span>
  )}
</button>
    )
  }

  if (minimized) {
    return (
      <div className="fixed bottom-5 right-5 z-50">
        <button
          type="button"
          onClick={handleRestore}
          className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3.5 py-3 text-left shadow-lg shadow-slate-200/60 transition-all hover:bg-slate-50"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600">
            <MessageCircle className="h-4 w-4" />
          </div>

          <div className="min-w-[120px]">
            <p className="text-xs font-semibold text-slate-800">
              Chat Student
            </p>

            <p className="mt-0.5 text-[10px] text-slate-400">
              Klik untuk membuka
            </p>
          </div>

          {unreadCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-semibold text-white">
              {unreadCount > 9
                ? '9+'
                : unreadCount}
            </span>
          )}
        </button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-[min(440px,calc(100vw-2rem))]">
      <div className="flex h-[min(680px,calc(100vh-32px))] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-300/40">
        {/* Header */}

        <div className="flex h-16 shrink-0 items-center border-b border-slate-200 bg-white px-4">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            {selectedConversationId ? (
              <button
                type="button"
                onClick={backToInbox}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
                aria-label="Kembali"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
            ) : (
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100">
                <MessageCircle className="h-4 w-4 text-slate-600" />
              </div>
            )}

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900">
                {selectedConversation
                  ? selectedConversation
                      .student_access?.[0]
                      ?.student_name ||
                    'Student'
                  : 'Chat Student'}
              </p>

              <div className="mt-0.5 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                <span className="text-[10px] text-slate-400">
                  Percakapan pribadi
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-0.5">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleMinimize}
              className="h-9 w-9 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-900"
              aria-label="Minimize"
              title="Minimize"
            >
              <Minus className="h-4 w-4" />
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="h-9 w-9 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-900"
              aria-label="Tutup"
              title="Tutup"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Inbox */}

        {!selectedConversationId ? (
          <>
            <div className="min-h-0 flex-1 overflow-y-auto bg-white">
              {conversations.length === 0 ? (
                <div className="flex min-h-[400px] flex-col items-center justify-center px-6 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                    <MessageCircle className="h-5 w-5 text-slate-400" />
                  </div>

                  <p className="mt-4 text-sm font-medium text-slate-800">
                    Belum ada percakapan
                  </p>

                  <p className="mt-1 max-w-xs text-xs leading-5 text-slate-400">
                    Conversation dengan student
                    akan muncul di sini.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {conversations.map(
                    (conversation) => {
                      const studentName =
                        conversation
                          .student_access?.[0]
                          ?.student_name ||
                        'Unnamed Student'

                      return (
                        <button
                          key={
                            conversation.id
                          }
                          type="button"
                          onClick={() =>
                            void openConversation(
                              conversation,
                            )
                          }
                          className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-slate-50"
                        >
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600">
                            {studentName
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-3">
                              <p className="truncate text-sm font-medium text-slate-800">
                                {studentName}
                              </p>

                              <span className="shrink-0 text-[10px] text-slate-400">
                                {new Date(
                                  conversation.updated_at,
                                ).toLocaleTimeString(
                                  'id-ID',
                                  {
                                    hour: '2-digit',
                                    minute:
                                      '2-digit',
                                  },
                                )}
                              </span>
                            </div>

                            <p className="mt-1 truncate text-xs text-slate-400">
                              Percakapan langsung
                              dengan student
                            </p>
                          </div>

                          <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-300" />
                        </button>
                      )
                    },
                  )}
                </div>
              )}
            </div>

            {conversations.length > 0 && (
              <div className="shrink-0 border-t border-slate-200 bg-white p-3">
                <Link
                  href={`/${organizationSlug}/classes/student-access`}
                  className="flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
                >
                  Lihat Student Access
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Messages */}

            <div className="min-h-0 flex-1 overflow-y-auto bg-slate-50/40 px-4 py-5">
              <ChatMessages
                messages={messages}
                currentTeacherProfileId={
                  teacherProfileId
                }
                emptyMessage="Belum ada pesan. Kirim pesan pertama kepada student."
              />
            </div>

            {/* Composer */}

            <div className="shrink-0 border-t border-slate-200 bg-white p-3">
              <form
                onSubmit={(event) => {
                  event.preventDefault()
                  void sendMessage()
                }}
                className="space-y-2"
              >
                <div className="flex items-end gap-2">
                  <textarea
                    value={message}
                    onChange={(event) =>
                      setMessage(
                        event.target.value,
                      )
                    }
                    onKeyDown={
                      handleKeyDown
                    }
                    placeholder="Ketik pesan..."
                    rows={2}
                    maxLength={5000}
                    disabled={isSending}
                    className="min-h-[54px] flex-1 resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-slate-300 focus:bg-white focus:ring-2 focus:ring-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                  />

                  <Button
                    type="submit"
                    size="icon"
                    disabled={
                      isSending ||
                      message.trim()
                        .length === 0
                    }
                    aria-label="Kirim pesan"
                    className="h-[54px] w-[54px] shrink-0 rounded-2xl"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center justify-between px-1">
                  <p className="text-[10px] text-slate-400">
                    Ctrl + Enter untuk mengirim
                  </p>

                  <p className="text-[10px] text-slate-400">
                    {message.length}/5000
                  </p>
                </div>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  )
}