// Iconos de línea, 24 px, trazo 1,7 px.
const PATHS = {
  overview: (
    <>
      <rect x="3.5" y="3.5" width="7" height="9" rx="1.5" />
      <rect x="13.5" y="3.5" width="7" height="5" rx="1.5" />
      <rect x="13.5" y="11.5" width="7" height="9" rx="1.5" />
      <rect x="3.5" y="15.5" width="7" height="5" rx="1.5" />
    </>
  ),
  projects: <path d="M3.5 7.5a2 2 0 0 1 2-2h4l2 2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2Z" />,
  clients: (
    <>
      <circle cx="9" cy="8.5" r="3.2" />
      <path d="M3.5 19.5c.6-3.2 2.8-5 5.5-5s4.9 1.8 5.5 5M15.5 5.7a3 3 0 0 1 0 5.6M17.5 14.6c1.6.6 2.7 2.2 3 4.9" />
    </>
  ),
  reports: (
    <>
      <path d="M6.5 3.5h7l4 4v12a1 1 0 0 1-1 1h-10a1 1 0 0 1-1-1v-15a1 1 0 0 1 1-1Z" />
      <path d="M13.5 3.5v4h4M9 17v-3M12 17v-5.5M15 17v-2" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4 4" />
    </>
  ),
  alert: (
    <>
      <path d="M12 4.5 21 19.5H3Z" />
      <path d="M12 10v4M12 16.8v.2" />
    </>
  ),
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  download: <path d="M12 4v11M7 10.5l5 5 5-5M5 19.5h14" />,
  copy: (
    <>
      <rect x="8.5" y="8.5" width="11" height="11" rx="2" />
      <path d="M15.5 8.5v-3a1.5 1.5 0 0 0-1.5-1.5H5.5A1.5 1.5 0 0 0 4 5.5V14a1.5 1.5 0 0 0 1.5 1.5h3" />
    </>
  ),
  arrowRight: <path d="M5 12h13.5M13 6.5l5.5 5.5-5.5 5.5" />,
  arrowUp: <path d="M12 19V5.5M6.5 11 12 5.5l5.5 5.5" />,
  arrowDown: <path d="M12 5v13.5M6.5 13l5.5 5.5 5.5-5.5" />,
  sort: <path d="M8 5v14M4.5 15.5 8 19l3.5-3.5M16 19V5M12.5 8.5 16 5l3.5 3.5" />,
  close: <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" />,
  pulse: <path d="M3 12h4l2.5-6 5 12 2.5-6h4" />,
  external: <path d="M14 4.5h5.5V10M19.5 4.5 11 13M17 13.5v5a1 1 0 0 1-1 1H5.5a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h5" />,
  grid: (
    <>
      <rect x="4" y="4" width="6.5" height="6.5" rx="1.5" />
      <rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5" />
      <rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5" />
      <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5" />
    </>
  ),
}

export function Icon({ name, size = 20, label, ...rest }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
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
