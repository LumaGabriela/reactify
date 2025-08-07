import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
export function darkenColor(hexColor, factor) {
  // Remove o '#' se presente
  let hex = hexColor.replace('#', '')

  // Converte R, G, B para valores decimais
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)

  // Aplica o fator de escurecimento e arredonda
  const newR = Math.round(r * factor)
  const newG = Math.round(g * factor)
  const newB = Math.round(b * factor)

  // Converte de volta para hexadecimal e garante 2 dígitos
  const toHex = (c) => ('0' + c.toString(16)).slice(-2)

  return `#${toHex(newR)}${toHex(newG)}${toHex(newB)}`
}
