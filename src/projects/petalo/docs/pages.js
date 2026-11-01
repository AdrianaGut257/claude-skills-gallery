// Páginas de la documentación y utilidades de formato compartidas.

export const PAGES = [
  { slug: '', title: 'Inicio', icon: 'home', group: 'Empieza', desc: 'Qué es Pétalo y para quién es.' },
  { slug: 'empezar', title: 'Empezar', icon: 'rocket', group: 'Empieza', desc: 'Añade Pétalo a un proyecto React en cinco minutos.' },
  { slug: 'tokens', title: 'Tokens', icon: 'palette', group: 'Fundamentos', desc: 'Colores, espacios y radios, en dos capas.' },
  { slug: 'tipografia', title: 'Tipografía', icon: 'type', group: 'Fundamentos', desc: 'Fuente, escala fluida y medidas de lectura.' },
  { slug: 'componentes', title: 'Componentes', icon: 'component', group: 'Construye', desc: 'Button, Field, Badge, Switch y Notice.' },
  { slug: 'contraste', title: 'Contraste', icon: 'contrast', group: 'Construye', desc: 'Comprueba colores y audita los temas.' },
  { slug: 'cambios', title: 'Cambios', icon: 'history', group: 'Proyecto', desc: 'Registro de versiones.' },
]

export const href = (slug) => `#/petalo${slug ? `/${slug}` : ''}`

// 5.44 → "5,44:1"
export const formatRatio = (r) => `${r.toFixed(2).replace('.', ',')}:1`
