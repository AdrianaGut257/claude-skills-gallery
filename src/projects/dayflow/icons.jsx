// Iconos compartidos entre la landing y la app de DAYFLOW

export function Mark() {
  return (
    <svg className="df-mark" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 16.5h18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M6.5 16.5a5.5 5.5 0 0 1 11 0" className="df-mark-sun" />
    </svg>
  )
}

export function CheckIcon() {
  return (
    <svg viewBox="0 0 16 16" className="df-check-icon" aria-hidden="true">
      <path
        d="M3.5 8.5l3 3 6-7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
