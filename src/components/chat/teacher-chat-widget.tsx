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
  id: string
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

  /*
   * Nama siswa terakhir yang mengirim
   * pesan baru.
   */
  const [
    incomingStudentName,
    setIncomingStudentName,
  ] = useState<string | null>(null)

  /*
   * Ambil daftar conversation.
   *
   * Nama siswa sengaja diambil melalui
   * student_access_id secara terpisah.
   *
   * Jadi kita tidak bergantung pada nested
   * relation Supabase.
   */
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
          updated_at
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
        return []
      }

      const conversationRows =
        (data ?? []) as Omit<
          ChatConversation,
          'student_access'
        >[]

      if (
        conversationRows.length === 0
      ) {
        setConversations([])
        setLoaded(true)
        return []
      }

      const studentAccessIds =
        Array.from(
          new Set(
            conversationRows
              .map(
                (conversation) =>
                  conversation.student_access_id,
              )
              .filter(Boolean),
          ),
        )

      const {
        data: studentRows,
        error: studentError,
      } = await supabase
        .from('student_access')
        .select(`
          id,
          student_name
        `)
        .eq(
          'organization_id',
          organizationId,
        )
        .in(
          'id',
          studentAccessIds,
        )

      if (studentError) {
        console.error(
          '[TEACHER CHAT] student access error:',
          studentError,
        )
      }

      const students =
        (studentRows ??
          []) as StudentAccessRelation[]

      const studentMap = new Map<
        string,
        StudentAccessRelation
      >()

      for (const student of students) {
        studentMap.set(
          student.id,
          student,
        )
      }

      const conversationsWithStudents =
        conversationRows.map(
          (conversation) => {
            const student =
              studentMap.get(
                conversation.student_access_id,
              )

            return {
              ...conversation,
              student_access: student
                ? [student]
                : [],
            }
          },
        )

      setConversations(
        conversationsWithStudents,
      )

      setLoaded(true)

      return conversationsWithStudents
    }, [
      organizationId,
      supabase,
      teacherProfileId,
    ])

  /*
   * Ambil nama siswa langsung berdasarkan
   * sender_student_access_id.
   */
  const loadStudentName =
    useCallback(
      async (
        studentAccessId: string,
      ) => {
        const {
          data,
          error,
        } = await supabase
          .from('student_access')
          .select(`
            id,
            student_name
          `)
          .eq(
            'id',
            studentAccessId,
          )
          .eq(
            'organization_id',
            organizationId,
          )
          .maybeSingle()

        if (error) {
          console.error(
            '[TEACHER CHAT] student name error:',
            error,
          )
          return null
        }

        return data?.student_name ?? null
      },
      [
        organizationId,
        supabase,
      ],
    )

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

  /*
   * Load awal.
   */
  useEffect(() => {
    void loadConversations()
  }, [loadConversations])

  /*
   * Realtime chat.
   */
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
        async (payload) => {
          const incoming =
            payload.new as ChatMessage

          if (
            !incoming ||
            !incoming.conversation_id
          ) {
            return
          }

          /*
           * Hanya pesan dari siswa yang
           * mempunyai sender_student_access_id
           * dianggap sebagai pesan siswa.
           */
          if (
            incoming.sender_student_access_id
          ) {
            /*
             * INI BAGIAN PENTING:
             *
             * Jangan mengambil nama dari
             * conversation.student_access.
             *
             * Ambil langsung dari:
             *
             * sender_student_access_id
             *        ↓
             * student_access.id
             *        ↓
             * student_name
             */
            const studentName =
              await loadStudentName(
                incoming.sender_student_access_id,
              )

            setIncomingStudentName(
              studentName ||
                'Siswa Tanpa Nama',
            )
          }

          /*
           * Update conversation.
           */
          const existingConversation =
            conversations.find(
              (conversation) =>
                conversation.id ===
                incoming.conversation_id,
            )

          if (
            !existingConversation
          ) {
            /*
             * Conversation belum ada di
             * state, reload daftar.
             */
            await loadConversations()
          } else {
            setConversations(
              (current) => {
                const existing =
                  current.find(
                    (item) =>
                      item.id ===
                      incoming.conversation_id,
                  )

                if (!existing) {
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
          }

          /*
           * Jika conversation sedang dibuka,
           * masukkan pesan ke layar.
           */
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

          /*
           * Pesan siswa menjadi unread ketika
           * conversation tidak sedang aktif.
           */
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
        if (
          status === 'SUBSCRIBED'
        ) {
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

        if (
          status === 'TIMED_OUT'
        ) {
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
    conversations,
    loadConversations,
    loadStudentName,
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
    setIncomingStudentName(null)
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

  /*
   * Widget tertutup.
   */
  if (!open) {
    return (
      <div className="fixed bottom-4 right-4 z-[100] sm:bottom-5 sm:right-5">
        {incomingStudentName && (
          <button
            type="button"
            onClick={handleOpen}
            className="absolute bottom-full right-0 mb-3 flex max-w-[280px] items-center gap-3 rounded-2xl border border-violet-100 bg-white px-4 py-3 text-left shadow-xl shadow-violet-100/70 transition-all hover:-translate-y-0.5 hover:border-violet-200"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-100 to-indigo-100 text-sm font-semibold text-violet-700">
              {incomingStudentName
                .charAt(0)
                .toUpperCase()}
            </div>

            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-slate-800">
                {incomingStudentName}
              </p>

              <p className="mt-0.5 text-[10px] text-slate-400">
                Mengirim pesan baru
              </p>
            </div>
          </button>
        )}

        <button
          type="button"
          onClick={handleOpen}
          className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 via-violet-600 to-indigo-600 text-white shadow-xl shadow-violet-300/50 transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl hover:shadow-violet-300/60 active:scale-95 sm:h-16 sm:w-16"
          aria-label="Buka chat"
        >
          <span className="absolute inset-0 rounded-full bg-violet-400/20 blur-md transition-opacity group-hover:opacity-100" />

          <span className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-sm sm:h-11 sm:w-11">
            <MessageCircle
              className="h-5 w-5 sm:h-[21px] sm:w-[21px]"
              strokeWidth={2}
            />
          </span>

          <span className="absolute bottom-0.5 right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-400 shadow-sm sm:bottom-1 sm:right-1" />

          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-rose-500 px-1 text-[10px] font-bold text-white shadow-md">
              {unreadCount > 9
                ? '9+'
                : unreadCount}
            </span>
          )}
        </button>
      </div>
    )
  }

  /*
   * Widget minimize.
   */
  if (minimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50 sm:bottom-5 sm:right-5">
        <button
          type="button"
          onClick={handleRestore}
          className="flex max-w-[calc(100vw-2rem)] items-center gap-3 rounded-2xl border border-violet-100 bg-white px-3 py-3 text-left shadow-xl shadow-violet-100/70 transition-all hover:-translate-y-0.5 hover:border-violet-200 hover:bg-violet-50/30 sm:px-3.5"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-100 to-indigo-100 text-violet-600">
            <MessageCircle className="h-4 w-4" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-slate-800">
              {incomingStudentName ||
                'Chat Siswa'}
            </p>

            <p className="mt-0.5 truncate text-[10px] text-slate-400">
              {incomingStudentName
                ? 'Mengirim pesan baru'
                : 'Klik untuk membuka'}
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
    <div className="fixed inset-x-2 bottom-2 z-50 sm:inset-x-auto sm:bottom-4 sm:right-4 sm:w-[min(440px,calc(100vw-2rem))]">
      <div className="flex h-[min(720px,calc(100dvh-1rem))] flex-col overflow-hidden rounded-3xl border border-violet-100 bg-white shadow-2xl shadow-violet-200/30 sm:h-[min(680px,calc(100vh-32px))]">
        {/* Header */}

        <div className="flex min-h-16 shrink-0 items-center border-b border-violet-100 bg-gradient-to-r from-white via-violet-50/30 to-indigo-50/30 px-3.5 sm:px-4">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            {selectedConversationId ? (
              <button
                type="button"
                onClick={backToInbox}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-violet-100 hover:text-violet-700"
                aria-label="Kembali"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
            ) : (
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-100 to-indigo-100">
                <MessageCircle className="h-4 w-4 text-violet-600" />
              </div>
            )}

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900">
                {selectedConversation
                  ? selectedConversation
                      .student_access?.[0]
                      ?.student_name ||
                    'Siswa'
                  : 'Chat Siswa'}
              </p>

              <div className="mt-0.5 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                <span className="text-[10px] text-slate-400">
                  {incomingStudentName &&
                  !selectedConversation
                    ? `${incomingStudentName} mengirim pesan baru`
                    : 'Percakapan pribadi'}
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
              className="h-9 w-9 rounded-full text-slate-400 hover:bg-violet-100 hover:text-violet-700"
              aria-label="Minimalkan"
              title="Minimalkan"
            >
              <Minus className="h-4 w-4" />
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="h-9 w-9 rounded-full text-slate-400 hover:bg-violet-100 hover:text-violet-700"
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
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-100 to-indigo-100">
                    <MessageCircle className="h-5 w-5 text-violet-500" />
                  </div>

                  <p className="mt-4 text-sm font-medium text-slate-800">
                    Belum ada percakapan
                  </p>

                  <p className="mt-1 max-w-xs text-xs leading-5 text-slate-400">
                    Percakapan dengan siswa
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
                        'Siswa Tanpa Nama'

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
                          className="flex w-full items-center gap-3 px-3.5 py-3.5 text-left transition-colors hover:bg-violet-50/60 sm:px-4"
                        >
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-100 to-indigo-100 text-sm font-semibold text-violet-700">
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
                              dengan siswa
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
                  className="flex min-h-10 items-center justify-center gap-2 rounded-xl bg-violet-50/60 px-4 py-2.5 text-xs font-medium text-violet-600 transition-colors hover:bg-violet-100 hover:text-violet-700"
                >
                  Lihat Akses Siswa
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Pesan */}

            <div className="min-h-0 flex-1 overflow-y-auto bg-gradient-to-b from-violet-50/30 to-slate-50/40 px-3.5 py-4 sm:px-4 sm:py-5">
              <ChatMessages
                messages={messages}
                currentTeacherProfileId={
                  teacherProfileId
                }
                emptyMessage="Belum ada pesan. Kirim pesan pertama kepada siswa."
              />
            </div>

            {/* Kolom Pesan */}

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
                    className="min-h-[54px] flex-1 resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-violet-300 focus:bg-white focus:ring-2 focus:ring-violet-100 disabled:cursor-not-allowed disabled:opacity-50"
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
                    className="h-[54px] w-[54px] shrink-0 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-md shadow-violet-200 hover:from-violet-600 hover:to-indigo-700"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center justify-between gap-3 px-1">
                  <p className="text-[10px] text-slate-400">
                    Ctrl + Enter untuk mengirim
                  </p>

                  <p className="shrink-0 text-[10px] text-slate-400">
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