// Entiende frases como "Llamar al banco mañana a las 10, 30 min !"
// y devuelve el texto limpio más el día, la hora, la duración y la prioridad detectados.

const END = '(?=$|[\\s,.;!?])'
const START = '(^|\\s)'

const DAY_PATTERNS = [
  { re: new RegExp(`${START}(?:para )?alg[uú]n d[ií]a${END}`, 'i'), day: 'someday' },
  { re: new RegExp(`${START}(?:para )?mañana${END}`, 'i'), day: 'tomorrow' },
  { re: new RegExp(`${START}(?:para )?hoy${END}`, 'i'), day: 'today' },
]

const TIME_PATTERNS = [
  new RegExp(`${START}a las? (\\d{1,2})(?:[:.](\\d{2}))?(?:\\s?h)?${END}`, 'i'),
  new RegExp(`${START}(\\d{1,2}):(\\d{2})${END}`),
]

const MINUTES_PATTERN = new RegExp(`${START}(\\d{1,3})\\s?(?:min|mins|minutos)${END}`, 'i')
const HOURS_PATTERN = new RegExp(`${START}(\\d{1,2}(?:[.,]5)?)\\s?(?:h|hora|horas)${END}`, 'i')
const BANG_TEST = /(^|\s)!+(?=$|\s)/
const BANG_REPLACE = /(^|\s)!+(?=$|\s)/g
const URGENT_PATTERN = /urgente|importante/i

const pad = (n) => String(n).padStart(2, '0')

export function parseTask(input) {
  let text = ` ${input} `
  let day = null
  let time = null
  let duration = null
  let priority = null

  for (const { re, day: d } of DAY_PATTERNS) {
    if (re.test(text)) {
      day = d
      text = text.replace(re, ' ')
      break
    }
  }

  for (const re of TIME_PATTERNS) {
    const m = text.match(re)
    if (!m) continue
    const h = Number(m[2])
    const min = m[3] ? Number(m[3]) : 0
    if (h < 24 && min < 60) {
      time = `${pad(h)}:${pad(min)}`
      text = text.replace(re, ' ')
      break
    }
  }

  const minutes = text.match(MINUTES_PATTERN)
  if (minutes && Number(minutes[2]) > 0) {
    duration = Number(minutes[2])
    text = text.replace(MINUTES_PATTERN, ' ')
  } else {
    const hours = text.match(HOURS_PATTERN)
    if (hours && Number(hours[2].replace(',', '.')) > 0) {
      duration = Math.round(Number(hours[2].replace(',', '.')) * 60)
      text = text.replace(HOURS_PATTERN, ' ')
    }
  }

  if (BANG_TEST.test(text) || /!\s*$/.test(text) || URGENT_PATTERN.test(text)) {
    priority = 'alta'
  }
  text = text.replace(BANG_REPLACE, ' ')

  text = text
    .replace(/\s+/g, ' ')
    .replace(/\s+([,.;])/g, '$1')
    .replace(/^[\s,.;:-]+|[\s,;:-]+$/g, '')
    .trim()

  if (!text) text = input.trim()
  text = text.charAt(0).toUpperCase() + text.slice(1)

  return { text, day, time, duration, priority }
}
