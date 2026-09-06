'use client'

import {
  useEffect,
  useRef,
} from 'react'

import {
  formatChatDayLabel,
  formatChatMetadata,
  isSameCalendarDay,
} from '@/lib/chat/format-chat-date'

type ChatMessage = {
  id: string
  conversation_id: string
  sender_profile_id: string | null
  sender_student_access_id: string | null
  message: string
  created_at: string
}

type ChatMessagesProps = {
  messages: ChatMessage[]
  currentTeacherProfileId?: string
  emptyMessage?: string
}

export function ChatMessages({
  messages,
  currentTeacherProfileId,
  emptyMessage = 'Belum ada pesan.',
}: ChatMessagesProps) {
  const contentRef =
    useRef<HTMLDivElement>(null)

  const shouldAutoScrollRef =
    useRef(true)

  const initialRenderRef =
    useRef(true)

  function getScrollParent() {
    const element = contentRef.current

    if (!element) {
      return null
    }

    let parent =
      element.parentElement

    while (parent) {
      const style =
        window.getComputedStyle(parent)

      const overflowY =
        style.overflowY

      if (
        overflowY === 'auto' ||
        overflowY === 'scroll'
      ) {
        return parent
      }

      parent = parent.parentElement
    }

    return null
  }

  function checkScrollPosition() {
    const container =
      getScrollParent()

    if (!container) {
      return
    }

    const distanceFromBottom =
      container.scrollHeight -
      container.scrollTop -
      container.clientHeight

    shouldAutoScrollRef.current =
      distanceFromBottom <= 80
  }

  function scrollToBottom(
    behavior: ScrollBehavior,
  ) {
    const container =
      getScrollParent()

    if (!container) {
      return
    }

    container.scrollTo({
      top: container.scrollHeight,
      behavior,
    })
  }

  useEffect(() => {
    const container =
      getScrollParent()

    if (!container) {
      return
    }

    container.addEventListener(
      'scroll',
      checkScrollPosition,
      {
        passive: true,
      },
    )

    return () => {
      container.removeEventListener(
        'scroll',
        checkScrollPosition,
      )
    }
  }, [])

  useEffect(() => {
    if (initialRenderRef.current) {
      requestAnimationFrame(() => {
        scrollToBottom('auto')
        initialRenderRef.current = false
      })

      return
    }

    if (!shouldAutoScrollRef.current) {
      return
    }

    requestAnimationFrame(() => {
      scrollToBottom('smooth')
    })
  }, [messages.length])

  if (messages.length === 0) {
    return (
      <div className="flex min-h-[320px] flex-col items-center justify-center px-6 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/[0.08] bg-gradient-to-br from-violet-500/[0.12] to-cyan-500/[0.08]">
          <span className="text-lg">
            💬
          </span>
        </div>

        <p className="mt-4 text-sm font-medium text-white/70">
          Belum ada pesan
        </p>

        <p className="mt-1 max-w-xs text-xs leading-5 text-white/30">
          {emptyMessage}
        </p>
      </div>
    )
  }

  return (
    <div ref={contentRef}>
      <div className="space-y-6">
        {messages.map((message, index) => {
          const previousMessage =
            messages[index - 1]

          const isNewDay =
            !previousMessage ||
            !isSameCalendarDay(
              message.created_at,
              new Date(
                previousMessage.created_at,
              ),
            )

          const isStudentMessage =
            message.sender_profile_id === null

          const isTeacherMessage =
            currentTeacherProfileId
              ? message.sender_profile_id ===
                currentTeacherProfileId
              : message.sender_profile_id !== null

          return (
            <div key={message.id}>
              {isNewDay && (
                <div className="mb-5 flex items-center gap-3">
                  <div className="h-px flex-1 bg-white/[0.06]" />

                  <span className="shrink-0 rounded-full border border-white/[0.06] bg-white/[0.025] px-3 py-1 text-[10px] font-medium tracking-wide text-white/30">
                    {formatChatDayLabel(
                      message.created_at,
                    )}
                  </span>

                  <div className="h-px flex-1 bg-white/[0.06]" />
                </div>
              )}

              <div
                className={
                  isStudentMessage
                    ? 'flex justify-end'
                    : 'flex justify-start'
                }
              >
                <div
                  className={
                    isStudentMessage
                      ? 'flex max-w-[84%] flex-col items-end sm:max-w-[72%]'
                      : 'flex max-w-[84%] flex-col items-start sm:max-w-[72%]'
                  }
                >
                  <div
                    className={
                      isStudentMessage
                        ? [
                            'rounded-2xl rounded-br-md',
                            'border border-violet-400/20',
                            'bg-gradient-to-br',
                            'from-violet-500/[0.22]',
                            'via-indigo-500/[0.16]',
                            'to-fuchsia-500/[0.10]',
                            'px-4 py-3',
                            'text-white',
                            'shadow-[0_8px_30px_rgba(0,0,0,0.14)]',
                          ].join(' ')
                        : [
                            'rounded-2xl rounded-bl-md',
                            'border border-cyan-400/15',
                            'bg-gradient-to-br',
                            'from-cyan-500/[0.13]',
                            'via-teal-500/[0.10]',
                            'to-emerald-500/[0.07]',
                            'px-4 py-3',
                            'text-white',
                            'shadow-[0_8px_30px_rgba(0,0,0,0.14)]',
                          ].join(' ')
                    }
                  >
                    <p className="whitespace-pre-wrap break-words text-sm leading-6 text-white/90">
                      {message.message}
                    </p>

                    <div
                      className={
                        isStudentMessage
                          ? 'mt-2 flex justify-end text-[10px] leading-none text-violet-100/45'
                          : 'mt-2 flex justify-end text-[10px] leading-none text-cyan-100/40'
                      }
                    >
                      {formatChatMetadata(
                        message.created_at,
                      )}
                    </div>
                  </div>

                  {isTeacherMessage &&
                    !isStudentMessage && (
                      <span className="mt-1 px-1 text-[9px] uppercase tracking-[0.12em] text-cyan-300/25">
                        Guru
                      </span>
                    )}

                  {isStudentMessage && (
                    <span className="mt-1 px-1 text-[9px] uppercase tracking-[0.12em] text-violet-300/25">
                      Anda
                    </span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}