const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('labelproof_token')
  const authHeader: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {}

  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 
      'Content-Type': 'application/json', 
      ...authHeader,
      ...options?.headers 
    },
    ...options,
  })
  if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`)
  return res.json() as Promise<T>
}
