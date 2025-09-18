export interface User {
  id: string
  name: string
  email?: string
  createdAt: Date
}

export interface Session {
  user: User
  isAuthenticated: boolean
}

// Mock session storage (in real app, use proper session management)
let currentSession: Session | null = null

export function createSession(userData: { name: string; email?: string }): Session {
  const user: User = {
    id: Math.random().toString(36).substr(2, 9),
    name: userData.name,
    email: userData.email,
    createdAt: new Date(),
  }

  currentSession = {
    user,
    isAuthenticated: true,
  }

  // Store in localStorage for persistence
  if (typeof window !== "undefined") {
    localStorage.setItem("quiz-session", JSON.stringify(currentSession))
  }

  return currentSession
}

export function getSession(): Session | null {
  if (currentSession) return currentSession

  // Try to restore from localStorage
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("quiz-session")
    if (stored) {
      try {
        currentSession = JSON.parse(stored)
        return currentSession
      } catch {
        localStorage.removeItem("quiz-session")
      }
    }
  }

  return null
}

export function clearSession(): void {
  currentSession = null
  if (typeof window !== "undefined") {
    localStorage.removeItem("quiz-session")
  }
}

export function requireAuth(): User {
  const session = getSession()
  if (!session?.isAuthenticated) {
    throw new Error("Authentication required")
  }
  return session.user
}
