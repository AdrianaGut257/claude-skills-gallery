// Piezas visuales compartidas del juego

export function Avatar({ player, size = 'md' }) {
  return (
    <span className={`bs-avatar bs-avatar--${size}`} style={{ '--c': player.color }} aria-hidden="true">
      {player.name.trim().charAt(0).toUpperCase()}
    </span>
  )
}

export function LetterTile({ letter, size = 'md' }) {
  return (
    <span className={`bs-tile bs-tile--${size}`} aria-label={`Letra ${letter}`}>
      {letter}
    </span>
  )
}
