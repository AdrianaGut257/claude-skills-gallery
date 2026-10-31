// Reglas y puntuación de ¡Basta! (tutti frutti)

export const ALL_LETTERS = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('')
export const HARD_LETTERS = ['K', 'Ñ', 'Q', 'W', 'X', 'Y', 'Z']

export const DEFAULT_CATEGORIES = [
  'Nombre',
  'Apellido',
  'País o ciudad',
  'Animal',
  'Fruta o verdura',
  'Color',
  'Cosa',
]

export const EXTRA_CATEGORIES = [
  'Persona famosa',
  'Profesión',
  'Comida',
  'Marca',
  'Película o serie',
  'Deporte',
  'Parte del cuerpo',
  'Instrumento',
]

// Colores vivos que se leen bien sobre el fondo índigo (con inicial oscura encima)
export const PLAYER_COLORS = [
  '#FF4D6D',
  '#2FD8A1',
  '#5B8CFF',
  '#FFD23F',
  '#C084FC',
  '#FF8A3D',
  '#22D3EE',
  '#F9A8D4',
]

export const MAX_PLAYERS = 8
export const MIN_CATEGORIES = 3
export const MAX_CATEGORIES = 12

export const POINTS = { only: 20, unique: 10, repeated: 5, invalid: 0 }

export const REASONS = {
  empty: 'Sin respuesta',
  letter: 'No empieza por la letra',
  rejected: 'Anulada por el grupo',
}

// Minúsculas, sin tildes (pero conservando la ñ), sin signos ni espacios dobles.
export function normalize(text) {
  return text
    .trim()
    .toLowerCase()
    .replace(/#/g, '')
    .replace(/ñ/g, '#')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/#/g, 'ñ')
    .replace(/[^a-zñ0-9 ]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

export function startsWithLetter(text, letter) {
  const n = normalize(text)
  return n.length > 0 && n[0] === normalize(letter)
}

export const answerKey = (playerId, category) => `${playerId}|${category}`

export function letterPool(includeHard) {
  return includeHard ? ALL_LETTERS : ALL_LETTERS.filter((l) => !HARD_LETTERS.includes(l))
}

// Letra al azar que no haya salido aún en la partida (si se agotan, vuelven todas).
export function pickLetter(pool, used) {
  const fresh = pool.filter((l) => !used.includes(l))
  const source = fresh.length ? fresh : pool
  return source[Math.floor(Math.random() * source.length)]
}

// Calcula la puntuación de una ronda.
// Devuelve, por jugador y categoría: { text, status, points, reason } y el total por jugador.
export function scoreRound({ players, categories, letter, answers, rejected }) {
  const cells = {}
  const totals = {}
  players.forEach((p) => {
    cells[p.id] = {}
    totals[p.id] = 0
  })

  for (const category of categories) {
    const entries = players.map((p) => {
      const text = (answers[p.id]?.[category] ?? '').trim()
      let reason = null
      if (!text) reason = 'empty'
      else if (!startsWithLetter(text, letter)) reason = 'letter'
      else if (rejected[answerKey(p.id, category)]) reason = 'rejected'
      return { playerId: p.id, text, norm: normalize(text), reason }
    })

    const valid = entries.filter((e) => !e.reason)
    const counts = {}
    valid.forEach((e) => {
      counts[e.norm] = (counts[e.norm] ?? 0) + 1
    })

    for (const e of entries) {
      let status
      if (e.reason) status = 'invalid'
      else if (players.length > 1 && valid.length === 1) status = 'only'
      else if (counts[e.norm] > 1) status = 'repeated'
      else status = 'unique'
      const points = POINTS[status]
      cells[e.playerId][category] = { text: e.text, status, points, reason: e.reason }
      totals[e.playerId] += points
    }
  }

  return { cells, totals }
}

// Clasificación con empates: mismos puntos, misma posición.
export function ranking(players, totals) {
  const sorted = [...players].sort((a, b) => (totals[b.id] ?? 0) - (totals[a.id] ?? 0))
  let lastScore = null
  let lastPos = 0
  return sorted.map((p, i) => {
    const score = totals[p.id] ?? 0
    if (score !== lastScore) {
      lastPos = i + 1
      lastScore = score
    }
    return { player: p, score, position: lastPos }
  })
}
