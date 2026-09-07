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

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    setLoading(true)
    setErrorMessage('')

    const result = await createOrganization(name)

    if (!result.success) {
      setErrorMessage(
        result.error ?? 'Gagal membuat organisasi.',
      )
      setLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10 sm:px-6">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <p className="text-sm font-semibold tracking-tight text-primary">
            Math Teaching Platform
          </p>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Buat Workspace Anda
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            Buat organisasi pertama Anda untuk mulai
            menggunakan Math Teaching Platform.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/60 sm:p-6"
        >
          <div>
            <label
              htmlFor="organization-name"
              className="mb-2 block text-sm font-medium text-slate-900"
            >
              Nama Organisasi
            </label>

            <Input
              id="organization-name"
              type="text"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              placeholder="Contoh: Math Academy"
              autoComplete="organization"
              disabled={loading}
              required
              className="h-11"
            />
          </div>

          {errorMessage && (
            <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-5 text-rose-700">
              {errorMessage}
            </div>
          )}

          <Button
            type="submit"
            size="lg"
            disabled={loading}
            className="mt-6 w-full"
          >
            {loading
              ? 'Membuat workspace...'
              : 'Buat Workspace'}
          </Button>
        </form>

        <p className="mt-5 text-center text-xs leading-5 text-slate-400">
          Anda dapat mengatur organisasi dan anggota
          setelah workspace dibuat.
        </p>
      </div>
    </main>
  )
}