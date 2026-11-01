import { useEffect, useState } from 'react'
import { Badge, PetaloTheme } from './ds/components.jsx'
import { Icon, PetalMark } from './ds/icons.jsx'
import Changelog from './docs/Changelog.jsx'
import Components from './docs/Components.jsx'
import Contrast from './docs/Contrast.jsx'
import Home from './docs/Home.jsx'
import Start from './docs/Start.jsx'
import Tokens from './docs/Tokens.jsx'
import Typography from './docs/Typography.jsx'
import { PAGES, href } from './docs/pages.js'
import { Pager } from './docs/ui.jsx'
import './petalo.css'

// "#/petalo" es el inicio y "#/petalo/<página>" cada página de la documentación.
const ROUTES = {
  '': Home,
  empezar: Start,
  tokens: Tokens,
  tipografia: Typography,
  componentes: Components,
  contraste: Contrast,
  cambios: Changelog,
}

const THEME_KEY = 'petalo:theme'

function initialTheme() {
  try {
    const saved = localStorage.getItem(THEME_KEY)
    if (saved === 'light' || saved === 'dark') return saved
  } catch {
    // Sin almacenamiento: se usa la preferencia del sistema.
  }
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function ThemeToggle({ theme, onChange }) {
  return (
    <div className="pd-segmented pd-theme-toggle" role="group" aria-label="Tema">
      <button type="button" aria-pressed={theme === 'light'} onClick={() => onChange('light')}>
        <Icon name="sun" size={16} />
        <span>Claro</span>
      </button>
      <button type="button" aria-pressed={theme === 'dark'} onClick={() => onChange('dark')}>
        <Icon name="moon" size={16} />
        <span>Oscuro</span>
      </button>
    </div>
  )
}

function Logo() {
  return (
    <a className="pd-logo" href={href('')}>
      <PetalMark size={30} />
      <span>Pétalo</span>
      <Badge>v1.0</Badge>
    </a>
  )
}

export default function Petalo({ subpath }) {
  const [theme, setTheme] = useState(initialTheme)
  const slug = ROUTES[subpath] ? subpath : ''
  const Page = ROUTES[slug]
  const groups = [...new Set(PAGES.map((p) => p.group))]

  useEffect(() => {
    try {
      localStorage.setItem(THEME_KEY, theme)
    } catch {
      // Sin almacenamiento: el tema dura hasta recargar.
    }
  }, [theme])

  return (
    <PetaloTheme theme={theme} className="pd">
      <aside className="pd-side">
        <Logo />
        <nav aria-label="Documentación">
          {groups.map((g) => (
            <div key={g} className="pd-nav-group">
              <p>{g}</p>
              <ul>
                {PAGES.filter((p) => p.group === g).map((p) => (
                  <li key={p.slug}>
                    <a className="pd-nav-link" href={href(p.slug)} aria-current={p.slug === slug ? 'page' : undefined}>
                      <Icon name={p.icon} size={17} />
                      {p.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
        <ThemeToggle theme={theme} onChange={setTheme} />
      </aside>

      <header className="pd-topbar">
        <Logo />
        <ThemeToggle theme={theme} onChange={setTheme} />
      </header>
      <nav className="pd-mobile-nav" aria-label="Documentación">
        {PAGES.map((p) => (
          <a key={p.slug} className="pd-nav-link" href={href(p.slug)} aria-current={p.slug === slug ? 'page' : undefined}>
            {p.title}
          </a>
        ))}
      </nav>

      <main className="pd-main">
        <div className={`pd-content${slug === '' ? ' is-wide' : ''}`}>
          <Page theme={theme} />
          <Pager slug={slug} />
        </div>
      </main>
    </PetaloTheme>
  )
}
