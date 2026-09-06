'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'

import { createOrganization } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function CreateOrganizationPage() {
  const router = useRouter()

  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setLoading(true)
    setErrorMessage('')

    const result = await createOrganization(name)

    if (!result.success) {
      setErrorMessage(
        result.error ?? 'Gagal membuat organization.',
      )
      setLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-4 py-8 text-white sm:px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md"
      >
        <div className="mb-8">
          <div className="mb-4 inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/50">
            Math Teaching Platform
          </div>

          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Create your workspace
          </h1>

          <p className="mt-3 text-sm leading-6 text-white/45">
            Buat organization pertama Anda untuk mulai
            menggunakan Math Teaching Platform.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/2,5 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.25)] sm:p-6">
          <div>
            <label
              htmlFor="organization-name"
              className="mb-2 block text-sm font-medium text-white/80"
            >
              Organization name
            </label>

            <Input
              id="organization-name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Contoh: Math Academy"
              autoComplete="organization"
              disabled={loading}
              required
            />
          </div>

          {errorMessage && (
            <div className="mt-4 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm leading-5 text-red-300">
              {errorMessage}
            </div>
          )}

          <Button
            type="submit"
            size="lg"
            disabled={loading}
            className="mt-6 w-full"
          >
            {loading ? 'Creating workspace...' : 'Create workspace'}
          </Button>
        </div>

        <p className="mt-5 text-center text-xs text-white/30">
          Anda dapat mengatur organization dan anggota
          setelah workspace dibuat.
        </p>
      </form>
    </main>
  )
}