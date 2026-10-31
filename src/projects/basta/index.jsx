import { useEffect, useReducer } from 'react'
import { loadState, reducer, saveState } from './game.js'
import { letterPool } from './logic.js'
import Review from './Review.jsx'
import { Final, Scores } from './Results.jsx'
import Setup from './Setup.jsx'
import Spin from './Spin.jsx'
import { Handoff, Turn } from './Turn.jsx'
import './basta.css'

export default function Basta() {
  const [state, dispatch] = useReducer(reducer, undefined, loadState)
  const { phase, settings, game } = state

  useEffect(() => saveState(state), [state])

  const players = settings.players
  const current = game ? players[game.turn] : null
  const inGame = phase !== 'setup' && game

  const quit = () => {
    if (window.confirm('¿Salir de la partida? Se perderán los puntos de esta partida.')) {
      dispatch({ type: 'quit' })
    }
  }

  let screen
  if (!inGame) {
    screen = <Setup settings={settings} dispatch={dispatch} />
  } else if (phase === 'spin') {
    screen = (
      <Spin
        key={game.round}
        pool={letterPool(settings.hardLetters)}
        used={game.usedLetters}
        letter={game.letter}
        round={game.round}
        totalRounds={settings.rounds}
        sound={settings.sound}
        onLetter={(letter) => dispatch({ type: 'letter', letter })}
        onBegin={() => dispatch({ type: 'beginTurns' })}
      />
    )
  } else if (phase === 'handoff') {
    screen = (
      <Handoff
        key={current.id}
        player={current}
        index={game.turn}
        total={players.length}
        letter={game.letter}
        onStart={() => dispatch({ type: 'startTurn' })}
      />
    )
  } else if (phase === 'turn') {
    screen = (
      <Turn
        key={`${game.round}-${current.id}`}
        player={current}
        letter={game.letter}
        categories={settings.categories}
        seconds={settings.seconds}
        sound={settings.sound}
        onEnd={(result) => dispatch({ type: 'endTurn', ...result })}
      />
    )
  } else if (phase === 'review') {
    screen = (
      <Review
        players={players}
        categories={settings.categories}
        letter={game.letter}
        answers={game.answers}
        rejected={game.rejected}
        onToggle={(key) => dispatch({ type: 'toggleReject', key })}
        onConfirm={() => dispatch({ type: 'confirmRound' })}
      />
    )
  } else if (phase === 'scores') {
    screen = (
      <Scores
        players={players}
        categories={settings.categories}
        game={game}
        totalRounds={settings.rounds}
        isLast={game.round >= settings.rounds}
        onNext={() => dispatch({ type: 'nextRound' })}
        onFinish={() => dispatch({ type: 'finish' })}
      />
    )
  } else {
    screen = (
      <Final
        players={players}
        game={game}
        sound={settings.sound}
        onRematch={() => dispatch({ type: 'rematch' })}
        onEditSetup={() => dispatch({ type: 'quit' })}
      />
    )
  }

  return (
    <div className="bs">
      {inGame && (
        <header className="bs-header">
          <span className="bs-header-logo">¡Basta!</span>
          <span className="bs-header-round">
            Ronda {game.round}/{settings.rounds}
          </span>
          <div className="bs-header-actions">
            <button
              type="button"
              className="bs-icon-btn"
              aria-pressed={settings.sound}
              onClick={() => dispatch({ type: 'settings', patch: { sound: !settings.sound } })}
            >
              {settings.sound ? 'Sonido: sí' : 'Sonido: no'}
            </button>
            {phase !== 'final' && (
              <button type="button" className="bs-icon-btn" onClick={quit}>
                Salir
              </button>
            )}
          </div>
        </header>
      )}
      <main className="bs-main">{screen}</main>
    </div>
  )
}
