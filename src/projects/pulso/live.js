import { useEffect, useRef, useState } from 'react'

// Serie en "tiempo real" simulada: peticiones por minuto a la API, un paseo aleatorio con algo de ciclo.
function next(prev, t) {
  const target = 420 + Math.sin(t / 9) * 90
  const v = prev + (target - prev) * 0.18 + (Math.random() - 0.5) * 70
  return Math.round(Math.max(180, Math.min(760, v)))
}

/**
 * Devuelve la serie y un contador de ticks. Se pausa con la pestaña oculta
 * y cuando el gráfico no está a la vista (ref observado).
 */
export function useLiveSeries(ref, { length = 36, interval = 2000 } = {}) {
  const [state, setState] = useState(() => {
    const pts = []
    let v = 430
    for (let i = 0; i < length; i++) pts.push((v = next(v, i)))
    return { points: pts, t: length, tick: 0 }
  })
  const visible = useRef(true)

  useEffect(() => {
    const el = ref.current
    let io
    if (el && 'IntersectionObserver' in window) {
      io = new IntersectionObserver(([e]) => {
        visible.current = e.isIntersecting
      })
      io.observe(el)
    }
    const id = setInterval(() => {
      if (document.hidden || !visible.current) return
      setState((s) => ({
        points: [...s.points.slice(1), next(s.points[s.points.length - 1], s.t)],
        t: s.t + 1,
        tick: s.tick + 1,
      }))
    }, interval)
    return () => {
      clearInterval(id)
      io?.disconnect()
    }
  }, [ref, interval])

  return state
}
