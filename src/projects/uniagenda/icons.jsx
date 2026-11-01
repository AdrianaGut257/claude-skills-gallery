// Iconos de línea en una cuadrícula de 24 px y trazo de 1,75 px.
// Son decorativos por defecto (aria-hidden); los botones de solo icono llevan su propio aria-label.

const PATHS = {
  today: (
    <>
      <rect x="3.5" y="5" width="17" height="15.5" rx="3" />
      <path d="M3.5 9.5h17M8 3v4M16 3v4" />
      <circle cx="12" cy="15" r="2" />
    </>
  ),
  week: (
    <>
      <rect x="3.5" y="5" width="17" height="15.5" rx="3" />
      <path d="M3.5 9.5h17M8 3v4M16 3v4M9.2 9.5v11M14.8 9.5v11M3.5 15h17" />
    </>
  ),
  tasks: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="3.5" />
      <path d="m8.5 12 2.4 2.4 4.6-4.8" />
    </>
  ),
  exam: (
    <>
      <path d="M7 3.5h7.5L19 8v11a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 6 19V5a1.5 1.5 0 0 1 1-1.5Z" />
      <path d="M14 3.5V8h5M9 12.5h6M9 16h4" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  chevronRight: <path d="m9.5 6 6 6-6 6" />,
  chevronLeft: <path d="m14.5 6-6 6 6 6" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" />
      <circle cx="12" cy="10" r="2.3" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8.5" r="3.5" />
      <path d="M5 20c.8-3.6 3.6-5.5 7-5.5s6.2 1.9 7 5.5" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="9" r="3.2" />
      <path d="M3.5 19.5c.6-3.2 2.8-5 5.5-5s4.9 1.8 5.5 5M15.5 6.2a3 3 0 0 1 0 5.6M17.5 14.8c1.6.6 2.7 2.2 3 4.7" />
    </>
  ),
  flag: <path d="M6 21V4.5M6 4.5h10.5l-2 4 2 4H6" />,
  bulb: (
    <>
      <path d="M9 17.5h6M10 21h4" />
      <path d="M12 3a6 6 0 0 0-3.6 10.8c.5.4.8 1 .8 1.6v.6h5.6v-.6c0-.6.3-1.2.8-1.6A6 6 0 0 0 12 3Z" />
    </>
  ),
  bell: (
    <>
      <path d="M6.5 16.5V11a5.5 5.5 0 0 1 11 0v5.5l1.5 2h-14Z" />
      <path d="M10 20.5a2 2 0 0 0 4 0" />
    </>
  ),
  play: <path d="M8 5.5v13l10.5-6.5Z" />,
  pause: <path d="M8.5 5.5v13M15.5 5.5v13" />,
  skip: <path d="M6 5.5v13l9-6.5ZM18 5.5v13" />,
  stop: <rect x="6.5" y="6.5" width="11" height="11" rx="2" />,
  focus: (
    <>
      <circle cx="12" cy="13" r="7.5" />
      <path d="M12 9v4l2.5 1.5M9.5 2.5h5M12 2.5v3" />
    </>
  ),
  coffee: (
    <>
      <path d="M4.5 9h12v5.5a5 5 0 0 1-5 5h-2a5 5 0 0 1-5-5Z" />
      <path d="M16.5 10.5h1.2a2.3 2.3 0 0 1 0 4.6h-1.5M8.5 3.5v2.5M12.5 3.5v2.5" />
    </>
  ),
  book: (
    <>
      <path d="M12 6.5c-1.8-1.4-4.5-2-7.5-2v13c3 0 5.7.6 7.5 2 1.8-1.4 4.5-2 7.5-2v-13c-3 0-5.7.6-7.5 2Z" />
      <path d="M12 6.5v13" />
    </>
  ),
  grid: (
    <>
      <rect x="4" y="4" width="6.5" height="6.5" rx="1.5" />
      <rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5" />
      <rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5" />
      <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5" />
    </>
  ),
  alert: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5v5.5M12 16.2v.3" />
    </>
  ),
  lab: (
    <>
      <path d="M9.5 3.5h5M10.5 3.5v6l-5 8.5a1.6 1.6 0 0 0 1.4 2.5h10.2a1.6 1.6 0 0 0 1.4-2.5l-5-8.5v-6" />
      <path d="M7.5 15h9" />
    </>
  ),
  sparkle: <path d="M12 3.5 13.8 10l6.7 2-6.7 2L12 20.5 10.2 14l-6.7-2 6.7-2Z" />,
  phone: (
    <>
      <rect x="6.5" y="2.5" width="11" height="19" rx="2.5" />
      <path d="M10.5 18.5h3" />
    </>
  ),
}

export function Icon({ name, size = 24, label, ...rest }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={label ? undefined : 'true'}
      role={label ? 'img' : undefined}
      aria-label={label}
      focusable="false"
      {...rest}
    >
      {PATHS[name]}
    </svg>
  )
}
