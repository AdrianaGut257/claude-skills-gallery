import { useState } from 'react'
import {
  DEFAULT_CATEGORIES,
  EXTRA_CATEGORIES,
  HARD_LETTERS,
  MAX_CATEGORIES,
  MAX_PLAYERS,
  MIN_CATEGORIES,
} from './logic.js'
import { Avatar } from './ui.jsx'

function Segmented({ label, options, value, onChange }) {
  return (
    <div className="bs-seg" role="group" aria-label={label}>
      {options.map((o) => (
        <button type="button" key={o.value} aria-pressed={value === o.value} onClick={() => onChange(o.value)}>
          {o.label}
        </button>
      ))}
    </div>
  )
}

export default function Setup({ settings, dispatch }) {
  const { players, categories } = settings
  const [name, setName] = useState('')
  const [customCategory, setCustomCategory] = useState('')

  const trimmed = name.trim()
  const duplicate = players.some((p) => p.name.toLowerCase() === trimmed.toLowerCase())
  const full = players.length >= MAX_PLAYERS
  const canAdd = trimmed.length > 0 && !duplicate && !full

  const addPlayer = (e) => {
    e.preventDefault()
    if (!canAdd) return
    dispatch({ type: 'addPlayer', name: trimmed })
    setName('')
  }

  const allCategories = [
    ...DEFAULT_CATEGORIES,
    ...EXTRA_CATEGORIES,
    ...categories.filter((c) => !DEFAULT_CATEGORIES.includes(c) && !EXTRA_CATEGORIES.includes(c)),
  ]

  const toggleCategory = (c) => {
    const selected = categories.includes(c)
    if (selected && categories.length > MIN_CATEGORIES) {
      dispatch({ type: 'settings', patch: { categories: categories.filter((x) => x !== c) } })
    } else if (!selected && categories.length < MAX_CATEGORIES) {
      dispatch({ type: 'settings', patch: { categories: [...categories, c] } })
    }
  }

  const customTrimmed = customCategory.trim()
  const customExists = allCategories.some((c) => c.toLowerCase() === customTrimmed.toLowerCase())
  const addCustom = (e) => {
    e.preventDefault()
    if (!customTrimmed || customExists || categories.length >= MAX_CATEGORIES) return
    const pretty = customTrimmed.charAt(0).toUpperCase() + customTrimmed.slice(1)
    dispatch({ type: 'settings', patch: { categories: [...categories, pretty] } })
    setCustomCategory('')
  }

  const blocker =
    players.length === 0
      ? 'Añade al menos un jugador para empezar.'
      : categories.length < MIN_CATEGORIES
        ? `Elige al menos ${MIN_CATEGORIES} categorías.`
        : null

  return (
    <div className="bs-setup">
      <header className="bs-hero">
        <p className="bs-eyebrow">Tutti frutti para jugar en grupo</p>
        <h1 className="bs-logo">
          <span>¡Basta!</span>
        </h1>
        <p className="bs-hero-sub">
          Sale una letra y todos buscáis palabras que empiecen por ella. Un solo móvil que se pasa
          de mano en mano.
        </p>
      </header>

      <div className="bs-setup-grid">
        {/* Jugadores */}
        <section className="bs-card" aria-labelledby="bs-players-title">
          <div className="bs-card-head">
            <h2 id="bs-players-title">Jugadores</h2>
            <span className="bs-count">
              {players.length} / {MAX_PLAYERS}
            </span>
          </div>

          <form className="bs-inline-form" onSubmit={addPlayer}>
            <label htmlFor="bs-player-name" className="bs-sr">
              Nombre del jugador
            </label>
            <input
              id="bs-player-name"
              className="bs-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={full ? 'Ya sois 8, el máximo' : 'Escribe un nombre'}
              maxLength={16}
              disabled={full}
              autoComplete="off"
              aria-describedby="bs-player-hint"
            />
            <button type="submit" className="bs-btn bs-btn--secondary" disabled={!canAdd}>
              Añadir
            </button>
          </form>
          <p id="bs-player-hint" className={`bs-hint${duplicate && trimmed ? ' is-error' : ''}`} aria-live="polite">
            {duplicate && trimmed
              ? 'Ese nombre ya está. Prueba con otro o añade una inicial.'
              : 'Entre 1 y 8 personas. Con 2 o más se puntúan las respuestas repetidas.'}
          </p>

          {players.length > 0 ? (
            <ul className="bs-players">
              {players.map((p) => (
                <li key={p.id} className="bs-player-chip">
                  <Avatar player={p} size="sm" />
                  <span>{p.name}</span>
                  <button
                    type="button"
                    className="bs-chip-remove"
                    aria-label={`Quitar a ${p.name}`}
                    onClick={() => dispatch({ type: 'removePlayer', id: p.id })}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="bs-empty">Todavía no hay nadie. ¿Quién juega?</p>
          )}
        </section>

        {/* Categorías */}
        <section className="bs-card" aria-labelledby="bs-cat-title">
          <div className="bs-card-head">
            <h2 id="bs-cat-title">Categorías</h2>
            <span className="bs-count">
              {categories.length} elegidas
            </span>
          </div>
          <div className="bs-cats" role="group" aria-label="Categorías de la partida">
            {allCategories.map((c) => {
              const selected = categories.includes(c)
              const locked =
                (selected && categories.length <= MIN_CATEGORIES) ||
                (!selected && categories.length >= MAX_CATEGORIES)
              return (
                <button
                  type="button"
                  key={c}
                  className="bs-cat"
                  aria-pressed={selected}
                  disabled={locked}
                  onClick={() => toggleCategory(c)}
                >
                  {c}
                </button>
              )
            })}
          </div>
          <form className="bs-inline-form bs-inline-form--sm" onSubmit={addCustom}>
            <label htmlFor="bs-custom-cat" className="bs-sr">
              Nueva categoría
            </label>
            <input
              id="bs-custom-cat"
              className="bs-input"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              placeholder="Inventa una categoría"
              maxLength={24}
              autoComplete="off"
            />
            <button
              type="submit"
              className="bs-btn bs-btn--secondary bs-btn--sm"
              disabled={!customTrimmed || customExists || categories.length >= MAX_CATEGORIES}
            >
              Añadir
            </button>
          </form>
          <p className="bs-hint">
            Entre {MIN_CATEGORIES} y {MAX_CATEGORIES}. Toca una categoría para quitarla o ponerla.
          </p>
        </section>

        {/* Ajustes */}
        <section className="bs-card bs-card--settings" aria-labelledby="bs-settings-title">
          <h2 id="bs-settings-title" className="bs-card-title">
            Partida
          </h2>
          <div className="bs-setting">
            <span className="bs-setting-label">Rondas</span>
            <Segmented
              label="Número de rondas"
              value={settings.rounds}
              onChange={(rounds) => dispatch({ type: 'settings', patch: { rounds } })}
              options={[3, 5, 8].map((n) => ({ value: n, label: String(n) }))}
            />
          </div>
          <div className="bs-setting">
            <span className="bs-setting-label">Tiempo por turno</span>
            <Segmented
              label="Tiempo por turno"
              value={settings.seconds}
              onChange={(seconds) => dispatch({ type: 'settings', patch: { seconds } })}
              options={[60, 90, 120].map((n) => ({ value: n, label: `${n} s` }))}
            />
          </div>
          <label className="bs-switch">
            <input
              type="checkbox"
              checked={settings.hardLetters}
              onChange={(e) => dispatch({ type: 'settings', patch: { hardLetters: e.target.checked } })}
            />
            <span className="bs-switch-track" aria-hidden="true" />
            <span>
              Letras difíciles <small>({HARD_LETTERS.join(', ')})</small>
            </span>
          </label>

          <details className="bs-rules">
            <summary>Cómo se juega</summary>
            <ol>
              <li>Gira la ruleta: sale una letra para todos.</li>
              <li>Por turnos, cada persona rellena las categorías con palabras que empiecen por esa letra.</li>
              <li>Cuando lo tengas todo, pulsa ¡Basta! Si se acaba el tiempo, el turno termina solo.</li>
              <li>Al final de la ronda, el grupo revisa las respuestas y puede anular las que no valgan.</li>
            </ol>
            <dl className="bs-points">
              <div>
                <dt>20</dt>
                <dd>Eres la única persona con respuesta válida en esa categoría</dd>
              </div>
              <div>
                <dt>10</dt>
                <dd>Respuesta válida que nadie más ha puesto</dd>
              </div>
              <div>
                <dt>5</dt>
                <dd>Respuesta repetida con otra persona</dd>
              </div>
              <div>
                <dt>0</dt>
                <dd>Vacía, no empieza por la letra o anulada</dd>
              </div>
            </dl>
          </details>
        </section>
      </div>

      <div className="bs-start">
        <button
          type="button"
          className="bs-btn bs-btn--primary bs-btn--xl"
          disabled={Boolean(blocker)}
          onClick={() => dispatch({ type: 'start' })}
        >
          ¡A jugar!
        </button>
        <p className="bs-hint" aria-live="polite">
          {blocker ?? `${players.length} ${players.length === 1 ? 'jugador' : 'jugadores'} · ${categories.length} categorías · ${settings.rounds} rondas`}
        </p>
      </div>
    </div>
  )
}
