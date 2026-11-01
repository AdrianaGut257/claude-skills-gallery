import { Quaternion, Vector3 } from 'three'

// Cada proyecto es una molécula: el núcleo es el proyecto y cada átomo, una de sus skills.
// Todo sale de una semilla (el slug), así que la misma molécula se dibuja siempre igual.

export const NUCLEUS_R = 0.3
export const ATOM_R = 0.16
const GAP_NUCLEUS = 0.34 // hueco del palito entre núcleo y átomo
const GAP_ATOM = 0.32 // hueco del palito entre dos átomos
const TETRA = Math.acos(-1 / 3) // 109,5°: el ángulo entre enlaces de un carbono

// Colores elegidos a mano para los proyectos actuales. Los nuevos usan su vista previa.
const PALETTES = {
  dayflow: { nucleus: '#1C1B19', atoms: ['#EFE8DB', '#C2B59F'] },
  basta: { nucleus: '#7B6BFF', atoms: ['#FFD23F', '#211C4A'] },
  florecer: { nucleus: '#EE93B4', atoms: ['#FBE3EC', '#4A2A39'] },
  petalo: { nucleus: '#B48CFF', atoms: ['#F4EEFF', '#2A2338'] },
  lumbre: { nucleus: '#9A4A2F', atoms: ['#FFB347', '#FFF1DC', '#2A1A12'] },
}

export function paletteFor(project) {
  return (
    PALETTES[project.slug] ?? {
      nucleus: project.preview.deco,
      atoms: [project.preview.fg, project.preview.bg],
    }
  )
}

function hash(text) {
  let h = 2166136261
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

// Generador pseudoaleatorio pequeño y con semilla (mulberry32).
function seeded(seed) {
  let a = seed
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function randomQuaternion(rnd) {
  const u1 = rnd()
  const u2 = rnd() * Math.PI * 2
  const u3 = rnd() * Math.PI * 2
  const a = Math.sqrt(1 - u1)
  const b = Math.sqrt(u1)
  return new Quaternion(a * Math.sin(u2), a * Math.cos(u2), b * Math.sin(u3), b * Math.cos(u3))
}

const TETRA_DIRS = [
  [1, 1, 1],
  [1, -1, -1],
  [-1, 1, -1],
  [-1, -1, 1],
].map(([x, y, z]) => new Vector3(x, y, z).normalize())

// Distancia libre entre un átomo nuevo y los que ya están (negativa = se tocan).
function clearance(atoms, pos, skip) {
  let min = Infinity
  for (let i = 0; i < atoms.length; i++) {
    if (i === skip) continue
    const free = atoms[i].pos.distanceTo(pos) - atoms[i].r - ATOM_R
    if (free < min) min = free
  }
  return min
}

/**
 * Construye la molécula de un proyecto.
 * - Los cuatro primeros átomos se enlazan al núcleo en tetraedro.
 * - El resto crece en ramas, generación a generación, con el ángulo de 109,5°.
 */
export function buildMolecule(project) {
  const rnd = seeded(hash(project.slug))
  const palette = paletteFor(project)
  const frame = randomQuaternion(rnd)
  const atoms = [{ pos: new Vector3(), r: NUCLEUS_R, parent: -1, depth: 0, children: 0 }]

  project.skills.forEach((skill, i) => {
    let parent = 0
    let pos

    if (i < 4) {
      pos = TETRA_DIRS[i]
        .clone()
        .applyQuaternion(frame)
        .multiplyScalar(NUCLEUS_R + ATOM_R + GAP_NUCLEUS)
    } else {
      // Rama: el padre es el átomo menos profundo que aún tiene sitio; se prueban varios giros.
      const withRoom = (limit) =>
        atoms
          .map((a, idx) => ({ ...a, idx }))
          .filter((a) => a.idx > 0 && a.children < limit)
          .sort((a, b) => a.depth - b.depth || a.children - b.children || a.idx - b.idx)
      let candidates = withRoom(2)
      if (!candidates.length) candidates = withRoom(3)

      let best = null
      for (const cand of candidates) {
        const p = atoms[cand.idx]
        const away = p.pos.clone().sub(atoms[p.parent].pos).normalize()
        const helper = Math.abs(away.y) < 0.9 ? new Vector3(0, 1, 0) : new Vector3(1, 0, 0)
        const u = new Vector3().crossVectors(away, helper).normalize()
        const w = new Vector3().crossVectors(away, u)
        const len = ATOM_R * 2 + GAP_ATOM
        const turn = Math.PI - TETRA
        for (let k = 0; k < 12; k++) {
          const phi = rnd() * Math.PI * 2
          const dir = away
            .clone()
            .multiplyScalar(Math.cos(turn))
            .addScaledVector(u, Math.sin(turn) * Math.cos(phi))
            .addScaledVector(w, Math.sin(turn) * Math.sin(phi))
          const candidatePos = p.pos.clone().addScaledVector(dir, len)
          const free = clearance(atoms, candidatePos, cand.idx)
          if (!best || free > best.free) best = { free, pos: candidatePos, parent: cand.idx }
        }
        if (best && best.free > 0.1) break // hay sitio de sobra: no hace falta probar otro padre
      }
      parent = best.parent
      pos = best.pos
    }

    const p = atoms[parent]
    p.children += 1
    atoms.push({ pos, r: ATOM_R, parent, depth: p.depth + 1, children: 0, skill })
  })

  const radius = atoms.reduce((max, a) => Math.max(max, a.pos.length() + a.r), 0)

  return {
    slug: project.slug,
    radius,
    atoms: atoms.map((a, i) => ({
      name: `a${i}`,
      position: a.pos.toArray(),
      parent: a.parent,
      parentPosition: a.parent >= 0 ? atoms[a.parent].pos.toArray() : null,
      r: a.r,
      depth: a.depth,
      skill: a.skill ?? null,
      color: i === 0 ? palette.nucleus : palette.atoms[(a.depth - 1) % palette.atoms.length],
    })),
  }
}

/**
 * Coloca las moléculas en el plano z = 0 sin que se pisen.
 * W y H son el ancho y alto visibles (en unidades de la escena).
 * Devuelve una escala común y una posición por molécula.
 */
export function layoutMolecules(molecules, W, H, labelPad = 0.8) {
  const n = molecules.length
  const margin = 0.22
  const gap = 0.22
  // labelPad: sitio de la etiqueta bajo cada molécula, en unidades de la escena.

  // Cada molécula ocupa un círculo que incluye su etiqueta: va de su tope al pie de la etiqueta.
  // El centro del círculo baja labelPad/2 respecto al núcleo.
  const footprint = (r, scale) => r * scale + labelPad / 2

  const maxR = Math.max(...molecules.map((m) => m.radius))
  const sumR2 = molecules.reduce((sum, m) => sum + m.radius * m.radius, 0)
  let scale = Math.sqrt((0.36 * W * H) / (Math.PI * sumR2))
  scale = Math.min(scale, (0.56 * Math.min(W, H)) / (2 * maxR))

  // Las grandes empiezan en el centro y las demás en espiral (ángulo áureo).
  const order = molecules.map((m, i) => i).sort((a, b) => molecules[b].radius - molecules[a].radius)

  for (let attempt = 0; attempt < 14; attempt++) {
    const F = molecules.map((m) => footprint(m.radius, scale))
    // c = centro del círculo de ocupación (x, y bajado labelPad/2)
    const c = new Array(n)
    order.forEach((idx, k) => {
      const angle = k * 2.39996 + 0.6
      const rad = Math.sqrt((k + 0.2) / n)
      c[idx] = [Math.cos(angle) * rad * W * 0.36, Math.sin(angle) * rad * H * 0.32]
    })

    for (let iter = 0; iter < 260; iter++) {
      for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
          const dx = c[j][0] - c[i][0]
          const dy = c[j][1] - c[i][1]
          const d = Math.hypot(dx, dy) || 0.001
          const need = F[i] + F[j] + gap
          if (d < need) {
            const push = (need - d) / 2
            c[i][0] -= (dx / d) * push
            c[i][1] -= (dy / d) * push
            c[j][0] += (dx / d) * push
            c[j][1] += (dy / d) * push
          }
        }
      }
      for (let i = 0; i < n; i++) {
        const xMax = W / 2 - F[i] + labelPad / 2 - margin // a los lados la etiqueta no ocupa tanto
        const yMax = H / 2 - F[i] - margin
        c[i][0] = Math.max(-xMax, Math.min(xMax, c[i][0]))
        c[i][1] = Math.max(-yMax, Math.min(yMax, c[i][1]))
      }
    }

    // ¿Queda algún solapamiento? Entonces se encoge todo un poco y se repite.
    let overlap = false
    for (let i = 0; i < n && !overlap; i++) {
      for (let j = i + 1; j < n; j++) {
        if (Math.hypot(c[j][0] - c[i][0], c[j][1] - c[i][1]) < F[i] + F[j] + gap * 0.4) {
          overlap = true
          break
        }
      }
    }
    if (!overlap || attempt === 13) {
      return { scale, positions: c.map(([x, y]) => [x, y + labelPad / 2]) }
    }
    scale *= 0.93
  }
  return null
}
