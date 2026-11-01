import { useCallback, useEffect, useState } from 'react'

// Los hábitos se guardan solo en este navegador (localStorage).
const STORAGE_KEY = 'florecer:v1'

// Tres hábitos como máximo: los jardines pequeños se cuidan mejor.
export const MAX_HABITS = 3

// Rosa, melocotón y lavanda: tres tonos que conviven bien en el mismo jardín.
export const FLOWER_COLORS = ['#EC6A9C', '#F09A5B', '#9C86E3']

// Momentos de la rutina que sirven de ancla, de la mañana a la noche.
export const ANCHORS = [
  { icon: 'sunrise', text: 'despertarme' },
  { icon: 'coffee', text: 'servirme el café' },
  { icon: 'sparkles', text: 'lavarme los dientes' },
  { icon: 'cap', text: 'llegar a clase' },
  { icon: 'utensils', text: 'comer' },
  { icon: 'home', text: 'llegar a casa' },
  { icon: 'moon', text: 'cenar' },
  { icon: 'bed', text: 'meterme en la cama' },
]

// Versiones diminutas: se pueden hacer en menos de 30 segundos, incluso en un día malo.
export const TINY_ACTIONS = [
  { icon: 'droplet', text: 'beber un vaso de agua' },
  { icon: 'book', text: 'leer una página' },
  { icon: 'wind', text: 'respirar hondo tres veces' },
  { icon: 'stretch', text: 'estirar los brazos' },
  { icon: 'pen', text: 'escribir una línea en mi diario' },
  { icon: 'heart', text: 'dar las gracias por algo' },
]

export const CELEBRATIONS = [
  { icon: 'message', text: 'diciendo «¡bien hecho!»' },
  { icon: 'smile', text: 'con una sonrisa' },
  { icon: 'zap', text: 'con el puño en alto' },
  { icon: 'music', text: 'con un baile corto' },
]

const findIcon = (list, text, fallback) => list.find((o) => o.text === text)?.icon ?? fallback
export const actionIcon = (text) => findIcon(TINY_ACTIONS, text, 'sprout')
export const anchorIcon = (text) => findIcon(ANCHORS, text, 'sparkles')
export const celebrationIcon = (text) => findIcon(CELEBRATIONS, text, 'sparkles')

// Mezcla un color con blanco (t > 0) o con negro (t < 0). Sirve para degradados y fondos suaves.
export function tint(hex, t) {
  const n = parseInt(hex.slice(1), 16)
  const target = t > 0 ? 255 : 0
  const a = Math.abs(t)
  const ch = (v) => Math.round(v + (target - v) * a)
  const r = ch(n >> 16)
  const g = ch((n >> 8) & 255)
  const b = ch(n & 255)
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`
}

// Etapas de la flor según las veces que has cumplido el hábito.
export const STAGES = [
  { min: 0, name: 'Semilla' },
  { min: 1, name: 'Brote' },
  { min: 3, name: 'Tallo con hojas' },
  { min: 6, name: 'Capullo' },
  { min: 10, name: 'Flor' },
  { min: 21, name: 'Flor en plena floración' },
]

export function stageOf(count) {
  let stage = 0
  STAGES.forEach((s, i) => {
    if (count >= s.min) stage = i
  })
  return stage
}

// Veces que faltan para la siguiente etapa (null si ya está en la última).
export function toNextStage(count) {
  const next = STAGES[stageOf(count) + 1]
  return next ? next.min - count : null
}

// Momento del día: cambia el saludo, el cielo del jardín y el icono.
export function dayPart(now) {
  const h = now.getHours()
  if (h >= 6 && h < 12) return { key: 'morning', hello: 'Buenos días', icon: 'sunrise' }
  if (h >= 12 && h < 20) return { key: 'afternoon', hello: 'Buenas tardes', icon: 'sun' }
  return { key: 'night', hello: 'Buenas noches', icon: 'moon' }
}

const pad = (n) => String(n).padStart(2, '0')

// Fecha local en formato AAAA-MM-DD, con desplazamiento en días.
export function isoDay(offset = 0, from = new Date()) {
  const d = new Date(from)
  d.setDate(d.getDate() + offset)
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export function daysBetween(a, b) {
  const [ay, am, ad] = a.split('-').map(Number)
  const [by, bm, bd] = b.split('-').map(Number)
  return Math.round((Date.UTC(by, bm - 1, bd) - Date.UTC(ay, am - 1, ad)) / 86400000)
}

export const doneToday = (habit) => habit.log.includes(isoDay(0))

// La flor "espera" cuando lleva al menos un día entero sin regarse. Nunca se marchita.
export function isWaiting(habit) {
  if (doneToday(habit) || habit.log.length === 0) return false
  const last = [...habit.log].sort().at(-1)
  return daysBetween(last, isoDay(0)) >= 2
}

// Últimos 7 días, de más antiguo a hoy.
export function lastWeek(habit) {
  return Array.from({ length: 7 }, (_, i) => {
    const day = isoDay(i - 6)
    return { day, done: habit.log.includes(day), today: i === 6 }
  })
}

// Progreso dentro de la etapa actual, de 0 a 1 (1 en la última etapa).
export function stageProgress(count) {
  const stage = stageOf(count)
  const next = STAGES[stage + 1]
  if (!next) return 1
  return (count - STAGES[stage].min) / (next.min - STAGES[stage].min)
}

// Ordena por el momento del día del ancla; los anclas propios van al final.
export function sortByAnchor(a, b) {
  const ia = ANCHORS.findIndex((x) => x.text === a.anchor)
  const ib = ANCHORS.findIndex((x) => x.text === b.anchor)
  return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib) || a.createdAt - b.createdAt
}

// Métrica de la hipótesis: días con al menos un hábito cumplido en los primeros 14 días.
export function firstTwoWeeks(state) {
  if (!state.startedAt) return { active: 0, elapsed: 0 }
  const days = new Set(state.habits.flatMap((h) => h.log))
  let active = 0
  for (let i = 0; i < 14; i++) {
    if (days.has(isoDay(i, new Date(`${state.startedAt}T12:00:00`)))) active++
  }
  const elapsed = Math.min(14, daysBetween(state.startedAt, isoDay(0)) + 1)
  return { active, elapsed }
}

function newId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

const EMPTY = { habits: [], startedAt: null }

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return EMPTY
    const data = JSON.parse(raw)
    return Array.isArray(data.habits) ? { ...EMPTY, ...data } : EMPTY
  } catch {
    return EMPTY
  }
}

// Jardín de ejemplo para enseñar la app: una flor regada hoy, una a medias y una que espera.
function sampleGarden() {
  const days = (offsets) => offsets.map((o) => isoDay(-o))
  const now = Date.now()
  return {
    startedAt: isoDay(-13),
    habits: [
      {
        id: newId(),
        anchor: 'servirme el café',
        action: 'beber un vaso de agua',
        celebration: 'diciendo «¡bien hecho!»',
        color: FLOWER_COLORS[0],
        createdAt: now - 3,
        log: days([0, 1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 13]),
      },
      {
        id: newId(),
        anchor: 'meterme en la cama',
        action: 'leer una página',
        celebration: 'con una sonrisa',
        color: FLOWER_COLORS[1],
        createdAt: now - 2,
        log: days([1, 2, 4, 6, 8]),
      },
      {
        id: newId(),
        anchor: 'llegar a casa',
        action: 'respirar hondo tres veces',
        celebration: 'con el puño en alto',
        color: FLOWER_COLORS[2],
        createdAt: now - 1,
        log: days([3, 4, 7]),
      },
    ],
  }
}

export function useGarden() {
  const [state, setState] = useState(load)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // Sin almacenamiento (modo privado): la app sigue funcionando en memoria.
    }
  }, [state])

  const plant = useCallback((recipe) => {
    setState((s) => {
      if (s.habits.length >= MAX_HABITS) return s
      const used = s.habits.map((h) => h.color)
      const color = FLOWER_COLORS.find((c) => !used.includes(c)) ?? FLOWER_COLORS[0]
      const habit = { id: newId(), ...recipe, color, createdAt: Date.now(), log: [] }
      return { startedAt: s.startedAt ?? isoDay(0), habits: [...s.habits, habit] }
    })
  }, [])

  const edit = useCallback((id, recipe) => {
    setState((s) => ({ ...s, habits: s.habits.map((h) => (h.id === id ? { ...h, ...recipe } : h)) }))
  }, [])

  const remove = useCallback((id) => {
    setState((s) => ({ ...s, habits: s.habits.filter((h) => h.id !== id) }))
  }, [])

  // Marca o desmarca el hábito de hoy.
  const toggleToday = useCallback((id, done) => {
    const today = isoDay(0)
    setState((s) => ({
      ...s,
      habits: s.habits.map((h) => {
        if (h.id !== id) return h
        const log = h.log.filter((d) => d !== today)
        return { ...h, log: done ? [...log, today] : log }
      }),
    }))
  }, [])

  const loadSample = useCallback(() => setState(sampleGarden()), [])
  const reset = useCallback(() => setState(EMPTY), [])

  return { state, plant, edit, remove, toggleToday, loadSample, reset }
}
