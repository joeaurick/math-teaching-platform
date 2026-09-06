import { Bell } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { MobileNav } from './mobile-nav'
import { OrganizationSwitcher } from './organization-switcher'
import { UserMenu } from './user-menu'

type TopbarProps = {
  organizationSlug: string
  organizationName: string
  userEmail?: string | null
  role?: string
}

export function Topbar({
  organizationSlug,
  organizationName,
  userEmail,
  role,
}: TopbarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-[72px] shrink-0 items-center border-b border-slate-200 bg-white/90 px-4 shadow-sm backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <MobileNav
          organizationSlug={organizationSlug}
        />

        <OrganizationSwitcher
          organizationSlug={organizationSlug}
          organizationName={organizationName}
        />
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Notifications"
          className="hidden text-slate-500 hover:bg-slate-100 hover:text-slate-900 sm:inline-flex"
        >
          <Bell className="h-[18px] w-[18px]" />
        </Button>

        <UserMenu
          email={userEmail}
          role={role}
        />
      </div>
    </header>
  )
}