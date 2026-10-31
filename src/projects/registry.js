import { lazy } from 'react'

// Lista de proyectos de la galería.
// Para añadir uno nuevo: crea su carpeta en src/projects/<slug>/ y añade una entrada aquí.
export const projects = [
  {
    slug: 'dayflow',
    number: '01',
    title: 'DAYFLOW',
    kind: 'Landing page',
    date: '2026-10-31',
    description:
      'Landing de una app de productividad centrada en la calma y la claridad mental. "Make space for what matters."',
    skills: ['ux-heuristics', 'top-design', 'storybrand-messaging', 'cro-methodology'],
    preview: {
      bg: '#F6F3EE',
      fg: '#1C1B19',
      deco: '#ECE5D8',
      font: "'Instrument Serif', serif",
      text: 'Haz espacio para lo que importa.',
    },
    component: lazy(() => import('./dayflow/DayflowLanding.jsx')),
  },
]
