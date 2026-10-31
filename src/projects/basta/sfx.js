// Sonidos cortos generados con Web Audio (sin archivos). Siempre son un extra:
// todo lo que suena también se ve en pantalla.

let ctx = null

function audio() {
  if (!ctx) {
    const Ctx = window.AudioContext || window.webkitAudioContext
    ctx = new Ctx()
  }
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

function tone(c, freq, start, duration, volume = 0.12, type = 'sine') {
  const t = c.currentTime + start
  const osc = c.createOscillator()
  const gain = c.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t)
  gain.gain.setValueAtTime(0.0001, t)
  gain.gain.exponentialRampToValueAtTime(volume, t + 0.01)
  gain.gain.exponentialRampToValueAtTime(0.0001, t + duration)
  osc.connect(gain).connect(c.destination)
  osc.start(t)
  osc.stop(t + duration + 0.05)
}

const SOUNDS = {
  tick: (c) => tone(c, 1100, 0, 0.05, 0.05, 'square'),
  pop: (c) => tone(c, 560, 0, 0.09, 0.08, 'triangle'),
  ding: (c) => {
    tone(c, 660, 0, 0.18)
    tone(c, 990, 0.12, 0.35)
  },
  basta: (c) => {
    tone(c, 330, 0, 0.18, 0.14, 'sawtooth')
    tone(c, 247, 0.16, 0.4, 0.14, 'sawtooth')
  },
  time: (c) => tone(c, 196, 0, 0.6, 0.14, 'square'),
  win: (c) => [523, 659, 784, 1047].forEach((f, i) => tone(c, f, i * 0.13, 0.35, 0.12, 'triangle')),
}

export function play(name, enabled) {
  if (!enabled) return
  try {
    SOUNDS[name]?.(audio())
  } catch {
    // Si el navegador no permite audio, el juego sigue igual.
  }
}
