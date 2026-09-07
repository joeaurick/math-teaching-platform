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
    label: 'Dasbor',
    href: '',
    icon: LayoutDashboard,
  },
  {
    label: 'Modul Saya',
    href: '/modules',
    icon: BookOpen,
  },
  {
    label: 'Pembuat Soal',
    href: '/questions',
    icon: PenLine,
  },
  {
    label: 'Geometri',
    href: '/geometry',
    icon: Shapes,
  },
  {
    label: 'Simbol Matematika',
    href: '/math-symbols',
    icon: Sparkles,
  },
  {
    label: 'Foto / Pindai',
    href: '/photo-scan',
    icon: Camera,
  },
]

export const teachingNavigation: NavigationItem[] = [
  {
    label: 'Bank Soal',
    href: '/question-bank',
    icon: Library,
  },
  {
    label: 'Lembar Kerja',
    href: '/worksheets',
    icon: ClipboardList,
  },
  {
    label: 'Mode Mengajar',
    href: '/teaching-mode',
    icon: GraduationCap,
  },
  {
    label: 'Kelas',
    href: '/classes',
    icon: Users,
  },
  {
    label: 'Kelas Langsung',
    href: '/live-classroom',
    icon: Video,
  },
  {
    label: 'Pengumpulan Siswa',
    href: '/submissions',
    icon: FileQuestion,
  },
]

export const systemNavigation: NavigationItem[] = [
  {
    label: 'Pengaturan',
    href: '/settings',
    icon: Settings,
  },
]