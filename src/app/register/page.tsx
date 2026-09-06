'use client'

import { FormEvent, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function RegisterPage() {
  const supabase = createClient()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setLoading(true)
    setMessage('')

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })

    setLoading(false)

    if (error) {
      setMessage(error.message)
      return
    }

    setMessage(
      'Registrasi berhasil. Silakan cek email untuk verifikasi jika diperlukan.'
    )
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <form
        onSubmit={handleRegister}
        className="w-full max-w-md space-y-4"
      >
        <div>
          <h1 className="text-2xl font-bold">
            Create Account
          </h1>

          <p className="text-sm text-gray-500">
            Register sebagai teacher
          </p>
        </div>

        <input
          type="text"
          placeholder="Nama lengkap"
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
          required
          className="w-full rounded border p-3"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          className="w-full rounded border p-3"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          minLength={6}
          className="w-full rounded border p-3"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-black p-3 text-white disabled:opacity-50"
        >
          {loading ? 'Creating account...' : 'Register'}
        </button>

        {message && (
          <p className="text-sm">
            {message}
          </p>
        )}
      </form>
    </main>
  )
}