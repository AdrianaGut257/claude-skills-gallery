// Estado de la partida: un reducer con las fases del juego y guardado en el navegador.
import { MAX_PLAYERS, DEFAULT_CATEGORIES, PLAYER_COLORS, scoreRound } from './logic.js'

const STORAGE_KEY = 'basta:v1'

// Fases: setup → spin → handoff → turn → (handoff → turn)… → review → scores → spin… → final
export const initialState = {
  phase: 'setup',
  settings: {
    players: [],
    categories: DEFAULT_CATEGORIES,
    rounds: 3,
    seconds: 90,
    hardLetters: false,
    sound: true,
  },
  game: null,
}

function newGame(settings) {
  const totals = {}
  settings.players.forEach((p) => {
    totals[p.id] = 0
  })
  return {
    round: 1,
    letter: null,
    usedLetters: [],
    turn: 0,
    answers: {},
    bastaTimes: {},
    rejected: {},
    totals,
    history: [],
  }
}

export function reducer(state, action) {
  const { settings, game } = state
  switch (action.type) {
    case 'settings':
      return { ...state, settings: { ...settings, ...action.patch } }

    case 'addPlayer': {
      if (settings.players.length >= MAX_PLAYERS) return state
      const used = settings.players.map((p) => p.color)
      const color = PLAYER_COLORS.find((c) => !used.includes(c)) ?? PLAYER_COLORS[0]
      const player = { id: `p${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`, name: action.name, color }
      return { ...state, settings: { ...settings, players: [...settings.players, player] } }
    }

    case 'removePlayer':
      return {
        ...state,
        settings: { ...settings, players: settings.players.filter((p) => p.id !== action.id) },
      }

    case 'start':
      return { ...state, phase: 'spin', game: newGame(settings) }

    case 'letter':
      return { ...state, game: { ...game, letter: action.letter, usedLetters: [...game.usedLetters, action.letter] } }

    case 'beginTurns':
      return { ...state, phase: 'handoff', game: { ...game, turn: 0, answers: {}, bastaTimes: {}, rejected: {} } }

    case 'startTurn':
      return { ...state, phase: 'turn' }

    case 'endTurn': {
      const player = settings.players[game.turn]
      const answers = { ...game.answers, [player.id]: action.answers }
      const bastaTimes = { ...game.bastaTimes, [player.id]: action.secondsLeft }
      const last = game.turn + 1 >= settings.players.length
      return {
        ...state,
        phase: last ? 'review' : 'handoff',
        game: { ...game, answers, bastaTimes, turn: last ? game.turn : game.turn + 1 },
      }
    }

    case 'toggleReject': {
      const rejected = { ...game.rejected }
      if (rejected[action.key]) delete rejected[action.key]
      else rejected[action.key] = true
      return { ...state, game: { ...game, rejected } }
    }

    case 'confirmRound': {
      const { cells, totals: roundTotals } = scoreRound({
        players: settings.players,
        categories: settings.categories,
        letter: game.letter,
        answers: game.answers,
        rejected: game.rejected,
      })
      const totals = { ...game.totals }
      Object.entries(roundTotals).forEach(([id, pts]) => {
        totals[id] = (totals[id] ?? 0) + pts
      })
      const entry = { round: game.round, letter: game.letter, points: roundTotals, cells }
      return { ...state, phase: 'scores', game: { ...game, totals, history: [...game.history, entry] } }
    }

    case 'nextRound':
      return { ...state, phase: 'spin', game: { ...game, round: game.round + 1, letter: null } }

    case 'finish':
      return { ...state, phase: 'final' }

    case 'rematch':
      return { ...state, phase: 'spin', game: newGame(settings) }

    case 'quit':
      return { ...state, phase: 'setup', game: null }

    default:
      return state
  }
}

// Al recargar en mitad de un turno, se vuelve a la pantalla de "pasa el móvil" de ese jugador.
export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return initialState
    const saved = JSON.parse(raw)
    const settings = { ...initialState.settings, ...saved.settings }
    if (!Array.isArray(settings.players) || !Array.isArray(settings.categories)) return initialState
    // Jugadores guardados con la paleta anterior: se les asigna un color de la actual.
    settings.players = settings.players.map((p, i) =>
      PLAYER_COLORS.includes(p.color) ? p : { ...p, color: PLAYER_COLORS[i % PLAYER_COLORS.length] },
    )
    let phase = saved.phase ?? 'setup'
    if (!saved.game) phase = 'setup'
    if (phase === 'turn') phase = 'handoff'
    return { phase, settings, game: saved.game ?? null }
  } catch {
    return initialState
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Sin almacenamiento: el juego sigue funcionando, solo que no se recupera al recargar.
  }
}
