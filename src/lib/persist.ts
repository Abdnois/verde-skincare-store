import { useCallback, useState } from 'react'

/** useState that survives reloads. Bad or missing data falls back to `initial`. */
type Updater<T> = (prev: T) => T

export function usePersistent<T>(
  key: string,
  initial: T,
  validate?: (value: unknown) => value is T,
  legacyKey?: string,
): readonly [T, (next: T | Updater<T>) => void] {
  const migratedKey = legacyKey && !localStorage.getItem(key) && localStorage.getItem(legacyKey) ? legacyKey : key

  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(migratedKey)
      if (raw == null) return initial
      const parsed: unknown = JSON.parse(raw)
      return validate && !validate(parsed) ? initial : (parsed as T)
    } catch {
      return initial
    }
  })

  const set: (next: T | Updater<T>) => void = useCallback(
    (next) => {
      setValue((prev) => {
        const nextValue = typeof next === 'function' ? (next as Updater<T>)(prev) : next
        let effectiveNextValue = nextValue
        try {
          if (migratedKey && migratedKey !== key && !localStorage.getItem(key) && localStorage.getItem(migratedKey) != null) {
            const migratedRaw = localStorage.getItem(migratedKey)
            if (migratedRaw != null) {
              localStorage.setItem(key, migratedRaw)
              localStorage.removeItem(migratedKey)
            }
          }
        } catch {
          // Storage full or blocked: keep using the legacy slot for this visit.
        }
        try {
          localStorage.setItem(key, JSON.stringify(effectiveNextValue))
        } catch {
          // Storage full or blocked: the app keeps working for this visit.
        }
        return effectiveNextValue
      })
    },
    [key, migratedKey],
  )

  return [value, set] as const
}
