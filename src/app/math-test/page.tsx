import { MathInputTest } from './math-input-test'
import { MathImageTest } from './math-image-test'

export default function MathTestPage() {
  return (
    <main className="min-h-screen bg-[#090909] px-6 py-10 text-white">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <p className="mb-2 text-sm text-white/40">
            Development Test
          </p>

          <h1 className="text-2xl font-semibold">
            Math Input Test
          </h1>

          <p className="mt-2 text-sm text-white/50">
            Test input matematika menggunakan MathLive.
          </p>
        </div>

        <MathInputTest />
      </div>

      <div className="mt-8">
  <MathImageTest />
</div>
    </main>
  )
}