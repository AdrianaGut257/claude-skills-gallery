import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { buildMolecule, layoutMolecules } from './molecules.js'

// Objetos fijos fuera del componente: si cambiaran en cada render, Fiber volvería a aplicarlos.
// Tono "Neutral": respeta los colores de marca de cada proyecto mejor que ACES.
const GL = { antialias: true, alpha: true, toneMapping: THREE.NeutralToneMapping }
const CAMERA = { position: [0, 0, 14], fov: 30, near: 0.1, far: 60 }
const WALL_Z = -1.4 // pared de papel invisible que recibe las sombras
const STICK_R = 0.036
const Y_AXIS = new THREE.Vector3(0, 1, 0)

// Escrituras imperativas (DOM y escena) fuera de los componentes, como pide el lint de React.
function placeTag(el, x, y) {
  el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`
}

function setCursor(canvas, value) {
  canvas.style.cursor = value
}

function setEnvironment(scene, texture, intensity) {
  scene.environment = texture
  scene.environmentIntensity = intensity
}

export default function LabScene({ projects, active, onActive, reducedMotion }) {
  const wrapRef = useRef(null)
  const tagRefs = useRef({})
  const [inView, setInView] = useState(true)
  const [ready, setReady] = useState(false)

  const molecules = useMemo(
    () => projects.map((project) => ({ project, ...buildMolecule(project) })),
    [projects],
  )

  // Fuera de pantalla no se dibuja nada (threejs-performance).
  useEffect(() => {
    const el = wrapRef.current
    if (!el || !('IntersectionObserver' in window)) return
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      rootMargin: '80px',
    })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const frameloop = !inView ? 'never' : reducedMotion ? 'demand' : 'always'

  return (
    <div ref={wrapRef} className={`gl-lab${ready ? ' is-ready' : ''}`} aria-hidden="true">
      <Canvas
        frameloop={frameloop}
        dpr={[1, 2]}
        shadows="percentage"
        gl={GL}
        camera={CAMERA}
        onCreated={() => setReady(true)}
      >
        <Lab
          molecules={molecules}
          active={active}
          onActive={onActive}
          tagRefs={tagRefs}
          reducedMotion={reducedMotion}
        />
      </Canvas>

      {/* Etiquetas de cada molécula: se colocan en cada fotograma proyectando su posición 3D. */}
      <div className="gl-lab-tags">
        {molecules.map((m, i) => (
          <a
            key={m.slug}
            ref={(el) => {
              tagRefs.current[m.slug] = el
            }}
            href={`#/${m.slug}`}
            tabIndex={-1}
            className={`gl-lab-tag${active === m.slug ? ' is-active' : ''}`}
            style={{ '--i': i }}
            onPointerEnter={() => onActive(m.slug)}
            onPointerLeave={() => onActive(null)}
          >
            <span className="gl-lab-tag-name">
              <span className="gl-lab-tag-num">{m.project.number}</span>
              {m.project.title}
            </span>
            <span className="gl-lab-tag-meta">{m.project.skills.length} skills</span>
          </a>
        ))}
      </div>
    </div>
  )
}

function Lab({ molecules, active, onActive, tagRefs, reducedMotion }) {
  const viewport = useThree((s) => s.viewport)
  const invalidate = useThree((s) => s.invalidate)
  const { width: W, height: H, factor } = viewport
  // La etiqueta mide unos 50 px (34 px en móvil, sin la segunda línea); factor = píxeles por unidad.
  const labelPx = W * factor < 520 ? 36 : 52
  const layout = useMemo(
    () => layoutMolecules(molecules, W, H, labelPx / factor),
    [molecules, W, H, labelPx, factor],
  )
  const lightRef = useRef(null)
  const items = useRef(new Map())
  const pointer = useRef({ x: 0, y: 0 })
  const projected = useMemo(() => new THREE.Vector3(), [])

  // Geometrías y materiales compartidos: una esfera y un cilindro para todos los átomos y enlaces.
  const kit = useMemo(() => {
    const sphere = new THREE.SphereGeometry(1, 48, 32)
    const stick = new THREE.CylinderGeometry(1, 1, 1, 16, 1)
    const byColor = new Map()
    for (const m of molecules) {
      for (const a of m.atoms) {
        if (!byColor.has(a.color)) {
          byColor.set(
            a.color,
            // Plástico brillante, como las maquetas de moléculas del colegio.
            new THREE.MeshPhysicalMaterial({
              color: a.color,
              roughness: 0.34,
              clearcoat: 0.75,
              clearcoatRoughness: 0.16,
            }),
          )
        }
      }
    }
    const stickMat = new THREE.MeshStandardMaterial({ color: '#d4cbbb', roughness: 0.3, metalness: 0.55 })
    // Zona para el cursor: no pinta nada ni tapa nada, solo recibe el rayo.
    const hitMat = new THREE.MeshBasicMaterial({ colorWrite: false, depthWrite: false })
    return { sphere, stick, byColor, stickMat, hitMat }
  }, [molecules])

  useEffect(
    () => () => {
      kit.sphere.dispose()
      kit.stick.dispose()
      kit.byColor.forEach((mat) => mat.dispose())
      kit.stickMat.dispose()
      kit.hitMat.dispose()
    },
    [kit],
  )

  // La cámara de sombra cubre todo lo visible y se ajusta al cambiar el tamaño.
  useLayoutEffect(() => {
    const cam = lightRef.current?.shadow.camera
    if (!cam) return
    const half = Math.max(W, H) * 0.78
    Object.assign(cam, { left: -half, right: half, top: half, bottom: -half, near: 1, far: 30 })
    cam.updateProjectionMatrix()
    invalidate()
  }, [W, H, invalidate])

  // Con "reducir movimiento" solo se dibuja cuando algo cambia: hay que pedirlo.
  useEffect(() => {
    invalidate()
  }, [active, invalidate])

  useEffect(() => {
    if (reducedMotion) return
    const onMove = (e) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [reducedMotion])

  const register = useCallback((item) => {
    items.current.set(item.slug, item)
    return () => items.current.delete(item.slug)
  }, [])

  // Un solo bucle para todo: cámara, montaje, flotación, resalte y etiquetas.
  useFrame((state, delta) => {
    if (!layout) return
    const dt = Math.min(delta, 0.1)
    const t = state.clock.elapsedTime
    const cam = state.camera
    const current = active // Fiber renueva este callback en cada render: siempre lee el valor actual

    if (!reducedMotion) {
      // Paralaje: la cámara sigue un poco al cursor, y las sombras de la pared se desplazan.
      cam.position.x = THREE.MathUtils.damp(cam.position.x, pointer.current.x * 1.1, 2.5, dt)
      cam.position.y = THREE.MathUtils.damp(cam.position.y, -pointer.current.y * 0.7, 2.5, dt)
      cam.lookAt(0, 0, 0)
    }
    cam.updateMatrixWorld()

    for (const item of items.current.values()) {
      const idx = item.index
      const [bx, by] = layout.positions[idx]

      if (item.mixer && !item.done) item.mixer.update(dt)

      const target = current === item.slug ? 1.12 : current ? 0.94 : 1
      item.hover = reducedMotion ? target : THREE.MathUtils.damp(item.hover, target, 7, dt)

      let bob = 0
      if (!reducedMotion) {
        const spin = current === item.slug ? 0.95 : 0.16
        item.group.rotation.y += dt * spin * item.dir
        item.group.rotation.x = Math.sin(t * 0.32 + item.phase) * 0.32
        bob = Math.sin(t * 0.6 + item.phase) * 0.07
      }
      item.group.position.set(bx, by + bob, 0)
      item.group.scale.setScalar(layout.scale * item.hover)

      const tag = tagRefs.current[item.slug]
      if (tag) {
        const bottom = by + bob - item.radius * layout.scale * item.hover - 0.06
        projected.set(bx, bottom, 0).project(cam)
        placeTag(
          tag,
          ((projected.x + 1) / 2) * state.size.width,
          ((1 - projected.y) / 2) * state.size.height,
        )
      }
    }
  })

  return (
    <>
      <StudioEnvironment />
      <hemisphereLight args={['#fffaf2', '#cdbfa9', 0.7]} />
      <directionalLight
        ref={lightRef}
        position={[-2.6, 4.2, 9]}
        intensity={2.1}
        color="#fff4e6"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-radius={7}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
      />

      <mesh position={[0, 0, WALL_Z]} receiveShadow>
        <planeGeometry args={[W * 2, H * 2]} />
        <shadowMaterial color="#3a2614" opacity={0.13} />
      </mesh>

      {layout &&
        molecules.map((m, i) => (
          <Molecule
            key={m.slug}
            data={m}
            index={i}
            kit={kit}
            register={register}
            onActive={onActive}
            reducedMotion={reducedMotion}
          />
        ))}
    </>
  )
}

// Entorno de estudio generado en el momento (sin descargar ningún HDR), para los brillos del plástico.
function StudioEnvironment() {
  const gl = useThree((s) => s.gl)
  const scene = useThree((s) => s.scene)
  const invalidate = useThree((s) => s.invalidate)

  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl)
    const room = new RoomEnvironment()
    const env = pmrem.fromScene(room, 0.04).texture
    setEnvironment(scene, env, 0.55)
    room.dispose()
    pmrem.dispose()
    invalidate()
    return () => {
      setEnvironment(scene, null, 1)
      env.dispose()
    }
  }, [gl, scene, invalidate])

  return null
}

function Molecule({ data, index, kit, register, onActive, reducedMotion }) {
  const groupRef = useRef(null)
  const gl = useThree((s) => s.gl)

  // Enlaces: un cilindro de altura 1 que se estira y se orienta entre cada átomo y su padre.
  const bonds = useMemo(
    () =>
      data.atoms.slice(1).map((a, i) => {
        const from = new THREE.Vector3(...a.parentPosition)
        const to = new THREE.Vector3(...a.position)
        const dir = to.clone().sub(from)
        const length = dir.length()
        return {
          name: `b${i + 1}`,
          length,
          position: from.clone().add(to).multiplyScalar(0.5).toArray(),
          quaternion: new THREE.Quaternion().setFromUnitVectors(Y_AXIS, dir.normalize()).toArray(),
          scale: [STICK_R, length, STICK_R],
        }
      }),
    [data],
  )

  useLayoutEffect(() => {
    const group = groupRef.current
    const item = {
      slug: data.slug,
      index,
      group,
      radius: data.radius,
      hover: 1,
      phase: index * 1.7,
      dir: index % 2 ? -1 : 1,
      mixer: null,
      done: true,
    }

    if (!reducedMotion) {
      // threejs-animation: el montaje es un AnimationClip con pistas de fotogramas clave.
      const mixer = new THREE.AnimationMixer(group)
      const action = mixer.clipAction(assemblyClip(data, bonds, 0.15 + index * 0.14))
      action.setLoop(THREE.LoopOnce, 1)
      action.clampWhenFinished = true
      action.play()
      mixer.update(0) // aplica ya la pose inicial: nada se ve en su sitio final antes de tiempo
      mixer.addEventListener('finished', () => {
        item.done = true
      })
      item.mixer = mixer
      item.done = false
    }

    const unregister = register(item)
    return () => {
      unregister()
      if (item.mixer) {
        item.mixer.stopAllAction()
        item.mixer.uncacheRoot(group)
      }
    }
  }, [data, bonds, index, register, reducedMotion])

  const enter = (e) => {
    e.stopPropagation()
    onActive(data.slug)
    setCursor(gl.domElement, 'pointer')
  }
  const leave = () => {
    onActive(null)
    setCursor(gl.domElement, '')
  }
  const open = (e) => {
    if (e.delta > 6) return // fue un arrastre o un scroll, no un toque
    window.location.hash = `#/${data.slug}`
  }

  useEffect(() => () => setCursor(gl.domElement, ''), [gl])

  return (
    <group ref={groupRef}>
      {data.atoms.map((a) => (
        <mesh
          key={a.name}
          name={a.name}
          geometry={kit.sphere}
          material={kit.byColor.get(a.color)}
          position={a.position}
          scale={a.r}
          castShadow
        />
      ))}
      {bonds.map((b) => (
        <mesh
          key={b.name}
          name={b.name}
          geometry={kit.stick}
          material={kit.stickMat}
          position={b.position}
          quaternion={b.quaternion}
          scale={b.scale}
          castShadow
        />
      ))}
      <mesh
        geometry={kit.sphere}
        material={kit.hitMat}
        scale={data.radius * 0.9}
        onPointerOver={enter}
        onPointerOut={leave}
        onClick={open}
      />
    </group>
  )
}

const easeOut = (t) => 1 - Math.pow(1 - t, 3)

/**
 * Clip de montaje: el núcleo aparece con un pequeño rebote y cada átomo sale de su padre
 * por el enlace, generación a generación. Antes de su turno, cada pieza está oculta (escala casi 0).
 */
function assemblyClip(data, bonds, delay) {
  const HIDDEN = 1e-4
  const STEPS = 8
  const DUR = 0.55
  const tracks = []
  const starts = []
  const siblings = new Map()

  // Núcleo: oculto hasta su turno, sale al 40 %, se pasa un poco (108 %) y se asienta.
  const r0 = data.atoms[0].r
  const nucleusKeys = [
    [0, HIDDEN],
    [delay, HIDDEN],
    [delay + 0.001, r0 * 0.4],
    [delay + 0.15, r0 * 0.86],
    [delay + 0.3, r0 * 1.08],
    [delay + 0.5, r0],
  ]
  tracks.push(
    new THREE.VectorKeyframeTrack(
      'a0.scale',
      nucleusKeys.map(([time]) => time),
      nucleusKeys.flatMap(([, s]) => [s, s, s]),
    ),
  )
  starts[0] = delay

  data.atoms.forEach((a, i) => {
    if (i === 0) return
    const parentIndex = a.parent
    const order = siblings.get(parentIndex) ?? 0
    siblings.set(parentIndex, order + 1)
    const start = starts[parentIndex] + (parentIndex === 0 ? 0.22 : DUR * 0.92) + order * 0.07
    starts[i] = start

    const from = new THREE.Vector3(...a.parentPosition)
    const to = new THREE.Vector3(...a.position)
    const bond = bonds[i - 1]

    const times = [0, Math.max(start - 0.001, 0)]
    const pos = [...from.toArray(), ...from.toArray()]
    const scl = [HIDDEN, HIDDEN, HIDDEN, HIDDEN, HIDDEN, HIDDEN]
    const bPos = [...from.toArray(), ...from.toArray()]
    const bScl = [HIDDEN, HIDDEN, HIDDEN, HIDDEN, HIDDEN, HIDDEN]

    for (let s = 0; s <= STEPS; s++) {
      const k = s / STEPS
      const e = easeOut(k)
      times.push(start + k * DUR)
      const p = from.clone().lerp(to, e)
      pos.push(p.x, p.y, p.z)
      const r = a.r * (0.35 + 0.65 * e)
      scl.push(r, r, r)
      const mid = from.clone().lerp(to, e / 2)
      bPos.push(mid.x, mid.y, mid.z)
      bScl.push(STICK_R, Math.max(bond.length * e, HIDDEN), STICK_R)
    }

    tracks.push(
      new THREE.VectorKeyframeTrack(`${a.name}.position`, times, pos),
      new THREE.VectorKeyframeTrack(`${a.name}.scale`, times, scl),
      new THREE.VectorKeyframeTrack(`${bond.name}.position`, times, bPos),
      new THREE.VectorKeyframeTrack(`${bond.name}.scale`, times, bScl),
    )
  })

  return new THREE.AnimationClip('ensamblar', -1, tracks)
}
