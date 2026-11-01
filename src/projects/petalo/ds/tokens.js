// Tokens de Pétalo DS. Es el único archivo del sistema con valores de color.
//
// Dos capas:
//   1. Primitivos: la paleta completa, con nombres de tono y paso ("lila-600").
//      No dicen para qué sirven y ningún componente los usa directamente.
//   2. Semánticos: dicen para qué sirve cada color ("accent", "text-muted").
//      Cada tema asigna un primitivo a cada token semántico.
//
// Los componentes solo leen variables CSS semánticas (--pt-accent, --pt-text…).
// Por eso añadir o cambiar un tema no obliga a tocar ningún componente.

export const PRIMITIVES = {
  lila: {
    50: '#F7F3FF',
    100: '#EFE6FF',
    200: '#E0D0FF',
    300: '#C9A7FF',
    400: '#AE84FA',
    500: '#9263F0',
    600: '#7A4BDB',
    700: '#6438B8',
    800: '#4E2C8F',
    900: '#372066',
  },
  rosa: {
    50: '#FFF1F6',
    100: '#FFDDEA',
    200: '#FFBBD5',
    300: '#FF8FBA',
    400: '#FF5FA2',
    500: '#F03D87',
    600: '#CF2A6E',
    700: '#A81F58',
    800: '#7F1843',
    900: '#56112E',
  },
  neutro: {
    0: '#FFFFFF',
    25: '#FCFAFF',
    50: '#F6F3FB',
    100: '#ECE7F4',
    200: '#DCD5E8',
    300: '#C2B9D2',
    400: '#9C93AF',
    500: '#7A718D',
    600: '#5E566F',
    700: '#463F55',
    800: '#2E2939',
    900: '#1E1A27',
    950: '#13101A',
  },
  // verde-600 era #1F8A4C (4,37:1 sobre blanco). La auditoría lo marcó y se oscureció.
  verde: { 100: '#DDF5E6', 400: '#4CC27F', 600: '#187A42', 900: '#12301F' },
  // ambar-600 y rojo-600 también se oscurecieron: sobre su fondo suave no llegaban a 4,5:1.
  ambar: { 100: '#FFF0D1', 400: '#F2A93B', 600: '#945600', 900: '#33240A' },
  rojo: { 100: '#FFE1DE', 400: '#F26B61', 600: '#B82A26', 900: '#3A1513' },
}

// "lila-600" → "#7A4BDB"
export function primitive(name) {
  const [family, step] = name.split('-')
  return PRIMITIVES[family]?.[step]
}

// Lista plana de primitivos: [{ name: 'lila-600', hex: '#7A4BDB' }, …]
export const PRIMITIVE_LIST = Object.entries(PRIMITIVES).flatMap(([family, steps]) =>
  Object.entries(steps).map(([step, hex]) => ({ name: `${family}-${step}`, family, step, hex })),
)

// Tokens semánticos. "pairs" lista los fondos sobre los que se usa un token de texto;
// la auditoría de contraste los lee para saber qué pares comprobar.
export const SEMANTIC = [
  { token: 'bg', use: 'Fondo de la página', light: 'neutro-25', dark: 'neutro-950' },
  { token: 'surface', use: 'Tarjetas, paneles y campos', light: 'neutro-0', dark: 'neutro-900' },
  { token: 'surface-sunken', use: 'Zonas hundidas: código, vistas previas', light: 'neutro-50', dark: 'neutro-950' },
  { token: 'border', use: 'Bordes y separadores', light: 'neutro-100', dark: 'neutro-800' },
  { token: 'border-strong', use: 'Bordes de campos y controles', light: 'neutro-300', dark: 'neutro-600' },
  { token: 'text', use: 'Texto principal', light: 'neutro-900', dark: 'neutro-50', pairs: ['surface', 'bg'] },
  { token: 'text-muted', use: 'Texto secundario', light: 'neutro-600', dark: 'neutro-300', pairs: ['surface', 'surface-sunken'] },
  { token: 'text-subtle', use: 'Solo texto grande o decorativo', light: 'neutro-500', dark: 'neutro-400', pairs: ['surface'], large: true },
  { token: 'accent', use: 'Acción principal y enlaces', light: 'lila-600', dark: 'lila-300', pairs: ['surface'] },
  { token: 'accent-hover', use: 'Acción principal al pasar el cursor', light: 'lila-700', dark: 'lila-200' },
  { token: 'on-accent', use: 'Texto sobre la acción principal', light: 'neutro-0', dark: 'neutro-950', pairs: ['accent'] },
  { token: 'accent-soft', use: 'Fondo suave de la acción', light: 'lila-50', dark: 'lila-900' },
  { token: 'accent-soft-text', use: 'Texto sobre el fondo suave', light: 'lila-700', dark: 'lila-200', pairs: ['accent-soft'] },
  { token: 'highlight', use: 'Detalles de marca, nunca texto', light: 'rosa-400', dark: 'rosa-300' },
  { token: 'focus', use: 'Anillo de foco', light: 'lila-500', dark: 'lila-300' },
  { token: 'success', use: 'Texto de éxito', light: 'verde-600', dark: 'verde-400', pairs: ['surface', 'success-soft'] },
  { token: 'success-soft', use: 'Fondo de éxito', light: 'verde-100', dark: 'verde-900' },
  { token: 'warning', use: 'Texto de advertencia', light: 'ambar-600', dark: 'ambar-400', pairs: ['surface', 'warning-soft'] },
  { token: 'warning-soft', use: 'Fondo de advertencia', light: 'ambar-100', dark: 'ambar-900' },
  { token: 'danger', use: 'Texto de error', light: 'rojo-600', dark: 'rojo-400', pairs: ['surface', 'danger-soft'] },
  { token: 'danger-soft', use: 'Fondo de error', light: 'rojo-100', dark: 'rojo-900' },
]

export const THEMES = ['light', 'dark']

// Valor final de un token semántico en un tema: "accent" + "dark" → "#C9A7FF"
export function resolve(token, theme) {
  const entry = SEMANTIC.find((s) => s.token === token)
  return entry ? primitive(entry[theme]) : undefined
}

// Escala tipográfica. Los tamaños grandes son fluidos con clamp(): crecen con la
// pantalla entre un mínimo y un máximo, sin saltos entre puntos de corte.
export const TYPE_SCALE = [
  { token: 'display', size: 'clamp(2.75rem, 1.9rem + 3.6vw, 4.5rem)', line: 1.02, weight: 650, tracking: '-0.045em', use: 'Portadas' },
  { token: 'h1', size: 'clamp(2.1rem, 1.7rem + 1.6vw, 2.9rem)', line: 1.08, weight: 650, tracking: '-0.035em', use: 'Título de página' },
  { token: 'h2', size: 'clamp(1.45rem, 1.3rem + 0.6vw, 1.8rem)', line: 1.2, weight: 600, tracking: '-0.025em', use: 'Secciones' },
  { token: 'h3', size: '1.125rem', line: 1.35, weight: 600, tracking: '-0.01em', use: 'Subsecciones' },
  { token: 'body', size: '1rem', line: 1.65, weight: 400, tracking: '0', use: 'Texto de lectura' },
  { token: 'small', size: '0.875rem', line: 1.5, weight: 400, tracking: '0', use: 'Ayudas y metadatos' },
  { token: 'code', size: '0.875rem', line: 1.65, weight: 400, tracking: '0', use: 'Código', mono: true },
]

// Variables CSS de un tema, listas para el atributo style:
// { '--pt-accent': '#7A4BDB', '--pt-h1-size': 'clamp(…)', … }
export function cssVars(theme) {
  const colors = SEMANTIC.map((s) => [`--pt-${s.token}`, primitive(s[theme])])
  const type = TYPE_SCALE.flatMap((t) => [
    [`--pt-${t.token}-size`, t.size],
    [`--pt-${t.token}-line`, String(t.line)],
    [`--pt-${t.token}-weight`, String(t.weight)],
    [`--pt-${t.token}-tracking`, t.tracking],
  ])
  return Object.fromEntries([...colors, ...type])
}

// Escalas no cromáticas. Son iguales en los dos temas.
export const SPACE = [4, 8, 12, 16, 24, 32, 48, 64]
export const RADIUS = [
  { token: 'radius-sm', px: 6, use: 'Badges y chips' },
  { token: 'radius-md', px: 10, use: 'Botones y campos' },
  { token: 'radius-lg', px: 16, use: 'Tarjetas y paneles' },
  { token: 'radius-full', px: 999, use: 'Interruptores y avatares' },
]
