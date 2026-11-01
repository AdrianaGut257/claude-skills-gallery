import { PRIMITIVE_LIST, SEMANTIC, resolve } from './tokens.js'

// Contraste de color según WCAG 2.2.
//
// La interfaz pública es pequeña a propósito: contrast(texto, fondo) devuelve la
// relación y si cumple cada nivel. Quien la usa no necesita saber nada de
// luminancia relativa, corrección gamma ni umbrales.

function channel(c) {
  const v = c / 255
  return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
}

function luminance(hex) {
  const n = parseInt(hex.replace('#', ''), 16)
  return 0.2126 * channel(n >> 16) + 0.7152 * channel((n >> 8) & 255) + 0.0722 * channel(n & 255)
}

// Acepta "#abc" y "#aabbcc". Devuelve "#AABBCC" o null si no es un color válido.
export function normalizeHex(value) {
  const v = value.trim().replace(/^#?/, '#')
  if (/^#[0-9a-f]{3}$/i.test(v)) return `#${[...v.slice(1)].map((c) => c + c).join('')}`.toUpperCase()
  if (/^#[0-9a-f]{6}$/i.test(v)) return v.toUpperCase()
  return null
}

/**
 * Calcula el contraste entre un color de texto y un color de fondo.
 * Devuelve { ratio, aa, aaLarge, aaa, aaaLarge }:
 *   ratio     relación de contraste, de 1 a 21, redondeada a dos decimales
 *   aa        true si cumple AA para texto normal (4,5:1)
 *   aaLarge   true si cumple AA para texto grande, 24 px o 19 px en negrita (3:1)
 *   aaa       true si cumple AAA para texto normal (7:1)
 *   aaaLarge  true si cumple AAA para texto grande (4,5:1)
 */
export function contrast(fg, bg) {
  const [a, b] = [luminance(fg), luminance(bg)].sort((x, y) => y - x)
  // Se redondea hacia abajo: 4,499 no debe aparecer como 4,50 y "aprobar".
  const ratio = Math.floor(((a + 0.05) / (b + 0.05)) * 100) / 100
  return { ratio, aa: ratio >= 4.5, aaLarge: ratio >= 3, aaa: ratio >= 7, aaaLarge: ratio >= 4.5 }
}

function distance(h1, h2) {
  const p = (h) => {
    const n = parseInt(h.slice(1), 16)
    return [n >> 16, (n >> 8) & 255, n & 255]
  }
  const [a, b] = [p(h1), p(h2)]
  return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2])
}

/**
 * Sugiere el primitivo de la paleta más parecido a fg que cumple AA sobre bg.
 * Devuelve { name, hex, ratio } o null si fg ya cumple o ningún primitivo lo hace.
 */
export function suggest(fg, bg) {
  if (contrast(fg, bg).aa) return null
  let best = null
  for (const p of PRIMITIVE_LIST) {
    const { ratio, aa } = contrast(p.hex, bg)
    if (!aa) continue
    const d = distance(p.hex, fg)
    if (!best || d < best.d) best = { name: p.name, hex: p.hex, ratio, d }
  }
  return best && { name: best.name, hex: best.hex, ratio: best.ratio }
}

/**
 * Audita todos los tokens de texto de un tema contra el fondo con el que se usan.
 * Un token marcado como "large" solo necesita cumplir AA para texto grande.
 * Devuelve [{ token, pair, fg, bg, ratio, pass, large }].
 */
export function auditTheme(theme) {
  return SEMANTIC.filter((s) => s.pairs).flatMap((s) =>
    s.pairs.map((pair) => {
      const fg = resolve(s.token, theme)
      const bg = resolve(pair, theme)
      const result = contrast(fg, bg)
      return {
        token: s.token,
        pair,
        fg,
        bg,
        ratio: result.ratio,
        large: Boolean(s.large),
        pass: s.large ? result.aaLarge : result.aa,
      }
    }),
  )
}
