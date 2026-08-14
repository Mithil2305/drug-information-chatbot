const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

export const AUTH_LOGOUT_EVENT = 'labelproof:auth-logout'

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('labelproof_token')
  const authHeader: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {}

  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...authHeader,
      ...options?.headers,
    },
    ...options,
  })

  if (res.status === 401) {
    localStorage.removeItem('labelproof_token')
    window.dispatchEvent(new CustomEvent(AUTH_LOGOUT_EVENT))
    throw new Error('Session expired. Please sign in again.')
  }

  if (!res.ok) {
    let detail = `API ${res.status}: ${res.statusText}`
    try {
      const body = await res.json()
      if (body?.detail) detail = body.detail
    } catch {
      // response has no JSON body
    }
    throw new Error(detail)
  }

  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}
