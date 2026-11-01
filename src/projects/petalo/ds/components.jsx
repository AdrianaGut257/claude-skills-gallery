import { useId } from 'react'
import { Icon } from './icons.jsx'
import { cssVars } from './tokens.js'
import './ds.css'

// Componentes de Pétalo DS.
// Todos leen solo variables semánticas (--pt-*), nunca colores ni primitivos.
// Por eso funcionan igual en cualquier tema sin saber que los temas existen.

/**
 * Aplica un tema a todo lo que contiene.
 * theme: "light" o "dark".
 */
export function PetaloTheme({ theme = 'light', className = '', children, ...rest }) {
  return (
    <div className={`pt-theme ${className}`} data-theme={theme} style={cssVars(theme)} {...rest}>
      {children}
    </div>
  )
}

/**
 * Inicia una acción.
 * variant: "primary" para la acción principal de la vista (una por vista),
 *          "secondary" para el resto, "ghost" para acciones de poco peso.
 * size:    "md" o "sm".
 * icon:    nombre de un icono que va antes del texto.
 * No hay prop de color: el color sale de la variante. Así no aparecen
 * botones con tonos inventados.
 */
export function Button({ variant = 'primary', size = 'md', icon, children, className = '', ...rest }) {
  return (
    <button type="button" className={`pt-btn pt-btn-${variant} pt-btn-${size} ${className}`} {...rest}>
      {icon && <Icon name={icon} size={size === 'sm' ? 16 : 18} />}
      {children}
    </button>
  )
}

/**
 * Campo de texto con etiqueta. La etiqueta es obligatoria: un campo sin
 * etiqueta no es accesible, así que la interfaz no deja crearlo.
 * hint:  texto de ayuda bajo el campo.
 * error: mensaje de error. Si existe, sustituye a hint y marca el campo como inválido.
 * El resto de props van al <input>.
 */
export function Field({ label, hint, error, className = '', ...inputProps }) {
  const id = useId()
  const noteId = `${id}-note`
  const note = error || hint
  return (
    <div className={`pt-field ${error ? 'is-error' : ''} ${className}`}>
      <label htmlFor={id}>{label}</label>
      <input id={id} aria-invalid={Boolean(error)} aria-describedby={note ? noteId : undefined} {...inputProps} />
      {note && (
        <p id={noteId} className="pt-field-note">
          {error && <Icon name="danger" size={14} />}
          {note}
        </p>
      )}
    </div>
  )
}

/**
 * Etiqueta corta de estado.
 * tone: "neutral", "accent", "success", "warning" o "danger".
 */
export function Badge({ tone = 'neutral', children }) {
  return <span className={`pt-badge pt-badge-${tone}`}>{children}</span>
}

/**
 * Interruptor de encendido y apagado. Aplica el cambio al momento, sin botón de guardar.
 * checked:  true si está encendido.
 * onChange: recibe el nuevo valor (true o false).
 */
export function Switch({ checked, onChange, label, disabled = false }) {
  return (
    <label className={`pt-switch ${disabled ? 'is-disabled' : ''}`}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className="pt-switch-track"
      >
        <span className="pt-switch-thumb" />
      </button>
      <span>{label}</span>
    </label>
  )
}

const NOTICE_ICON = { info: 'info', success: 'success', warning: 'warning', danger: 'danger' }

/**
 * Aviso dentro de la página. Úsalo uno por sección como mucho.
 * tone:  "info", "success", "warning" o "danger". El icono va con el tono.
 * title: frase corta en negrita. children: el detalle.
 */
export function Notice({ tone = 'info', title, children }) {
  return (
    <div className={`pt-notice pt-notice-${tone}`} role={tone === 'danger' ? 'alert' : 'status'}>
      <Icon name={NOTICE_ICON[tone]} size={20} />
      <div>
        {title && <p className="pt-notice-title">{title}</p>}
        {children && <div className="pt-notice-body">{children}</div>}
      </div>
    </div>
  )
}
