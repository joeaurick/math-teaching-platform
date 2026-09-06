export function isSameCalendarDay(
  firstValue: string,
  secondValue: Date,
) {
  const first = new Date(firstValue)

  return (
    first.getFullYear() ===
      secondValue.getFullYear() &&
    first.getMonth() ===
      secondValue.getMonth() &&
    first.getDate() ===
      secondValue.getDate()
  )
}

export function isYesterday(
  value: string,
  now = new Date(),
) {
  const date = new Date(value)

  const yesterday = new Date(now)

  yesterday.setDate(
    yesterday.getDate() - 1,
  )

  return (
    date.getFullYear() ===
      yesterday.getFullYear() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getDate() === yesterday.getDate()
  )
}

export function formatChatTime(
  value: string,
) {
  return new Date(value).toLocaleTimeString(
    'id-ID',
    {
      hour: '2-digit',
      minute: '2-digit',
    },
  )
}

export function formatChatDayLabel(
  value: string,
  now = new Date(),
) {
  if (isSameCalendarDay(value, now)) {
    return 'Hari ini'
  }

  if (isYesterday(value, now)) {
    return 'Kemarin'
  }

  const date = new Date(value)

  const sameYear =
    date.getFullYear() === now.getFullYear()

  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    ...(sameYear
      ? {}
      : { year: 'numeric' }),
  })
}

export function formatChatMetadata(
  value: string,
  now = new Date(),
) {
  const time = formatChatTime(value)

  if (isSameCalendarDay(value, now)) {
    return time
  }

  if (isYesterday(value, now)) {
    return `Kemarin · ${time}`
  }

  const date = new Date(value)

  const sameYear =
    date.getFullYear() === now.getFullYear()

  const formattedDate =
    date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      ...(sameYear
        ? {}
        : { year: 'numeric' }),
    })

  return `${formattedDate} · ${time}`
}