import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Convierte un texto en un slug SEO-friendly:
 *   "Pizzas & Pastas Italianas" → "pizzas-pastas-italianas"
 *
 * - Normaliza acentos (NFD) y los elimina
 * - Reemplaza espacios y símbolos por guiones
 * - Quita guiones al inicio/fin
 * - Colapsa guiones múltiples
 */
export function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // quitar combining diacritical marks (acentos)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // solo alfanuméricos, espacios y guiones
    .replace(/\s+/g, '-') // espacios → guiones
    .replace(/-+/g, '-') // colapsar guiones consecutivos
    .replace(/^-+|-+$/g, '') // sin guiones en los bordes
}
