import { useEffect, useState } from 'react'
import { productById } from './data.js'

const KEY = 'ecco-bag-v1'

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY))
    if (Array.isArray(saved)) return saved.filter((l) => productById[l.id])
  } catch {
    /* sin almacenamiento: bolsa vacía */
  }
  return []
}

/** Bolsa de compra: líneas { id, size, qty }, guardadas en el navegador. */
export function useBag() {
  const [lines, setLines] = useState(load)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(lines))
    } catch {
      /* modo privado: la bolsa vive solo en esta visita */
    }
  }, [lines])

  const add = (id, size) =>
    setLines((ls) => {
      const found = ls.find((l) => l.id === id && l.size === size)
      if (found) return ls.map((l) => (l === found ? { ...l, qty: Math.min(l.qty + 1, 9) } : l))
      return [...ls, { id, size, qty: 1 }]
    })

  const setQty = (id, size, qty) =>
    setLines((ls) =>
      qty <= 0
        ? ls.filter((l) => !(l.id === id && l.size === size))
        : ls.map((l) => (l.id === id && l.size === size ? { ...l, qty: Math.min(qty, 9) } : l)),
    )

  const totals = lines.reduce(
    (t, l) => {
      const p = productById[l.id]
      return {
        count: t.count + l.qty,
        price: t.price + p.price * l.qty,
        water: t.water + p.water * l.qty,
        co2: t.co2 + p.co2 * l.qty,
      }
    },
    { count: 0, price: 0, water: 0, co2: 0 },
  )

  return { lines, add, setQty, totals }
}

/** true en pantallas de 768 px o más: la bolsa entra por la derecha; si no, desde abajo. */
export function useWide() {
  const query = '(min-width: 768px)'
  const [wide, setWide] = useState(() => window.matchMedia(query).matches)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const onChange = () => setWide(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return wide
}
