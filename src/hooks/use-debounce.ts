'use client'

import { useEffect, useState } from 'react'

/**
 * Devuelve `value` con `delay` ms de retraso desde el último cambio.
 * Útil para búsquedas: mientras el usuario tipea rápido, no se
 * dispara el filtrado en cada tecla, solo cuando pausa.
 *
 * @example
 * const [search, setSearch] = useState('')
 * const debouncedSearch = useDebounce(search, 300)
 * // usar debouncedSearch en el filtro
 */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}
