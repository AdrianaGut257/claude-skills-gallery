import { useEffect, useRef, useState } from 'react'
import { Icon } from './icons.jsx'

// Monta la escena 3D de la taza. three.js se carga aparte (import dinámico),
// así el texto de la portada aparece antes que la taza.
export default function CupCanvas({ drink }) {
  const canvasRef = useRef(null)
  const sceneRef = useRef(null)
  const [status, setStatus] = useState('loading') // 'loading' | 'ready' | 'error'

  useEffect(() => {
    let cancelled = false
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    import('./cupScene.js')
      .then(({ createCupScene }) => {
        if (cancelled || !canvasRef.current) return
        sceneRef.current = createCupScene(canvasRef.current, {
          drink,
          reducedMotion,
          onReady: () => !cancelled && setStatus('ready'),
        })
      })
      .catch(() => !cancelled && setStatus('error'))

    return () => {
      cancelled = true
      sceneRef.current?.dispose()
      sceneRef.current = null
    }
    // La escena se crea una sola vez; los cambios de bebida van por setDrink.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    sceneRef.current?.setDrink(drink)
  }, [drink])

  return (
    <div className="lb-cup" data-status={status}>
      <span className="lb-cup-glow" aria-hidden="true" />
      <canvas
        ref={canvasRef}
        className="lb-cup-canvas"
        role="img"
        aria-label={`Taza de cerámica terracota con ${drink} humeante sobre su plato. Arrastra para girarla.`}
      />
      {status === 'error' && (
        <p className="lb-cup-fallback">
          <Icon name="coffee" size={28} />
          Tu navegador no puede mostrar la taza en 3D, pero el café sigue caliente.
        </p>
      )}
    </div>
  )
}
