import * as THREE from 'three'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'

// Escena 3D de la taza de Café Lumbre (three.js r186, WebGLRenderer).
//
// Interfaz:
//   const cup = createCupScene(canvas, { drink, reducedMotion, onReady })
//   cup.setDrink('espresso' | 'capuchino' | 'mocha')
//   cup.dispose()
//
// Todo lo demás (geometría, materiales, luces, vapor, chispas, arrastre con
// inercia, pausa fuera de pantalla y limpieza) queda dentro de este módulo.

export const DRINKS = {
  // El espresso va algo más alto de lo real: más bajo, el borde de la taza lo tapa desde la cámara.
  espresso: { level: 0.66, roughness: 0.22, clearcoat: 0.8 },
  capuchino: { level: 0.93, roughness: 0.55, clearcoat: 0.15 },
  mocha: { level: 0.88, roughness: 0.4, clearcoat: 0.3 },
}

const COLORS = {
  glazeOut: 0x8a4630, // esmalte terracota (el "tueste" de la marca)
  glazeIn: 0xf4eadb, // interior y plato color crema
  key: 0xffd2a1,
  rim: 0xff9a55,
  ember: 0xffb347,
}

/* ---------- Perfiles torneados (LatheGeometry gira un perfil 2D alrededor de Y) ---------- */

// Exterior de la taza: del centro de la base al borde. La parte interior va aparte
// para poder darle otro esmalte, como una taza bañada por dentro.
const OUTER = [
  [0.0, 0.0],
  [0.46, 0.0],
  [0.53, 0.02],
  [0.56, 0.07],
  [0.62, 0.2],
  [0.72, 0.45],
  [0.8, 0.72],
  [0.845, 0.95],
  [0.855, 1.0],
]
const INNER = [
  [0.855, 1.0],
  [0.835, 1.02],
  [0.812, 0.97],
  [0.77, 0.72],
  [0.69, 0.46],
  [0.59, 0.24],
  [0.48, 0.13],
  [0.3, 0.1],
  [0.0, 0.1],
]
const SAUCER = [
  [0.0, 0.0],
  [0.95, 0.0],
  [1.3, 0.06],
  [1.48, 0.15],
  [1.5, 0.175],
  [1.47, 0.18],
  [1.28, 0.105],
  [0.9, 0.075],
  [0.6, 0.068],
  [0.0, 0.068],
]
const SAUCER_TOP = 0.068
const INNER_BOTTOM = 0.1

function smoothProfile(points, divisions) {
  const curve = new THREE.SplineCurve(points.map(([x, y]) => new THREE.Vector2(x, y)))
  return curve.getPoints(divisions)
}

// Radio interior de la taza a una altura dada (para el disco del café).
function innerRadiusAt(y) {
  for (let i = INNER.length - 1; i > 0; i--) {
    const [r1, y1] = INNER[i]
    const [r0, y0] = INNER[i - 1]
    if (y >= y1 && y <= y0) return THREE.MathUtils.lerp(r1, r0, (y - y1) / (y0 - y1))
  }
  return INNER[1][0]
}

/* ---------- Texturas dibujadas en canvas: superficie de cada bebida ---------- */

function drinkTexture(kind) {
  const size = 512
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')
  const c = size / 2

  if (kind === 'espresso') {
    // Crema atigrada: centro dorado, borde tostado y vetas.
    const g = ctx.createRadialGradient(c, c, 0, c, c, c)
    g.addColorStop(0, '#d39a5c')
    g.addColorStop(0.6, '#a8642f')
    g.addColorStop(1, '#5a2e16')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, size, size)
    ctx.strokeStyle = 'rgba(70, 32, 14, 0.35)'
    for (let i = 0; i < 70; i++) {
      const r = 40 + Math.random() * 200
      const a = Math.random() * Math.PI * 2
      ctx.lineWidth = 1 + Math.random() * 3
      ctx.beginPath()
      ctx.arc(c, c, r, a, a + 0.3 + Math.random() * 0.6)
      ctx.stroke()
    }
  } else if (kind === 'capuchino') {
    // Leche texturizada con un corazón de latte art sobre la crema.
    const g = ctx.createRadialGradient(c, c, 0, c, c, c)
    g.addColorStop(0, '#9a6236')
    g.addColorStop(0.82, '#7c4524')
    g.addColorStop(1, '#5b2f17')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, size, size)
    ctx.filter = 'blur(3px)'
    ctx.fillStyle = '#f6eadb'
    ctx.beginPath()
    ctx.moveTo(c, c + 150)
    ctx.bezierCurveTo(c - 40, c + 90, c - 175, c + 20, c - 160, c - 70)
    ctx.bezierCurveTo(c - 145, c - 150, c - 40, c - 160, c, c - 85)
    ctx.bezierCurveTo(c + 40, c - 160, c + 145, c - 150, c + 160, c - 70)
    ctx.bezierCurveTo(c + 175, c + 20, c + 40, c + 90, c, c + 150)
    ctx.fill()
    // El trazo final que atraviesa el corazón
    ctx.strokeStyle = '#8d5630'
    ctx.lineWidth = 7
    ctx.beginPath()
    ctx.moveTo(c, c - 125)
    ctx.lineTo(c, c + 165)
    ctx.stroke()
    ctx.filter = 'none'
  } else {
    // Mocha: chocolate con un remolino de leche y cacao espolvoreado.
    const g = ctx.createRadialGradient(c, c, 0, c, c, c)
    g.addColorStop(0, '#6b3a22')
    g.addColorStop(1, '#3e1f12')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, size, size)
    ctx.filter = 'blur(4px)'
    ctx.strokeStyle = 'rgba(232, 200, 164, 0.75)'
    ctx.lineWidth = 16
    ctx.beginPath()
    for (let t = 0; t < 14; t += 0.05) {
      const r = 8 + t * 15
      const x = c + Math.cos(t) * r
      const y = c + Math.sin(t) * r
      if (t === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()
    ctx.filter = 'none'
    ctx.fillStyle = 'rgba(40, 18, 10, 0.55)'
    for (let i = 0; i < 900; i++) {
      const a = Math.random() * Math.PI * 2
      const r = Math.sqrt(Math.random()) * c
      ctx.fillRect(c + Math.cos(a) * r, c + Math.sin(a) * r, 2, 2)
    }
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace // un canvas usado como color es sRGB
  texture.anisotropy = 4
  return texture
}

function dotTexture() {
  const size = 64
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  g.addColorStop(0, 'rgba(255,255,255,1)')
  g.addColorStop(0.35, 'rgba(255,255,255,0.6)')
  g.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, size, size)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

/* ---------- Vapor: ShaderMaterial con ruido fbm que sube y se retuerce ---------- */

const steamVertex = /* glsl */ `
  uniform float time;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec3 p = position;
    // Cuanto más arriba, más se mece el vapor.
    p.x += sin(p.y * 2.6 + time * 1.1) * 0.12 * uv.y;
    p.z += cos(p.y * 2.0 + time * 0.8) * 0.06 * uv.y;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`

const steamFragment = /* glsl */ `
  uniform float time;
  uniform float opacity;
  uniform float seed;
  uniform vec3 color;
  varying vec2 vUv;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; }
    return v;
  }

  void main() {
    vec2 p = vec2(vUv.x * 2.2 + seed, vUv.y * 1.6 - time * 0.22);
    float n = fbm(p + fbm(p * 0.8 + time * 0.05));
    float wisp = smoothstep(0.42, 0.78, n);
    // Bordes suaves: estrecho abajo, se abre y desvanece arriba.
    float side = smoothstep(0.0, 0.3, vUv.x) * smoothstep(1.0, 0.7, vUv.x);
    float vertical = smoothstep(0.0, 0.18, vUv.y) * smoothstep(1.0, 0.45, vUv.y);
    gl_FragColor = vec4(color, wisp * side * vertical * opacity * 0.55);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`

/* ---------- La escena ---------- */

export function createCupScene(canvas, { drink = 'capuchino', reducedMotion = false, onReady } = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)) // limita el coste en pantallas de alta densidad
  renderer.setClearColor(0x000000, 0) // lienzo transparente: se ve el fondo de la página
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.05
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFShadowMap

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 40)
  const target = new THREE.Vector3(0, 0.78, 0)

  // Reflejos suaves del esmalte: entorno generado, sin descargar ningún HDR.
  const pmrem = new THREE.PMREMGenerator(renderer)
  const room = new RoomEnvironment()
  scene.environment = pmrem.fromScene(room, 0.04).texture
  scene.environmentIntensity = 0.32
  room.dispose()
  pmrem.dispose()

  /* Luces: clave cálida, contraluz de brasa, relleno y una "lumbre" que parpadea */
  const key = new THREE.DirectionalLight(COLORS.key, 2.3)
  key.position.set(-3, 5, 3)
  key.castShadow = true
  key.shadow.mapSize.set(1024, 1024)
  Object.assign(key.shadow.camera, { left: -2, right: 2, top: 2, bottom: -2, near: 1, far: 12 })
  key.shadow.camera.updateProjectionMatrix()
  key.shadow.radius = 4
  key.shadow.bias = -0.0005
  key.shadow.normalBias = 0.02

  const rim = new THREE.DirectionalLight(COLORS.rim, 1.8)
  rim.position.set(3.2, 2.6, -3)

  const hemi = new THREE.HemisphereLight(0xffe6c7, 0x2a1a12, 0.55)

  const fire = new THREE.PointLight(0xff8a3d, 9, 7, 2)
  fire.position.set(-1.9, 0.5, 1.4)

  scene.add(key, rim, hemi, fire)

  /* La vajilla */
  const cup = new THREE.Group()
  scene.add(cup)

  const glazeOut = new THREE.MeshPhysicalMaterial({
    color: COLORS.glazeOut,
    roughness: 0.32,
    clearcoat: 0.7,
    clearcoatRoughness: 0.12,
    side: THREE.DoubleSide,
  })
  const glazeIn = new THREE.MeshPhysicalMaterial({
    color: COLORS.glazeIn,
    roughness: 0.28,
    clearcoat: 0.6,
    clearcoatRoughness: 0.1,
    side: THREE.DoubleSide,
  })

  const outerGeo = new THREE.LatheGeometry(smoothProfile(OUTER, 60), 96)
  const innerGeo = new THREE.LatheGeometry(smoothProfile(INNER, 60), 96)
  const outer = new THREE.Mesh(outerGeo, glazeOut)
  const inner = new THREE.Mesh(innerGeo, glazeIn)

  const handleCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.79, 0.8, 0),
    new THREE.Vector3(1.08, 0.82, 0),
    new THREE.Vector3(1.2, 0.62, 0),
    new THREE.Vector3(1.08, 0.38, 0),
    new THREE.Vector3(0.66, 0.3, 0),
  ])
  const handleGeo = new THREE.TubeGeometry(handleCurve, 64, 0.058, 20, false)
  const handle = new THREE.Mesh(handleGeo, glazeOut)

  const cupBody = new THREE.Group()
  cupBody.add(outer, inner, handle)
  cupBody.position.y = SAUCER_TOP
  cup.add(cupBody)

  const saucerGeo = new THREE.LatheGeometry(smoothProfile(SAUCER, 50), 96)
  const saucer = new THREE.Mesh(saucerGeo, glazeIn)
  cup.add(saucer)

  for (const m of [outer, inner, handle, saucer]) {
    m.castShadow = true
    m.receiveShadow = true
  }

  // Suelo invisible que solo muestra la sombra.
  const groundGeo = new THREE.PlaneGeometry(10, 10)
  const groundMat = new THREE.ShadowMaterial({ opacity: 0.38 })
  const ground = new THREE.Mesh(groundGeo, groundMat)
  ground.rotation.x = -Math.PI / 2
  ground.receiveShadow = true
  scene.add(ground)

  /* El café: un disco a la altura del líquido, con la superficie de cada bebida */
  const textures = Object.fromEntries(Object.keys(DRINKS).map((k) => [k, drinkTexture(k)]))
  const liquidGeo = new THREE.CircleGeometry(1, 72)
  liquidGeo.rotateX(-Math.PI / 2)
  const liquidMat = new THREE.MeshPhysicalMaterial({ map: textures[drink], roughness: 0.4, clearcoat: 0.3 })
  const liquid = new THREE.Mesh(liquidGeo, liquidMat)
  liquid.receiveShadow = true
  cupBody.add(liquid)

  function setLevel(y) {
    liquid.position.y = y
    const r = innerRadiusAt(y) - 0.006
    liquid.scale.set(r, 1, r)
  }

  function applyDrink(name) {
    const d = DRINKS[name]
    liquidMat.map = textures[name]
    liquidMat.roughness = d.roughness
    liquidMat.clearcoat = d.clearcoat
    liquidMat.needsUpdate = true
  }

  applyDrink(drink)
  setLevel(DRINKS[drink].level)

  /* Vapor: dos planos cruzados con el shader de ruido */
  const steamGeo = new THREE.PlaneGeometry(0.75, 1.9, 1, 40)
  steamGeo.translate(0, 0.95, 0)
  const steamMats = [0, 1].map(
    (i) =>
      new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          opacity: { value: 1 },
          seed: { value: i * 3.7 },
          color: { value: new THREE.Color(0xfff4e6) },
        },
        vertexShader: steamVertex,
        fragmentShader: steamFragment,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
  )
  const steam = new THREE.Group()
  steamMats.forEach((mat, i) => {
    const plane = new THREE.Mesh(steamGeo, mat)
    plane.rotation.y = (i * Math.PI) / 2
    steam.add(plane)
  })
  scene.add(steam) // fuera del grupo que gira: el vapor sube recto aunque la taza gire

  /* Chispas de brasa que suben alrededor de la taza */
  const EMBERS = 64
  const emberPos = new Float32Array(EMBERS * 3)
  const emberData = Array.from({ length: EMBERS }, () => ({
    angle: Math.random() * Math.PI * 2,
    radius: 1.7 + Math.random() * 1.2,
    speed: 0.12 + Math.random() * 0.25,
    phase: Math.random() * Math.PI * 2,
  }))
  emberData.forEach((e, i) => {
    emberPos[i * 3 + 1] = Math.random() * 3.2
  })
  const emberGeo = new THREE.BufferGeometry()
  emberGeo.setAttribute('position', new THREE.BufferAttribute(emberPos, 3))
  const dot = dotTexture()
  const emberMat = new THREE.PointsMaterial({
    color: COLORS.ember,
    size: 0.06,
    map: dot,
    transparent: true,
    depthWrite: false,
    opacity: 0.85,
  })
  const embers = new THREE.Points(emberGeo, emberMat)
  scene.add(embers)

  function updateEmbers(dt, t) {
    for (let i = 0; i < EMBERS; i++) {
      const e = emberData[i]
      let y = emberPos[i * 3 + 1]
      if (!reducedMotion) {
        y += e.speed * dt
        if (y > 3.2) y = 0
      }
      const a = e.angle + Math.sin(t * 0.4 + e.phase) * 0.15
      emberPos[i * 3] = Math.cos(a) * e.radius
      emberPos[i * 3 + 1] = y
      emberPos[i * 3 + 2] = Math.sin(a) * e.radius - 0.4
    }
    emberGeo.attributes.position.needsUpdate = true
  }
  updateEmbers(0, 0)

  /* Encuadre: la cámara se aleja lo justo para que quepan plato y vapor */
  function fit(width, height) {
    camera.aspect = width / height
    const halfFov = THREE.MathUtils.degToRad(camera.fov / 2)
    const needH = 3.3 // alto visible (plato + taza + vapor)
    const needW = 3.6 // ancho visible (plato y asa al girar)
    const dist = Math.max(needH / (2 * Math.tan(halfFov)), needW / (2 * Math.tan(halfFov) * camera.aspect))
    // Vista ligeramente cenital para ver la superficie del café.
    camera.position.set(0, target.y + dist * 0.4, dist * 0.92)
    camera.lookAt(target)
    camera.updateProjectionMatrix()
  }

  function resize() {
    const { clientWidth: w, clientHeight: h } = canvas
    if (!w || !h) return
    renderer.setSize(w, h, false)
    fit(w, h)
  }
  const resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(canvas)
  resize()

  /* Arrastre con inercia: girar la taza con el dedo o el ratón */
  const AUTO_SPEED = reducedMotion ? 0 : 0.22 // rad/s cuando nadie la toca
  let dragging = false
  let lastX = 0
  let lastMoveTime = 0
  let velocity = AUTO_SPEED
  let idleSince = 0
  let tiltTarget = 0

  function onPointerDown(e) {
    if (dragging) return // ignora un segundo dedo
    dragging = true
    lastX = e.clientX
    lastMoveTime = performance.now()
    velocity = 0
    canvas.setPointerCapture(e.pointerId)
    canvas.dataset.dragging = 'true'
  }
  function onPointerMove(e) {
    const rect = canvas.getBoundingClientRect()
    tiltTarget = ((e.clientY - rect.top) / rect.height - 0.5) * 0.12
    if (!dragging) return
    const now = performance.now()
    const dx = e.clientX - lastX
    const dt = Math.max((now - lastMoveTime) / 1000, 1 / 240)
    const delta = dx * 0.0095
    cup.rotation.y += delta
    velocity = THREE.MathUtils.lerp(velocity, delta / dt, 0.5)
    lastX = e.clientX
    lastMoveTime = now
  }
  function onPointerUp(e) {
    if (!dragging) return
    dragging = false
    idleSince = performance.now()
    canvas.releasePointerCapture?.(e.pointerId)
    delete canvas.dataset.dragging
  }
  function onPointerLeave() {
    if (!dragging) tiltTarget = 0
  }
  canvas.addEventListener('pointerdown', onPointerDown)
  canvas.addEventListener('pointermove', onPointerMove)
  canvas.addEventListener('pointerup', onPointerUp)
  canvas.addEventListener('pointercancel', onPointerUp)
  canvas.addEventListener('pointerleave', onPointerLeave)

  /* Cambio de bebida: el café baja, cambia y vuelve a subir */
  const pour = { active: false, phase: 'drain', t: 0, from: 0, to: 0, next: drink }
  let current = drink
  const easeInOut = (x) => (x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2)
  const easeOut = (x) => 1 - (1 - x) ** 3

  function setDrink(name) {
    if (!DRINKS[name] || (name === current && !pour.active)) return
    if (reducedMotion) {
      current = name
      applyDrink(name)
      setLevel(DRINKS[name].level)
      return
    }
    Object.assign(pour, { active: true, phase: 'drain', t: 0, from: liquid.position.y, next: name })
  }

  function updatePour(dt) {
    if (!pour.active) return
    if (pour.phase === 'drain') {
      pour.t = Math.min(pour.t + dt / 0.38, 1)
      setLevel(THREE.MathUtils.lerp(pour.from, INNER_BOTTOM + 0.015, easeInOut(pour.t)))
      if (pour.t === 1) {
        current = pour.next
        applyDrink(current)
        Object.assign(pour, { phase: 'fill', t: 0, from: liquid.position.y, to: DRINKS[current].level })
      }
    } else {
      pour.t = Math.min(pour.t + dt / 0.75, 1)
      setLevel(THREE.MathUtils.lerp(pour.from, pour.to, easeOut(pour.t)))
      if (pour.t === 1) pour.active = false
    }
  }

  /* Bucle */
  const timer = new THREE.Timer()
  timer.connect(document) // congela el delta mientras la pestaña está oculta
  let ready = false
  let steamOpacity = 1

  function animate() {
    timer.update()
    const dt = Math.min(timer.getDelta(), 0.05)
    const t = timer.getElapsed()

    // Giro: inercia que se frena y, tras un rato quieta, vuelve el giro lento.
    if (!dragging) {
      const idle = performance.now() - idleSince > 1600
      const goal = idle ? AUTO_SPEED : 0
      velocity += (goal - velocity) * (1 - Math.exp(-dt * (idle ? 0.8 : 2.6)))
      cup.rotation.y += velocity * dt
    }
    cup.rotation.x += (tiltTarget - cup.rotation.x) * (1 - Math.exp(-dt * 4))

    updatePour(dt)

    // El vapor se apaga mientras se cambia la bebida y sale de la superficie del café.
    const steamGoal = pour.active ? 0.15 : 1
    steamOpacity += (steamGoal - steamOpacity) * (1 - Math.exp(-dt * 3))
    const steamTime = reducedMotion ? t * 0.3 : t
    for (const mat of steamMats) {
      mat.uniforms.time.value = steamTime
      mat.uniforms.opacity.value = steamOpacity
    }
    steam.position.y = SAUCER_TOP + liquid.position.y

    // La lumbre parpadea: dos senos desfasados imitan una llama.
    if (!reducedMotion) fire.intensity = 9 + Math.sin(t * 7.3) * 1.2 + Math.sin(t * 13.1 + 1.3) * 0.8

    updateEmbers(dt, t)
    renderer.render(scene, camera)

    if (!ready) {
      ready = true
      onReady?.()
    }
  }

  // Solo se dibuja mientras la taza está en pantalla.
  let running = false
  const start = () => {
    if (!running) {
      running = true
      renderer.setAnimationLoop(animate)
    }
  }
  const stop = () => {
    if (running) {
      running = false
      renderer.setAnimationLoop(null)
    }
  }
  const visibility = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()))
  visibility.observe(canvas)
  start()

  function dispose() {
    stop()
    visibility.disconnect()
    resizeObserver.disconnect()
    timer.dispose()
    canvas.removeEventListener('pointerdown', onPointerDown)
    canvas.removeEventListener('pointermove', onPointerMove)
    canvas.removeEventListener('pointerup', onPointerUp)
    canvas.removeEventListener('pointercancel', onPointerUp)
    canvas.removeEventListener('pointerleave', onPointerLeave)
    scene.traverse((obj) => {
      obj.geometry?.dispose()
      for (const material of [obj.material ?? []].flat()) material.dispose()
    })
    for (const tex of [...Object.values(textures), dot]) tex.dispose()
    scene.environment?.dispose()
    renderer.dispose()
    renderer.forceContextLoss()
  }

  return { setDrink, dispose }
}
