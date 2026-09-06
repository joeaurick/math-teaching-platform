import type { ComponentType } from 'react'
import {
  BookOpen,
  Camera,
  ClipboardList,
  FileQuestion,
  GraduationCap,
  LayoutDashboard,
  Library,
  PenLine,
  Settings,
  Shapes,
  Sparkles,
  Users,
  Video,
} from 'lucide-react'

export type NavigationItem = {
  label: string
  href: string
  icon: ComponentType<{ className?: string }>
}

export const workspaceNavigation: NavigationItem[] = [
  {
    label: 'Dashboard',
    href: '',
    icon: LayoutDashboard,
  },
  {
    label: 'My Modules',
    href: '/modules',
    icon: BookOpen,
  },
  {
    label: 'Question Builder',
    href: '/questions',
    icon: PenLine,
  },
  {
    label: 'Geometry',
    href: '/geometry',
    icon: Shapes,
  },
  {
    label: 'Math Symbols',
    href: '/symbols',
    icon: Sparkles,
  },
  {
    label: 'Photo / Scan',
    href: '/photo-scan',
    icon: Camera,
  },
]

export const teachingNavigation: NavigationItem[] = [
  {
    label: 'Question Bank',
    href: '/question-bank',
    icon: Library,
  },
  {
    label: 'Worksheets',
    href: '/worksheets',
    icon: ClipboardList,
  },
  {
    label: 'Teaching Mode',
    href: '/teaching-mode',
    icon: GraduationCap,
  },
  {
    label: 'Classes',
    href: '/classes',
    icon: Users,
  },
  {
    label: 'Live Classroom',
    href: '/live-classroom',
    icon: Video,
  },
  {
    label: 'Student Submissions',
    href: '/submissions',
    icon: FileQuestion,
  },
]

export const systemNavigation: NavigationItem[] = [
  {
    label: 'Settings',
    href: '/settings',
    icon: Settings,
  },
]