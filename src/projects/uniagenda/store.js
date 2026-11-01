import { useEffect, useReducer, useState } from 'react'
import { SCHEDULE, addDays, daysBetween, laPazNow, seedState, toHHMM, toMin, weekdayOf } from './data.js'

const KEY = 'uniagenda-v1'

function load(todayIso) {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY))
    // Es una demo: si los datos tienen más de 10 días, se vuelven a generar para que las fechas sigan vivas.
    if (saved?.version === 1 && daysBetween(saved.seededOn, todayIso) <= 10) return saved
  } catch {
    /* sin almacenamiento: se usa la semilla */
  }
  return seedState(todayIso)
}

function reducer(state, action) {
  switch (action.type) {
    case 'toggleTask':
      return {
        ...state,
        tasks: state.tasks.map((t) => (t.id === action.id ? { ...t, done: !t.done } : t)),
      }
    case 'addTask':
      return { ...state, tasks: [...state.tasks, action.task] }
    case 'addBlock':
      return { ...state, blocks: [...state.blocks, action.block] }
    case 'removeBlock':
      return { ...state, blocks: state.blocks.filter((b) => b.id !== action.id) }
    case 'dismiss':
      return { ...state, dismissed: [...state.dismissed, action.key] }
    case 'setExamWeek':
      return { ...state, examWeek: action.value }
    case 'logFocus':
      return {
        ...state,
        focusLog: [...state.focusLog, { date: action.date, exam: action.exam, minutes: action.minutes }],
        exams: state.exams.map((e) => (e.id === action.exam ? { ...e, sessions: e.sessions + 1 } : e)),
      }
    case 'reset':
      return seedState(action.today)
    default:
      return state
  }
}

export function useAgenda() {
  const [state, dispatch] = useReducer(reducer, null, () => load(laPazNow().iso))

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state))
    } catch {
      /* modo privado o almacenamiento lleno: la app sigue funcionando sin guardar */
    }
  }, [state])

  return [state, dispatch]
}

/** Hora de Bolivia que se refresca cada 30 s. */
export function useNow() {
  const [now, setNow] = useState(() => laPazNow())
  useEffect(() => {
    const id = setInterval(() => setNow(laPazNow()), 30_000)
    return () => clearInterval(id)
  }, [])
  return now
}

/* ---------- Horario ---------- */

export function classesOn(iso) {
  const day = weekdayOf(iso)
  return SCHEDULE.filter((c) => c.day === day).sort((a, b) => toMin(a.start) - toMin(b.start))
}

/** Estado de hoy: clase en curso, siguiente y cuántas quedan. */
export function todayStatus(now) {
  const list = classesOn(now.iso)
  const current = list.find((c) => toMin(c.start) <= now.minutes && now.minutes < toMin(c.end)) ?? null
  const next = list.find((c) => toMin(c.start) > now.minutes) ?? null
  const remaining = list.filter((c) => toMin(c.end) > now.minutes)
  return { list, current, next, remaining }
}

/** Primer día con clases a partir de mañana. */
export function nextClassDay(iso) {
  for (let i = 1; i <= 7; i++) {
    const day = addDays(iso, i)
    const list = classesOn(day)
    if (list.length) return { iso: day, list }
  }
  return null
}

/* ---------- Recordatorios inteligentes ---------- */

const DAY_START = 7 * 60
const DAY_END = 21 * 60
const MIN_GAP = 60
const MAX_BLOCK = 90 // un periodo

/** Huecos libres de al menos una hora en un día, contando clases y bloques ya reservados. */
export function freeGaps(iso, fromMinutes, blocks) {
  const busy = [
    ...classesOn(iso).map((c) => [toMin(c.start), toMin(c.end)]),
    ...blocks.filter((b) => b.date === iso).map((b) => [toMin(b.start), toMin(b.end)]),
  ].sort((a, b) => a[0] - b[0])

  const start = Math.max(DAY_START, Math.ceil(fromMinutes / 15) * 15)
  const gaps = []
  let cursor = start
  for (const [s, e] of busy) {
    if (s - cursor >= MIN_GAP) gaps.push([cursor, s])
    cursor = Math.max(cursor, e)
  }
  if (DAY_END - cursor >= MIN_GAP) gaps.push([cursor, DAY_END])
  return gaps
}

/**
 * Sugerencia del día:
 * 1. Una entrega que vence en ≤ 3 días y aún no tiene bloque → el primer hueco libre hoy o mañana.
 * 2. Si no, un examen en ≤ 7 días sin semana de exámenes activa → proponer activarla.
 */
export function smartSuggestion(state, now) {
  const pending = state.tasks
    .filter((t) => !t.done)
    .map((t) => ({ ...t, left: daysBetween(now.iso, t.due) }))
    .filter((t) => t.left >= 0 && t.left <= 3)
    .filter((t) => !state.blocks.some((b) => b.task === t.id))
    .filter((t) => !state.dismissed.includes(`block-${t.id}`))
    .sort((a, b) => a.left - b.left || b.minutes - a.minutes)

  for (const task of pending) {
    for (const offset of [0, 1]) {
      const date = addDays(now.iso, offset)
      if (daysBetween(date, task.due) < 0) continue
      const from = offset === 0 ? now.minutes + 15 : 0
      const gap = freeGaps(date, from, state.blocks)[0]
      if (gap) {
        const length = Math.min(gap[1] - gap[0], MAX_BLOCK)
        return {
          kind: 'block',
          key: `block-${task.id}`,
          task,
          block: { date, start: toHHMM(gap[0]), end: toHHMM(gap[0] + length), task: task.id },
          offset,
          gapMinutes: gap[1] - gap[0],
        }
      }
    }
  }

  const exam = upcomingExams(state, now.iso)[0]
  if (exam && exam.left <= 7 && !state.examWeek && !state.dismissed.includes(`week-${exam.id}`)) {
    return { kind: 'examWeek', key: `week-${exam.id}`, exam }
  }
  return null
}

export function upcomingExams(state, todayIso) {
  return state.exams
    .map((e) => ({ ...e, left: daysBetween(todayIso, e.date) }))
    .filter((e) => e.left >= 0)
    .sort((a, b) => a.left - b.left)
}

/** Agrupa las entregas por cercanía. */
export function groupTasks(tasks, todayIso) {
  const groups = [
    { id: 'late', label: 'Vencidas', items: [] },
    { id: 'today', label: 'Hoy', items: [] },
    { id: 'tomorrow', label: 'Mañana', items: [] },
    { id: 'week', label: 'Esta semana', items: [] },
    { id: 'later', label: 'Más adelante', items: [] },
    { id: 'done', label: 'Hechas', items: [] },
  ]
  const byId = Object.fromEntries(groups.map((g) => [g.id, g]))
  for (const t of [...tasks].sort((a, b) => a.due.localeCompare(b.due) || a.time.localeCompare(b.time))) {
    if (t.done) {
      byId.done.items.push(t)
      continue
    }
    const left = daysBetween(todayIso, t.due)
    const id = left < 0 ? 'late' : left === 0 ? 'today' : left === 1 ? 'tomorrow' : left <= 7 ? 'week' : 'later'
    byId[id].items.push(t)
  }
  return groups.filter((g) => g.items.length)
}
