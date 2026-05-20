import crypto from 'crypto'

export type Role = 'admin' | 'seeker' | 'employer'

export interface User {
  id: string
  name: string
  email: string
  role: Role
  company?: string
  password: string
  verified: boolean
  verifyToken?: string
  resetToken?: string
  resetExpiry?: number
  createdAt: number
}

// In-memory store (persists per serverless instance)
// For production → replace with Supabase/PlanetScale
const store: Map<string, User> = new Map()

// ── Seed demo users ──────────────────────────────────────────────────────────
const DEMO: User[] = [
  { id:'admin-1', name:'Admin User',   email:'admin@talentai.com',    role:'admin',    password:'admin123',    verified:true, createdAt:Date.now() },
  { id:'seek-1',  name:'Arjun Sharma', email:'seeker@talentai.com',   role:'seeker',   password:'seeker123',   verified:true, createdAt:Date.now() },
  { id:'emp-1',   name:'Priya Nair',   email:'employer@talentai.com', role:'employer', company:'Infosys', password:'employer123', verified:true, createdAt:Date.now() },
]
DEMO.forEach(u => store.set(u.email.toLowerCase(), u))

// ── Helpers ──────────────────────────────────────────────────────────────────
export function getUser(email: string) { return store.get(email.toLowerCase()) }
export function getAllUsers() { return Array.from(store.values()) }

export function createUser(data: Omit<User,'id'|'createdAt'>): User {
  if (store.has(data.email.toLowerCase())) throw new Error('Email already registered')
  const user: User = { ...data, id: `user-${Date.now()}`, createdAt: Date.now() }
  store.set(data.email.toLowerCase(), user)
  return user
}

export function updateUser(email: string, patch: Partial<User>) {
  const u = store.get(email.toLowerCase())
  if (!u) throw new Error('User not found')
  const updated = { ...u, ...patch }
  store.set(email.toLowerCase(), updated)
  return updated
}

export function makeToken() { return crypto.randomBytes(32).toString('hex') }

export function signToken(user: User): string {
  const payload = `${user.id}|${user.email}|${user.role}|${Date.now()}`
  return Buffer.from(payload).toString('base64url')
}

export function verifyToken(token: string): { id:string; email:string; role:Role } | null {
  try {
    const decoded = Buffer.from(token, 'base64url').toString()
    const [id, email, role] = decoded.split('|')
    if (!id || !email || !role) return null
    return { id, email, role: role as Role }
  } catch { return null }
}

export function safeUser(u: User) {
  const { password, verifyToken, resetToken, resetExpiry, ...safe } = u
  return safe
}
