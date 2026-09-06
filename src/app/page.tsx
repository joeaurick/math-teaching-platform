import Link from 'next/link'
import {
  ArrowRight,
  BookOpen,
  Camera,
  CheckCircle2,
  FileText,
  GraduationCap,
  LayoutDashboard,
  PenTool,
  Play,
  Users,
  Video,
} from 'lucide-react'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#090909] text-white">
      {/* ====================================================== */}
      {/* Navigation                                             */}
      {/* ====================================================== */}

      <header className="border-b border-white/[0.06]">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="flex items-center gap-2.5"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-black">
              <GraduationCap className="h-4 w-4" />
            </div>

            <span className="text-sm font-semibold tracking-tight">
              Math Teaching Platform
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="inline-flex h-9 items-center justify-center rounded-xl px-3 text-sm font-medium text-white/65 transition-colors hover:bg-white/[0.06] hover:text-white"
            >
              Sign In
            </Link>

            <Link
              href="/register"
              className="inline-flex h-9 items-center justify-center rounded-xl bg-white px-4 text-sm font-medium text-black transition-colors hover:bg-white/90"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* ====================================================== */}
      {/* Hero                                                   */}
      {/* ====================================================== */}

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_40%)]" />

        <div className="relative mx-auto max-w-7xl px-4 pb-24 pt-24 sm:px-6 sm:pb-28 sm:pt-32 lg:px-8 lg:pb-32">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/[0.10] bg-white/[0.04] px-3 py-1.5 text-xs text-white/60">
              <span className="h-1.5 w-1.5 rounded-full bg-white/70" />
              Modern Mathematics Teaching Platform
            </div>

            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
              Teach mathematics.
              <br />
              <span className="text-white/45">
                Smarter and simpler.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-white/50 sm:text-lg">
              Create mathematics modules, build questions, share
              assignments with students, and manage learning from
              one simple workspace.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-white px-6 text-sm font-medium text-black transition-colors hover:bg-white/90 sm:w-auto"
              >
                Start Teaching
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/login"
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-white/[0.12] bg-white/[0.03] px-6 text-sm font-medium text-white transition-colors hover:bg-white/[0.07] sm:w-auto"
              >
                Sign In
              </Link>
            </div>
          </div>

          {/* ================================================== */}
          {/* Dashboard Preview                                  */}
          {/* ================================================== */}

          <div className="mx-auto mt-16 max-w-5xl">
            <div className="overflow-hidden rounded-2xl border border-white/[0.10] bg-[#0e0e0e] shadow-2xl">
              {/* Browser Header */}

              <div className="flex h-10 items-center gap-1.5 border-b border-white/[0.06] px-4">
                <div className="h-2.5 w-2.5 rounded-full bg-white/15" />
                <div className="h-2.5 w-2.5 rounded-full bg-white/15" />
                <div className="h-2.5 w-2.5 rounded-full bg-white/15" />

                <div className="ml-4 h-5 flex-1 rounded-md bg-white/[0.04]" />
              </div>

              <div className="grid min-h-[360px] grid-cols-[180px_1fr]">
                {/* Sidebar */}

                <div className="hidden border-r border-white/[0.06] p-4 sm:block">
                  <div className="mb-6 flex items-center gap-2">
                    <div className="h-6 w-6 rounded-md bg-white" />
                    <div className="h-2 w-20 rounded bg-white/15" />
                  </div>

                  <div className="space-y-2">
                    {[
                      'Dashboard',
                      'My Modules',
                      'Question Builder',
                      'Question Bank',
                      'Classes',
                      'Live Classroom',
                    ].map((item, index) => (
                      <div
                        key={item}
                        className={`flex h-8 items-center rounded-lg px-2 text-[10px] ${
                          index === 0
                            ? 'bg-white/[0.08] text-white'
                            : 'text-white/30'
                        }`}
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Content */}

                <div className="p-5 sm:p-7">
                  <div className="h-3 w-28 rounded bg-white/15" />
                  <div className="mt-2 h-2 w-48 rounded bg-white/[0.06]" />

                  <div className="mt-7 grid gap-3 sm:grid-cols-3">
                    {[1, 2, 3].map((item) => (
                      <div
                        key={item}
                        className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4"
                      >
                        <div className="h-7 w-7 rounded-lg bg-white/[0.07]" />
                        <div className="mt-4 h-2 w-20 rounded bg-white/15" />
                        <div className="mt-2 h-2 w-12 rounded bg-white/[0.06]" />
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
                    <div className="mb-4 flex items-center justify-between">
                      <div>
                        <div className="h-2 w-28 rounded bg-white/15" />
                        <div className="mt-2 h-2 w-40 rounded bg-white/[0.06]" />
                      </div>

                      <div className="h-8 w-24 rounded-lg bg-white/[0.08]" />
                    </div>

                    <div className="space-y-2">
                      {[1, 2, 3, 4].map((item) => (
                        <div
                          key={item}
                          className="h-10 rounded-lg bg-white/[0.03]"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================== */}
      {/* Features                                               */}
      {/* ====================================================== */}

      <section className="border-t border-white/[0.06]">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-medium uppercase tracking-widest text-white/35">
              Everything you need
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              One workspace for teaching mathematics.
            </h2>

            <p className="mt-4 text-sm leading-6 text-white/45">
              From building questions to working with students in
              real time, everything is organized in one place.
            </p>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={BookOpen}
              title="Learning Modules"
              description="Organize lessons and questions into structured mathematics modules."
            />

            <FeatureCard
              icon={FileText}
              title="Question Builder"
              description="Create multiple choice, true/false, short answer, numeric, and essay questions."
            />

            <FeatureCard
              icon={Users}
              title="Student Access"
              description="Give students secure access links without requiring them to create an account."
            />

            <FeatureCard
              icon={PenTool}
              title="Interactive Whiteboard"
              description="Explain mathematical concepts using collaborative drawing and annotation tools."
            />

            <FeatureCard
              icon={Camera}
              title="Photo & Scan"
              description="Capture handwritten mathematics work and use it as part of the learning process."
            />

            <FeatureCard
              icon={Video}
              title="Live Classroom"
              description="Bring teacher and students together through an interactive online classroom."
            />
          </div>
        </div>
      </section>

      {/* ====================================================== */}
      {/* Workflow                                               */}
      {/* ====================================================== */}

      <section className="border-t border-white/[0.06]">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-white/35">
                Simple workflow
              </p>

              <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                From question to classroom.
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-6 text-white/45">
                Build your material once, assign it to students,
                and follow their progress from the same workspace.
              </p>
            </div>

            <div className="space-y-3">
              <WorkflowStep
                number="01"
                title="Create your module"
                description="Build a structured learning module for your students."
              />

              <WorkflowStep
                number="02"
                title="Build questions"
                description="Create questions using the format that fits your lesson."
              />

              <WorkflowStep
                number="03"
                title="Share with students"
                description="Generate a secure student access link."
              />

              <WorkflowStep
                number="04"
                title="Review submissions"
                description="See student answers and provide feedback."
              />
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================== */}
      {/* Benefits                                               */}
      {/* ====================================================== */}

      <section className="border-t border-white/[0.06]">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-white/[0.08] bg-white/[0.025] p-8 sm:p-12">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
              <div>
                <p className="text-xs font-medium uppercase tracking-widest text-white/35">
                  Built for teachers
                </p>

                <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                  Spend less time managing tools.
                </h2>

                <p className="mt-4 max-w-xl text-sm leading-6 text-white/45">
                  Keep your teaching materials, questions, students,
                  and classroom activities organized in one platform.
                </p>

                <Link
                  href="/register"
                  className="mt-7 inline-flex h-11 items-center gap-2 rounded-xl bg-white px-5 text-sm font-medium text-black transition-colors hover:bg-white/90"
                >
                  Create Workspace
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="space-y-3">
                {[
                  'Organize mathematics modules',
                  'Create reusable question content',
                  'Give students secure access',
                  'Review and grade submissions',
                  'Teach collaboratively in real time',
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3"
                  >
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-white/60" />

                    <span className="text-sm text-white/65">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================== */}
      {/* CTA                                                    */}
      {/* ====================================================== */}

      <section className="border-t border-white/[0.06]">
        <div className="mx-auto max-w-4xl px-4 py-24 text-center sm:px-6 lg:px-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-black">
            <Play className="ml-0.5 h-5 w-5" />
          </div>

          <h2 className="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">
            Ready to teach mathematics differently?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-white/45">
            Create your teaching workspace and start building your
            first mathematics module.
          </p>

          <Link
            href="/register"
            className="mt-7 inline-flex h-12 items-center gap-2 rounded-xl bg-white px-6 text-sm font-medium text-black transition-colors hover:bg-white/90"
          >
            Get Started
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ====================================================== */}
      {/* Footer                                                 */}
      {/* ====================================================== */}

      <footer className="border-t border-white/[0.06]">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-black">
              <GraduationCap className="h-3.5 w-3.5" />
            </div>

            <span className="text-sm text-white/50">
              Math Teaching Platform
            </span>
          </div>

          <div className="flex items-center gap-5 text-xs text-white/35">
            <Link
              href="/login"
              className="transition-colors hover:text-white"
            >
              Sign In
            </Link>

            <Link
              href="/register"
              className="transition-colors hover:text-white"
            >
              Get Started
            </Link>
          </div>
        </div>
      </footer>
    </main>
  )
}

type FeatureCardProps = {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
}

function FeatureCard({
  icon: Icon,
  title,
  description,
}: FeatureCardProps) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 transition-colors hover:border-white/[0.12] hover:bg-white/[0.03]">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.06]">
        <Icon className="h-5 w-5 text-white/60" />
      </div>

      <h3 className="mt-5 text-sm font-semibold">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-white/40">
        {description}
      </p>
    </div>
  )
}

type WorkflowStepProps = {
  number: string
  title: string
  description: string
}

function WorkflowStep({
  number,
  title,
  description,
}: WorkflowStepProps) {
  return (
    <div className="flex gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.06] text-xs font-medium text-white/50">
        {number}
      </div>

      <div>
        <h3 className="text-sm font-semibold">
          {title}
        </h3>

        <p className="mt-1 text-sm leading-6 text-white/40">
          {description}
        </p>
      </div>
    </div>
  )
}