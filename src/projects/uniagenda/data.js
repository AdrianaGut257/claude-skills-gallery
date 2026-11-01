// Datos de ejemplo de UniAgenda: un semestre de Ingeniería Informática.
// Los docentes y las aulas son inventados. Todo va en hora de Bolivia.

export const TZ = 'America/La_Paz'

// Periodos de 1 h 30 min, de 06:45 a 21:45.
export const PERIODS = [
  ['06:45', '08:15'],
  ['08:15', '09:45'],
  ['09:45', '11:15'],
  ['11:15', '12:45'],
  ['12:45', '14:15'],
  ['14:15', '15:45'],
  ['15:45', '17:15'],
  ['17:15', '18:45'],
  ['18:45', '20:15'],
  ['20:15', '21:45'],
]

export const DAYS = [
  { n: 1, short: 'Lu', long: 'lunes' },
  { n: 2, short: 'Ma', long: 'martes' },
  { n: 3, short: 'Mi', long: 'miércoles' },
  { n: 4, short: 'Ju', long: 'jueves' },
  { n: 5, short: 'Vi', long: 'viernes' },
  { n: 6, short: 'Sá', long: 'sábado' },
]

// "tone" elige el color de la materia (ver --ua-s-* en uniagenda.css).
export const SUBJECTS = [
  { id: 'cal', name: 'Cálculo II', code: 'CAL II', tone: 'blue', teacher: 'Lic. Marcela Rojas', group: 'Grupo 3' },
  { id: 'fis', name: 'Física II', code: 'FIS II', tone: 'teal', teacher: 'Ing. Jorge Céspedes', group: 'Grupo 1' },
  { id: 'ed', name: 'Estructura de Datos', code: 'ED', tone: 'violet', teacher: 'Ing. Carla Vargas', group: 'Grupo 2' },
  { id: 'alg', name: 'Álgebra Lineal', code: 'ALG', tone: 'amber', teacher: 'Lic. Rodrigo Mendoza', group: 'Grupo 4' },
  { id: 'bd', name: 'Base de Datos I', code: 'BD I', tone: 'pink', teacher: 'Ing. Paola Quiroga', group: 'Grupo 1' },
  { id: 'ing', name: 'Inglés II', code: 'ING', tone: 'green', teacher: 'Lic. Daniel Arce', group: 'Grupo 6' },
]

export const subjectById = Object.fromEntries(SUBJECTS.map((s) => [s.id, s]))

// Horario semanal (1 = lunes … 6 = sábado).
export const SCHEDULE = [
  { subject: 'cal', day: 1, period: 0, kind: 'Teoría', room: 'Aula 690A' },
  { subject: 'ed', day: 1, period: 2, kind: 'Teoría', room: 'Aula 691C' },
  { subject: 'fis', day: 1, period: 5, kind: 'Teoría', room: 'Aula 623' },
  { subject: 'alg', day: 2, period: 1, kind: 'Teoría', room: 'Aula 612' },
  { subject: 'bd', day: 2, period: 3, kind: 'Teoría', room: 'Aula 691B' },
  { subject: 'ed', day: 2, period: 6, kind: 'Laboratorio', room: 'Lab. de Cómputo 3' },
  { subject: 'cal', day: 3, period: 0, kind: 'Teoría', room: 'Aula 690A' },
  { subject: 'fis', day: 3, period: 2, kind: 'Laboratorio', room: 'Lab. de Física 1' },
  { subject: 'ing', day: 3, period: 4, kind: 'Teoría', room: 'Aula 607' },
  { subject: 'alg', day: 4, period: 1, kind: 'Teoría', room: 'Aula 612' },
  { subject: 'bd', day: 4, period: 3, kind: 'Teoría', room: 'Aula 691B' },
  { subject: 'ed', day: 4, period: 5, kind: 'Teoría', room: 'Aula 691C' },
  { subject: 'cal', day: 5, period: 0, kind: 'Práctica', room: 'Aula 625' },
  { subject: 'fis', day: 5, period: 2, kind: 'Teoría', room: 'Aula 623' },
  { subject: 'bd', day: 5, period: 6, kind: 'Laboratorio', room: 'Lab. de Cómputo 1' },
  { subject: 'ing', day: 6, period: 1, kind: 'Teoría', room: 'Aula 607' },
  { subject: 'alg', day: 6, period: 2, kind: 'Práctica', room: 'Aula 612' },
].map((c, i) => ({ ...c, id: `c${i}`, start: PERIODS[c.period][0], end: PERIODS[c.period][1] }))

/* ---------- Fechas y horas ---------- */

const WEEKDAY = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7 }

/** Fecha (AAAA-MM-DD), minutos desde medianoche y día de la semana en Bolivia. */
export function laPazNow(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
    weekday: 'short',
  }).formatToParts(date)
  const get = (type) => parts.find((p) => p.type === type).value
  return {
    iso: `${get('year')}-${get('month')}-${get('day')}`,
    minutes: Number(get('hour')) * 60 + Number(get('minute')),
    weekday: WEEKDAY[get('weekday')],
  }
}

const utc = (iso) => Date.UTC(+iso.slice(0, 4), +iso.slice(5, 7) - 1, +iso.slice(8, 10))

export function addDays(iso, n) {
  return new Date(utc(iso) + n * 864e5).toISOString().slice(0, 10)
}

export function daysBetween(fromIso, toIso) {
  return Math.round((utc(toIso) - utc(fromIso)) / 864e5)
}

/** 1 = lunes … 7 = domingo */
export function weekdayOf(iso) {
  return new Date(utc(iso)).getUTCDay() || 7
}

export const toMin = (hhmm) => Number(hhmm.slice(0, 2)) * 60 + Number(hhmm.slice(3, 5))
export const toHHMM = (min) =>
  `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`

const longDate = new Intl.DateTimeFormat('es-BO', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' })
const shortDate = new Intl.DateTimeFormat('es-BO', { day: 'numeric', month: 'short', timeZone: 'UTC' })
const weekdayName = new Intl.DateTimeFormat('es-BO', { weekday: 'long', timeZone: 'UTC' })

export const formatLong = (iso) => longDate.format(new Date(utc(iso)))
export const formatShort = (iso) => shortDate.format(new Date(utc(iso))).replace('.', '')

/** "Hoy", "Mañana", "El jueves", "En 9 días", "Ayer", "Hace 3 días" */
export function relativeDay(iso, todayIso) {
  const d = daysBetween(todayIso, iso)
  if (d === 0) return 'Hoy'
  if (d === 1) return 'Mañana'
  if (d === -1) return 'Ayer'
  if (d < 0) return `Hace ${-d} días`
  if (d < 7) {
    const name = weekdayName.format(new Date(utc(iso)))
    return `El ${name}`
  }
  return `En ${d} días`
}

export function durationLabel(minutes) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (!h) return `${m} min`
  return m ? `${h} h ${m} min` : `${h} h`
}

/* ---------- Datos iniciales, relativos al día de hoy ---------- */

export function seedState(todayIso) {
  const d = (n) => addDays(todayIso, n)
  return {
    version: 1,
    seededOn: todayIso,
    examWeek: false,
    tasks: [
      { id: 't1', title: 'Práctica 3: árboles AVL', subject: 'ed', due: d(1), time: '23:59', priority: 'alta', minutes: 240, done: false },
      { id: 't2', title: 'Informe de laboratorio 4: péndulo físico', subject: 'fis', due: d(2), time: '23:59', priority: 'alta', minutes: 180, done: false },
      { id: 't3', title: 'Ejercicios 5.1 a 5.18', subject: 'cal', due: d(3), time: '06:45', priority: 'normal', minutes: 120, done: false },
      { id: 't4', title: 'Modelo entidad-relación del proyecto', subject: 'bd', due: d(5), time: '23:59', priority: 'normal', minutes: 180, done: false },
      { id: 't5', title: 'Writing: "My ideal job"', subject: 'ing', due: d(6), time: '08:15', priority: 'normal', minutes: 60, done: false },
      { id: 't6', title: 'Guía de sistemas de ecuaciones', subject: 'alg', due: d(9), time: '23:59', priority: 'normal', minutes: 120, done: false },
      { id: 't7', title: 'Lectura del capítulo 3', subject: 'alg', due: d(-1), time: '23:59', priority: 'normal', minutes: 45, done: false },
      { id: 't8', title: 'Cuestionario 2 en la plataforma', subject: 'bd', due: d(-2), time: '23:59', priority: 'normal', minutes: 30, done: true },
    ],
    exams: [
      { id: 'e1', title: 'Primer parcial', subject: 'cal', date: d(5), time: '06:45', room: 'Aula 690A', topics: ['Integrales dobles', 'Cambio de variable', 'Coordenadas polares'], goal: 6, sessions: 2 },
      { id: 'e2', title: 'Examen de laboratorio', subject: 'fis', date: d(9), time: '09:45', room: 'Lab. de Física 1', topics: ['Péndulo físico', 'Errores de medición'], goal: 4, sessions: 0 },
      { id: 'e3', title: 'Primer parcial', subject: 'ed', date: d(12), time: '14:15', room: 'Aula 691C', topics: ['Listas enlazadas', 'Pilas y colas', 'Árboles AVL'], goal: 6, sessions: 1 },
      { id: 'e4', title: 'Segundo parcial', subject: 'alg', date: d(16), time: '08:15', room: 'Aula 612', topics: ['Espacios vectoriales', 'Transformaciones lineales'], goal: 5, sessions: 0 },
    ],
    blocks: [], // bloques de estudio reservados desde los recordatorios
    focusLog: [], // { date, exam, minutes }
    dismissed: [],
  }
}
