import { useEffect, useState } from 'react'
import { ANIME, GENRES, SEED_LIST, animeById } from './data.js'

const KEY = 'sakura-list-v1'

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY))
    if (Array.isArray(saved)) return saved.filter((e) => animeById[e.id])
  } catch {
    /* sin almacenamiento: lista de ejemplo */
  }
  return SEED_LIST
}

export function useList() {
  const [list, setList] = useState(load)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(list))
    } catch {
      /* modo privado */
    }
  }, [list])

  const update = (id, patch) => setList((l) => l.map((e) => (e.id === id ? { ...e, ...patch } : e)))

  return {
    list,
    setStatus: (id, status) =>
      update(id, status === 'completado' ? { status, progress: animeById[id].episodes } : { status }),
    setProgress: (id, progress) =>
      update(id, { progress: Math.max(0, Math.min(progress, animeById[id].episodes)) }),
    rate: (id, rating) => update(id, { rating }),
    add: (id, status = 'pendiente') =>
      setList((l) => (l.some((e) => e.id === id) ? l : [...l, { id, status, progress: 0, rating: 0 }])),
    remove: (id) => setList((l) => l.filter((e) => e.id !== id)),
    restore: (entry) => setList((l) => l.map((e) => (e.id === entry.id ? entry : e))),
    reset: () => setList(SEED_LIST),
  }
}

/**
 * Perfil de géneros: cada anime de tu lista suma a sus géneros.
 * Pesa más lo que terminaste o puntuaste alto; lo abandonado resta.
 */
export function genreProfile(list) {
  const score = Object.fromEntries(GENRES.map((g) => [g, 0]))
  for (const e of list) {
    const base = e.status === 'abandonado' ? -1 : e.status === 'pendiente' ? 0.5 : 1
    const weight = base * (e.rating ? 0.6 + e.rating * 0.2 : 1)
    for (const g of animeById[e.id].genres) score[g] += weight
  }
  const max = Math.max(...Object.values(score), 1)
  return GENRES.map((g) => ({ genre: g, score: score[g], share: Math.max(0, score[g]) / max }))
    .sort((a, b) => b.score - a.score)
}

/** Recomendaciones: lo que no está en tu lista, ordenado por afinidad con tus géneros. */
export function recommendations(list, skipped = []) {
  const profile = Object.fromEntries(genreProfile(list).map((p) => [p.genre, p.score]))
  return ANIME.filter((a) => !list.some((e) => e.id === a.id) && !skipped.includes(a.id))
    .map((a) => {
      const best = [...a.genres].sort((x, y) => profile[y] - profile[x])[0]
      return { anime: a, score: a.genres.reduce((s, g) => s + profile[g], 0), because: best }
    })
    .sort((x, y) => y.score - x.score)
}
