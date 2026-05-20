'use client'
import { useState, useEffect, createContext, useContext } from 'react'
import { useRouter } from 'next/navigation'

export interface AuthUser {
  id: string; name: string; email: string
  role: 'admin' | 'seeker' | 'employer'; company?: string; token: string
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    try {
      const s = localStorage.getItem('talentai_user')
      if (s) setUser(JSON.parse(s))
    } catch {}
    setLoading(false)
  }, [])

  async function login(email: string, password: string): Promise<AuthUser> {
    const res = await fetch('/api/auth/login', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error)
    const u: AuthUser = { ...data.user, token: data.token }
    localStorage.setItem('talentai_user', JSON.stringify(u))
    setUser(u)
    return u
  }

  async function register(payload: { name:string; email:string; password:string; role:string; company?:string }) {
    const res = await fetch('/api/auth/register', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error)
    return data
  }

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    localStorage.removeItem('talentai_user')
    setUser(null)
    router.push('/login')
  }

  return { user, loading, login, register, logout }
}
