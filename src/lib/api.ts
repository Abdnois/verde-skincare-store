/** POST JSON to a Worker route; throws the route's `error` message on failure. */

const API_BASE = (import.meta.env.VITE_API_BASE ?? '').trim().replace(/\/+$/, '')

export function apiUrl(path: string): string {
  if (!API_BASE) return path
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${API_BASE}${normalized}`
}

export async function postJson<T>(url: string, body: unknown): Promise<T> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 10_000)
  let res: Response
  try {
    res = await fetch(apiUrl(url), { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body), signal: controller.signal })
  } catch (err) {
    clearTimeout(timeout)
    if (err instanceof Error && err.name === 'AbortError') {
      throw new Error('The request timed out. Please try again.')
    }
    throw new Error('We could not reach the server. Check your connection and try again.')
  }
  clearTimeout(timeout)
  const data = (await res.json().catch(() => ({}))) as T & { error?: string; fields?: Record<string, string> }
  if (!res.ok) throw Object.assign(new Error(data.error ?? 'Something went wrong. Please try again.'), { fields: data.fields ?? {} })
  return data
}

export type FieldErrors = Record<string, string>
export const fieldErrors = (e: unknown): FieldErrors => ((e as { fields?: FieldErrors })?.fields ?? {})
