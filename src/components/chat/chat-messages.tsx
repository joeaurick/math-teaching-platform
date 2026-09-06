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
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-50 to-cyan-50">
          <span className="text-lg">
            💬
          </span>
        </div>

        <p className="mt-4 text-sm font-medium text-slate-800">
          Belum ada pesan
        </p>

        <p className="mt-1 max-w-xs text-xs leading-5 text-slate-400">
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
                  <div className="h-px flex-1 bg-slate-200" />

                  <span className="shrink-0 rounded-full border border-slate-200 bg-white px-3 py-1 text-[10px] font-medium tracking-wide text-slate-400 shadow-sm">
                    {formatChatDayLabel(
                      message.created_at,
                    )}
                  </span>

                  <div className="h-px flex-1 bg-slate-200" />
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
                            'border border-violet-200',
                            'bg-gradient-to-br',
                            'from-violet-50',
                            'via-indigo-50',
                            'to-fuchsia-50',
                            'px-4 py-3',
                            'text-slate-800',
                            'shadow-sm shadow-violet-100',
                          ].join(' ')
                        : [
                            'rounded-2xl rounded-bl-md',
                            'border border-cyan-200',
                            'bg-gradient-to-br',
                            'from-cyan-50',
                            'via-teal-50',
                            'to-emerald-50',
                            'px-4 py-3',
                            'text-slate-800',
                            'shadow-sm shadow-cyan-100',
                          ].join(' ')
                    }
                  >
                    <p className="whitespace-pre-wrap break-words text-sm leading-6 text-slate-800">
                      {message.message}
                    </p>

                    <div
                      className={
                        isStudentMessage
                          ? 'mt-2 flex justify-end text-[10px] leading-none text-violet-500'
                          : 'mt-2 flex justify-end text-[10px] leading-none text-cyan-600'
                      }
                    >
                      {formatChatMetadata(
                        message.created_at,
                      )}
                    </div>
                  </div>

                  {isTeacherMessage &&
                    !isStudentMessage && (
                      <span className="mt-1 px-1 text-[9px] uppercase tracking-[0.12em] text-cyan-600">
                        Guru
                      </span>
                    )}

                  {isStudentMessage && (
                    <span className="mt-1 px-1 text-[9px] uppercase tracking-[0.12em] text-violet-600">
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