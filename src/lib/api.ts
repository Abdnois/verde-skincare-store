/** POST JSON to a Worker route; throws the route's `error` message on failure. */
export async function postJson<T>(url: string, body: unknown): Promise<T> {
  let res: Response
  try {
    res = await fetch(url, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) })
  } catch {
    throw new Error('We could not reach the server. Check your connection and try again.')
  }
  const data = (await res.json().catch(() => ({}))) as T & { error?: string; fields?: Record<string, string> }
  if (!res.ok) throw Object.assign(new Error(data.error ?? 'Something went wrong. Please try again.'), { fields: data.fields ?? {} })
  return data
}

export type FieldErrors = Record<string, string>
export const fieldErrors = (e: unknown): FieldErrors => ((e as { fields?: FieldErrors })?.fields ?? {})
