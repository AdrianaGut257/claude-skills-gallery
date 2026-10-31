import { useCallback, useEffect, useState } from 'react'

// Las tareas se guardan solo en este navegador (localStorage).
const STORAGE_KEY = 'dayflow:v1'
const DEFAULT_HOURS = 7

export const PRIORITIES = ['alta', 'media', 'baja']
const PRIORITY_ORDER = { alta: 0, media: 1, baja: 2 }

const pad = (n) => String(n).padStart(2, '0')

// Fecha local en formato AAAA-MM-DD, con desplazamiento en días.
export function isoDay(offset = 0) {
  const d = new Date()
  d.setDate(d.getDate() + offset)
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

// "today" | "tomorrow" | "someday"  →  fecha guardada
export function dayToDate(day) {
  if (day === 'today') return isoDay(0)
  if (day === 'tomorrow') return isoDay(1)
  return null
}

// Fecha guardada → lista en la que aparece. Lo atrasado sube a "Hoy".
export function dayOf(task) {
  if (!task.date) return 'someday'
  return task.date <= isoDay(0) ? 'today' : 'tomorrow'
}

export function isOverdue(task) {
  return !task.done && task.date !== null && task.date < isoDay(0)
}

export function formatDuration(minutes) {
  if (!minutes) return ''
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h && m) return `${h} h ${m} min`
  if (h) return `${h} h`
  return `${m} min`
}

// Pendientes primero; después prioridad, hora y orden de creación.
export function sortTasks(a, b) {
  if (a.done !== b.done) return a.done ? 1 : -1
  const byPriority = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
  if (byPriority) return byPriority
  if (a.time !== b.time) {
    if (!a.time) return 1
    if (!b.time) return -1
    return a.time < b.time ? -1 : 1
  }
  return a.createdAt - b.createdAt
}

function newId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export function createTask({ text, day = 'today', priority = 'media', time = null, duration = null }) {
  return {
    id: newId(),
    text,
    date: dayToDate(day),
    priority,
    time,
    duration,
    done: false,
    doneOn: null,
    createdAt: Date.now(),
  }
}

function isValidTask(t) {
  return t && typeof t.id === 'string' && typeof t.text === 'string' && PRIORITIES.includes(t.priority)
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw)
    if (!Array.isArray(data.tasks)) return null
    const hours = Number(data.hours)
    return {
      tasks: data.tasks.filter(isValidTask),
      hours: hours >= 1 && hours <= 16 ? hours : DEFAULT_HOURS,
    }
  } catch {
    return null
  }
}

export function useDayflowStore() {
  const [state, setState] = useState(() => load() ?? { tasks: [], hours: DEFAULT_HOURS })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // Sin almacenamiento disponible (p. ej. modo privado): la app sigue funcionando en memoria.
    }
  }, [state])

  const addTask = useCallback(
    (fields) => setState((s) => ({ ...s, tasks: [...s.tasks, createTask(fields)] })),
    [],
  )

  const addTasks = useCallback(
    (list) => setState((s) => ({ ...s, tasks: [...s.tasks, ...list.map(createTask)] })),
    [],
  )

  const updateTask = useCallback(
    (id, patch) =>
      setState((s) => ({ ...s, tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)) })),
    [],
  )

  const setDone = useCallback(
    (id, done) => updateTask(id, { done, doneOn: done ? isoDay(0) : null }),
    [updateTask],
  )

  const deleteTask = useCallback(
    (id) => setState((s) => ({ ...s, tasks: s.tasks.filter((t) => t.id !== id) })),
    [],
  )

  const restoreTask = useCallback(
    (task) => setState((s) => ({ ...s, tasks: [...s.tasks, task] })),
    [],
  )

  const replaceTasks = useCallback((tasks) => setState((s) => ({ ...s, tasks })), [])

  const setHours = useCallback(
    (hours) => setState((s) => ({ ...s, hours: Math.min(16, Math.max(1, hours)) })),
    [],
  )

  return {
    tasks: state.tasks,
    hours: state.hours,
    addTask,
    addTasks,
    updateTask,
    setDone,
    deleteTask,
    restoreTask,
    replaceTasks,
    setHours,
  }
}
