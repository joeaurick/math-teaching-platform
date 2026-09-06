import { StudentChatWidget } from './student-chat-widget'

type StudentTokenLayoutProps = {
  children: React.ReactNode
  params: Promise<{
    token: string
  }>
}

export default async function StudentTokenLayout({
  children,
  params,
}: StudentTokenLayoutProps) {
  const { token } = await params

  return (
    <>
      {children}

      <StudentChatWidget token={token} />
    </>
  )
}