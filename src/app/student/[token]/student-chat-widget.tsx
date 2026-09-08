'use client'

import {
  useCallback,
  useEffect,
  useState,
} from 'react'
import {
  Maximize2,
  MessageCircle,
  Minus,
  PanelRight,
  X,
} from 'lucide-react'
import { usePathname } from 'next/navigation'

import { ChatMessages } from '@/components/chat/chat-messages'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'

import { ChatComposer } from './chat/chat-composer'
import { ChatRealtime } from './chat/chat-realtime'

type ChatMessage = {
  id: string
  conversation_id: string
  sender_profile_id: string | null
  sender_student_access_id: string | null
  message: string
  created_at: string
}

type ChatConversation = {
  conversation_id: string
  organization_id: string
  student_access_id: string
  teacher_profile_id: string
  created_at: string
  updated_at: string
}

type StudentChatWidgetProps = {
  token: string
}

type ChatMode =
  | 'floating'
  | 'docked'

export function StudentChatWidget({
  token,
}: StudentChatWidgetProps) {
  const pathname = usePathname()

  const [conversation, setConversation] =
    useState<ChatConversation | null>(null)

  const [messages, setMessages] =
    useState<ChatMessage[]>([])

  const [open, setOpen] =
    useState(false)

  const [minimized, setMinimized] =
    useState(false)

  const [mode, setMode] =
    useState<ChatMode>('floating')

  const [unreadCount, setUnreadCount] =
    useState(0)

  /*
   * Gabungkan message dari database dengan
   * message realtime tanpa duplicate.
   */
  const mergeMessages = useCallback(
    (
      current: ChatMessage[],
      incoming: ChatMessage[],
    ) => {
      const messageMap =
        new Map<string, ChatMessage>()

      for (const message of current) {
        messageMap.set(
          message.id,
          message,
        )
      }

      for (const message of incoming) {
        messageMap.set(
          message.id,
          message,
        )
      }

      return Array.from(
        messageMap.values(),
      ).sort(
        (first, second) =>
          new Date(
            first.created_at,
          ).getTime() -
          new Date(
            second.created_at,
          ).getTime(),
      )
    },
    [],
  )

  /*
   * Ambil conversation dan messages langsung
   * dari Supabase.
   */
  const loadChat = useCallback(
    async () => {
      if (!token) {
        return
      }

      const supabase = createClient()

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
        console.error(
          '[STUDENT CHAT] conversation error:',
          conversationError,
        )
        return
      }

      const currentConversation =
        (conversationData?.[0] as
          | ChatConversation
          | undefined) ?? null

      setConversation(
        currentConversation,
      )

      if (!currentConversation) {
        setMessages([])
        return
      }

      const {
        data: messageData,
        error: messagesError,
      } = await supabase.rpc(
        'get_student_chat_messages_by_token',
        {
          access_token: token,
          target_conversation_id:
            currentConversation.conversation_id,
        },
      )

      if (messagesError) {
        console.error(
          '[STUDENT CHAT] messages error:',
          messagesError,
        )
        return
      }

      const databaseMessages =
        (messageData ?? []) as ChatMessage[]

      /*
       * Jangan replace state secara membabi buta.
       *
       * Kalau realtime masuk bersamaan dengan
       * loadChat(), keduanya tetap digabung.
       */
      setMessages((current) =>
        mergeMessages(
          current,
          databaseMessages,
        ),
      )
    },
    [mergeMessages, token],
  )

  /*
   * Load ketika student workspace dibuka.
   */
  useEffect(() => {
    if (
      !token ||
      pathname.includes('/chat')
    ) {
      return
    }

    void loadChat()
  }, [
    loadChat,
    pathname,
    token,
  ])

  /*
   * Pesan dari realtime.
   *
   * Semua message berasal dari database,
   * jadi tidak ada optimistic message.
   */
  const handleRealtimeMessage =
    useCallback(
      (message: ChatMessage) => {
        setMessages((current) =>
          mergeMessages(
            current,
            [message],
          ),
        )

        /*
         * Hanya pesan guru yang dihitung
         * sebagai unread.
         */
        if (
          message.sender_profile_id &&
          (!open || minimized)
        ) {
          setUnreadCount(
            (current) => current + 1,
          )
        }
      },
      [
        mergeMessages,
        minimized,
        open,
      ],
    )

  /*
   * Setelah student berhasil mengirim melalui
   * RPC, ambil ulang data dari database.
   *
   * Tidak membuat temporary/optimistic message.
   */
  const handleMessageSent =
    useCallback(() => {
      void loadChat()
    }, [loadChat])

  /*
   * Sekarang tidak digunakan untuk optimistic
   * message, tetapi tetap disediakan agar
   * composer memiliki jalur error yang aman.
   */
  const handleMessageRemoved =
    useCallback(() => {
    }, [])

  function handleOpen() {
    setOpen(true)
    setMinimized(false)
    setUnreadCount(0)

    void loadChat()
  }

  function handleClose() {
    setOpen(false)
    setMinimized(false)
  }

  function handleMinimize() {
    setMinimized(true)
    setOpen(true)
  }

  function handleRestore() {
    setMinimized(false)
    setOpen(true)
    setUnreadCount(0)

    void loadChat()
  }

  function toggleMode() {
    setMode((current) =>
      current === 'floating'
        ? 'docked'
        : 'floating',
    )
  }

  /*
   * Halaman /chat memiliki halaman chat
   * tersendiri sehingga widget disembunyikan.
   */
  if (pathname.includes('/chat')) {
    return null
  }

  /*
   * Realtime sengaja diletakkan di luar
   * tampilan widget.
   *
   * Jadi meskipun widget ditutup/minimize,
   * pesan guru tetap bisa diterima.
   */
  const realtime =
    conversation && (
      <ChatRealtime
        token={token}
        conversationId={
          conversation.conversation_id
        }
        onMessage={
          handleRealtimeMessage
        }
      />
    )

  /*
   * Widget tertutup.
   */
  if (!open) {
    return (
      <>
        <button
          type="button"
          onClick={handleOpen}
          className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-200 bg-gradient-to-br from-cyan-500 via-teal-500 to-emerald-500 text-white shadow-lg shadow-cyan-200/60 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-cyan-200/70 active:scale-95"
          aria-label="Buka chat"
        >
          <MessageCircle className="h-5 w-5" />

          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-rose-500 px-1 text-[10px] font-semibold text-white shadow-sm">
              {unreadCount > 9
                ? '9+'
                : unreadCount}
            </span>
          )}
        </button>

        {realtime}
      </>
    )
  }

  /*
   * Widget minimize.
   */
  if (minimized) {
    return (
      <>
        <div className="fixed bottom-5 right-5 z-50">
          <button
            type="button"
            onClick={handleRestore}
            className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left shadow-xl shadow-slate-200/70 transition-all hover:border-cyan-200 hover:shadow-2xl hover:shadow-slate-200/80"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 shadow-sm">
              <MessageCircle className="h-4 w-4 text-white" />
            </div>

            <div className="min-w-[120px]">
              <p className="text-xs font-semibold text-slate-900">
                Chat dengan Guru
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

        {realtime}
      </>
    )
  }

  return (
    <>
      <div
        className={`fixed z-50 ${
          mode === 'docked'
            ? 'inset-y-4 right-4 w-[min(420px,calc(100vw-2rem))] md:inset-y-0 md:right-0 md:w-[420px]'
            : 'bottom-4 right-4 w-[min(420px,calc(100vw-2rem))]'
        }`}
      >
        <div
          className={`flex overflow-hidden border border-slate-200 bg-white shadow-2xl shadow-slate-300/50 ${
            mode === 'docked'
              ? 'h-full rounded-2xl md:rounded-none md:border-y-0 md:border-r-0'
              : 'h-[min(680px,calc(100vh-32px))] rounded-3xl'
          }`}
        >
          <div className="flex min-h-0 flex-1 flex-col">
            {/* Header */}

            <div className="shrink-0 border-b border-slate-200 bg-gradient-to-r from-cyan-50 via-white to-emerald-50 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 shadow-sm">
                  <MessageCircle className="h-4 w-4 text-white" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    Chat dengan Guru
                  </p>

                  <div className="mt-0.5 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                    <span className="text-[10px] text-slate-400">
                      Percakapan pribadi
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={toggleMode}
                    className="h-8 w-8 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                    aria-label={
                      mode === 'floating'
                        ? 'Sisipkan di samping'
                        : 'Kembalikan ke floating'
                    }
                    title={
                      mode === 'floating'
                        ? 'Sisipkan di samping'
                        : 'Kembalikan ke floating'
                    }
                  >
                    {mode === 'floating' ? (
                      <PanelRight className="h-4 w-4" />
                    ) : (
                      <Maximize2 className="h-4 w-4" />
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={handleMinimize}
                    className="h-8 w-8 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                    aria-label="Minimize chat"
                    title="Minimize"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={handleClose}
                    className="h-8 w-8 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                    aria-label="Tutup chat"
                    title="Tutup"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages */}

            <div className="min-h-0 flex-1 overflow-y-auto bg-slate-50/50 px-4 py-5">
              {conversation ? (
                messages.length > 0 ? (
                  <ChatMessages
                    messages={messages}
                  />
                ) : (
                  <div className="flex min-h-[300px] flex-col items-center justify-center text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-100 bg-gradient-to-br from-cyan-50 to-emerald-50">
                      <MessageCircle className="h-5 w-5 text-cyan-500" />
                    </div>

                    <p className="mt-4 text-sm font-medium text-slate-700">
                      Belum ada pesan
                    </p>

                    <p className="mt-1 max-w-xs text-xs leading-5 text-slate-400">
                      Kirim pesan kepada guru
                      untuk memulai percakapan.
                    </p>
                  </div>
                )
              ) : (
                <div className="flex h-full min-h-[300px] flex-col items-center justify-center text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-100 bg-gradient-to-br from-cyan-50 to-emerald-50">
                    <MessageCircle className="h-5 w-5 text-cyan-500" />
                  </div>

                  <p className="mt-4 text-sm font-medium text-slate-700">
                    Chat belum tersedia
                  </p>

                  <p className="mt-1 max-w-xs text-xs leading-5 text-slate-400">
                    Guru belum membuka
                    percakapan dengan Anda.
                  </p>
                </div>
              )}
            </div>

            {/* Composer */}

            <div className="shrink-0 border-t border-slate-200 bg-white p-3">
              <ChatComposer
                token={token}
                studentAccessId={
                  conversation?.student_access_id ??
                  ''
                }
                conversationId={
                  conversation?.conversation_id ??
                  null
                }
                onMessageSent={
                  handleMessageSent
                }
                onMessageRemoved={
                  handleMessageRemoved
                }
              />
            </div>
          </div>
        </div>
      </div>

      {realtime}
    </>
  )
}