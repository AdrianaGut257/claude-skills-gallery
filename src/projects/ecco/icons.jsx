// Iconos de línea, cuadrícula de 24 px y trazo de 1,6 px. Decorativos salvo que lleven label.
const PATHS = {
  bag: (
    <>
      <path d="M5.5 8h13l-1 12.5h-11Z" />
      <path d="M9 10.5V7a3 3 0 0 1 6 0v3.5" />
    </>
  ),
  arrowRight: <path d="M5 12h13.5M13 6.5l5.5 5.5-5.5 5.5" />,
  arrowLeft: <path d="M19 12H5.5M11 6.5 5.5 12l5.5 5.5" />,
  plus: <path d="M12 5.5v13M5.5 12h13" />,
  minus: <path d="M5.5 12h13" />,
  close: <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" />,
  drop: <path d="M12 3.5s6 6.4 6 10.6a6 6 0 0 1-12 0C6 9.9 12 3.5 12 3.5Z" />,
  cloud: (
    <>
      <path d="M7.5 18.5a4 4 0 0 1-.6-8 5.5 5.5 0 0 1 10.6 1.4 3.3 3.3 0 0 1-.5 6.6Z" />
    </>
  ),
  leaf: (
    <>
      <path d="M5 19c0-8.5 5-13.5 14-14 .3 9-4.7 14-13.5 14" />
      <path d="M5 19c3-4 6-6.5 9.5-8" />
    </>
  ),
  pin: (
    <>
      <path d="M12 20.5s-6-5.3-6-10.3a6 6 0 0 1 12 0c0 5-6 10.3-6 10.3Z" />
      <circle cx="12" cy="10.2" r="2.1" />
    </>
  ),
  route: (
    <>
      <circle cx="6" cy="18" r="2" />
      <circle cx="18" cy="6" r="2" />
      <path d="M8 18h7.5a3.5 3.5 0 0 0 0-7h-7a3.5 3.5 0 0 1 0-7H16" />
    </>
  ),
  thread: (
    <>
      <path d="M8 4.5h8M8 19.5h8M9 4.5v15M15 4.5v15" />
      <path d="M9 8.5l6 3M9 12l6 3M9 15.5l6-7" />
    </>
  ),
  check: <path d="m5.5 12.5 4 4 9-9" />,
  hand: (
    <>
      <path d="M8 13V6.5a1.5 1.5 0 0 1 3 0V12M11 11V5a1.5 1.5 0 0 1 3 0v6M14 11V6.5a1.5 1.5 0 0 1 3 0V14a6 6 0 0 1-6 6h-.5a6 6 0 0 1-4.8-2.4L4 15.4a1.5 1.5 0 0 1 2.3-1.9L8 15" />
    </>
  ),
}

export function Icon({ name, size = 22, label, ...rest }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
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
