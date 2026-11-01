import { useId, useState } from 'react'
import { Icon } from './icons.jsx'
import { ANCHORS, CELEBRATIONS, TINY_ACTIONS } from './store.js'

// Receta de Tiny Habits (BJ Fogg):
// "Después de [ancla], voy a [hábito diminuto] y lo celebro [celebración]".
// La frase ya viene completa: se puede plantar con un solo toque.
// Cada parte subrayada es un botón que abre sus opciones.

const DEFAULT_RECIPE = {
  anchor: ANCHORS[1].text,
  action: TINY_ACTIONS[0].text,
  celebration: CELEBRATIONS[0].text,
}

const SLOTS = {
  anchor: {
    title: '¿Después de qué momento?',
    hint: 'Algo que ya haces cada día sin pensarlo.',
    options: ANCHORS,
  },
  action: {
    title: '¿Qué hábito diminuto?',
    hint: 'Tan pequeño que puedas hacerlo en un día malo.',
    options: TINY_ACTIONS,
  },
  celebration: {
    title: '¿Cómo lo celebras?',
    hint: 'Una emoción pequeña justo después es lo que fija el hábito.',
    options: CELEBRATIONS,
  },
}

// Un <span> con rol de botón (y no un <button>) para que el texto se parta entre líneas
// como el resto de la frase y la coma quede pegada a la palabra.
function Slot({ value, open, onClick, controls }) {
  return (
    <span
      role="button"
      tabIndex={0}
      className="fl-slot"
      aria-expanded={open}
      aria-controls={controls}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      }}
    >
      {value || '…'}
    </span>
  )
}

function Picker({ id, slot, value, onPick, onType, onClose }) {
  const { title, hint, options } = SLOTS[slot]
  const isCustom = !options.some((o) => o.text === value)
  const tooBig = slot === 'action' && value.trim().split(/\s+/).filter(Boolean).length > 6

  return (
    <div className="fl-picker" id={id} role="group" aria-label={title}>
      <div className="fl-picker-head">
        <div>
          <p className="fl-picker-title">{title}</p>
          <p className="fl-picker-hint">{hint}</p>
        </div>
        <button type="button" className="fl-icon-btn" onClick={onClose} aria-label="Cerrar opciones">
          <Icon name="x" size={18} />
        </button>
      </div>

      <div className="fl-options">
        {options.map((o) => (
          <button
            key={o.text}
            type="button"
            className="fl-option"
            aria-pressed={value === o.text}
            onClick={() => onPick(o.text)}
          >
            <Icon name={o.icon} size={18} />
            <span>{o.text}</span>
          </button>
        ))}
      </div>

      <label className="fl-custom">
        <span>O escribe el tuyo</span>
        <input
          value={isCustom ? value : ''}
          onChange={(e) => onType(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              onClose()
            }
          }}
          placeholder="…"
          maxLength={60}
          autoComplete="off"
        />
      </label>

      {tooBig && <p className="fl-warn">¿Se puede hacer más pequeño? Piensa en algo de menos de 30 segundos.</p>}
    </div>
  )
}

export default function RecipeForm({ initial = DEFAULT_RECIPE, submitLabel, onSubmit, children }) {
  const pickerId = useId()
  const [open, setOpen] = useState(null)
  const [recipe, setRecipe] = useState(() => ({
    anchor: initial.anchor,
    action: initial.action,
    celebration: initial.celebration,
  }))

  const clean = {
    anchor: recipe.anchor.trim(),
    action: recipe.action.trim(),
    celebration: recipe.celebration.trim(),
  }
  const ready = Boolean(clean.anchor && clean.action && clean.celebration)
  const set = (key, value) => setRecipe((r) => ({ ...r, [key]: value }))
  const slot = (key) => (
    <Slot
      value={clean[key]}
      open={open === key}
      controls={pickerId}
      onClick={() => setOpen((o) => (o === key ? null : key))}
    />
  )

  return (
    <form
      className="fl-recipe"
      onSubmit={(e) => {
        e.preventDefault()
        if (ready) onSubmit(clean)
      }}
    >
      <p className="fl-sentence">
        Después de {slot('anchor')}, voy a {slot('action')} y lo celebro {slot('celebration')}.
      </p>

      {open ? (
        <Picker
          key={open}
          id={pickerId}
          slot={open}
          value={recipe[open]}
          onPick={(v) => {
            set(open, v)
            setOpen(null)
          }}
          onType={(v) => set(open, v)}
          onClose={() => setOpen(null)}
        />
      ) : (
        <p className="fl-tap-hint">
          <Icon name="edit" size={14} /> Toca lo subrayado para cambiarlo
        </p>
      )}

      <div className="fl-recipe-actions">
        <button type="submit" className="fl-btn fl-btn-primary" disabled={!ready}>
          {submitLabel}
        </button>
        {children}
      </div>
    </form>
  )
}
