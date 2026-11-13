// Animes inventados para la demostración: títulos, sinopsis y portadas son originales.
// "art" describe el cartel geométrico que dibuja Cover.jsx.

export const GENRES = ['Fantasía', 'Romance', 'Acción', 'Slice of life', 'Ciencia ficción', 'Misterio', 'Deportes', 'Comedia']

export const STATUSES = [
  { id: 'viendo', label: 'Viendo' },
  { id: 'pendiente', label: 'Pendiente' },
  { id: 'completado', label: 'Completado' },
  { id: 'abandonado', label: 'Abandonado' },
]

export const ANIME = [
  {
    id: 'kaze',
    title: 'Kaze no Tegami',
    es: 'Cartas del viento',
    year: 2025,
    episodes: 12,
    genres: ['Slice of life', 'Romance'],
    synopsis:
      'Una cartera de un pueblo costero entrega cartas que el viento se lleva antes de tiempo. Cada capítulo, una carta y alguien que la esperaba.',
    art: { sky: ['#ffb3d6', '#ff8fc7'], ground: '#5a2d6b', motif: 'sun', accent: '#fff1f8' },
  },
  {
    id: 'yoru',
    title: 'Yoru no Kitsune',
    es: 'El zorro de la noche',
    year: 2024,
    episodes: 24,
    genres: ['Fantasía', 'Misterio'],
    synopsis:
      'Un zorro de nueve colas guarda las linternas de un santuario olvidado. Cuando se apaga una, alguien del pueblo pierde un recuerdo.',
    art: { sky: ['#2a1b4a', '#4b2d7a'], ground: '#140c26', motif: 'moon', accent: '#ffcf8f' },
  },
  {
    id: 'tetsu',
    title: 'Tetsu Ryū',
    es: 'Dragón de hierro',
    year: 2023,
    episodes: 25,
    genres: ['Acción', 'Ciencia ficción'],
    synopsis:
      'En una ciudad vertical, un mecánico de diecisiete años despierta a un robot dragón que nadie sabe pilotar. Excepto él, más o menos.',
    art: { sky: ['#8fd3ff', '#3b6fd8'], ground: '#1d1430', motif: 'grid', accent: '#ff6b6b' },
  },
  {
    id: 'hoshizora',
    title: 'Hoshizora Café',
    es: 'Café bajo las estrellas',
    year: 2025,
    episodes: 12,
    genres: ['Romance', 'Comedia'],
    synopsis:
      'Un café que solo abre las noches despejadas, una camarera que lee las estrellas y un cliente que siempre pide lo mismo.',
    art: { sky: ['#1f2a5c', '#6b4fa8'], ground: '#ff8fc7', motif: 'stars', accent: '#fff1f8' },
  },
  {
    id: 'shiro',
    title: 'Shiro Racket',
    es: 'Raqueta blanca',
    year: 2024,
    episodes: 24,
    genres: ['Deportes', 'Comedia'],
    synopsis:
      'El club de bádminton de un instituto tiene tres miembros, una raqueta prestada y un torneo regional en dos meses.',
    art: { sky: ['#d9f1ff', '#8fd3ff'], ground: '#ff8fc7', motif: 'arc', accent: '#1d1430' },
  },
  {
    id: 'mizu',
    title: 'Mizu Kagami',
    es: 'Espejo de agua',
    year: 2023,
    episodes: 13,
    genres: ['Misterio', 'Fantasía'],
    synopsis:
      'Una detective que ve en los charcos lo que pasó ayer. El problema es que los charcos también la ven a ella.',
    art: { sky: ['#1a3a4a', '#2f7a8a'], ground: '#0d1f2a', motif: 'ripple', accent: '#8fd3ff' },
  },
  {
    id: 'ginga',
    title: 'Ginga Bento',
    es: 'Bento galáctico',
    year: 2025,
    episodes: 12,
    genres: ['Ciencia ficción', 'Comedia'],
    synopsis:
      'La única tienda de bentos de una estación espacial compite con una máquina expendedora que acaba de aprender a hablar.',
    art: { sky: ['#ffcf8f', '#ff8f6b'], ground: '#2a1b4a', motif: 'planet', accent: '#8fd3ff' },
  },
  {
    id: 'ame',
    title: 'Ame Fure Shōnen',
    es: 'El chico de la lluvia',
    year: 2022,
    episodes: 11,
    genres: ['Slice of life', 'Misterio'],
    synopsis:
      'Donde va Haru, llueve. Lleva tres años sin ver el sol hasta que una compañera nueva le presta un paraguas amarillo.',
    art: { sky: ['#5d6a8a', '#2e3550'], ground: '#ffd23f', motif: 'rain', accent: '#ffd23f' },
  },
  {
    id: 'kosoku',
    title: 'Kōsoku Ninja Zero',
    es: 'Ninja veloz cero',
    year: 2024,
    episodes: 26,
    genres: ['Acción', 'Comedia'],
    synopsis:
      'El ninja más rápido de su clan llega siempre tarde a todo. Su nuevo maestro es una tortuga.',
    art: { sky: ['#ff6b6b', '#c23a5e'], ground: '#1d1430', motif: 'slash', accent: '#fff1f8' },
  },
  {
    id: 'neko',
    title: 'Neko Neko Toshokan',
    es: 'La biblioteca de los gatos',
    year: 2023,
    episodes: 12,
    genres: ['Comedia', 'Slice of life'],
    synopsis:
      'Una biblioteca municipal donde los gatos eligen qué libro te llevas. Nadie ha conseguido devolver uno a tiempo.',
    art: { sky: ['#fff1f8', '#ffd6ea'], ground: '#8fd3ff', motif: 'ears', accent: '#1d1430' },
  },
  {
    id: 'sora',
    title: 'Sora no Kakera',
    es: 'Fragmentos del cielo',
    year: 2025,
    episodes: 24,
    genres: ['Fantasía', 'Acción'],
    synopsis:
      'El cielo se rompió hace cien años y los fragmentos cayeron como islas. Una cartógrafa intenta dibujar el mapa completo.',
    art: { sky: ['#8fd3ff', '#ff8fc7'], ground: '#2a1b4a', motif: 'shards', accent: '#fff1f8' },
  },
  {
    id: 'hanabi',
    title: 'Hanabi Biyori',
    es: 'Buen día para fuegos artificiales',
    year: 2024,
    episodes: 12,
    genres: ['Romance', 'Slice of life'],
    synopsis:
      'Dos aprendices de pirotecnia preparan el festival de verano de su barrio. Solo tienen una oportunidad de que salga bien.',
    art: { sky: ['#1d1430', '#3a2363'], ground: '#140c26', motif: 'burst', accent: '#ff8fc7' },
  },
]

export const animeById = Object.fromEntries(ANIME.map((a) => [a.id, a]))

// Lista inicial: lo que "ya" estabas viendo.
export const SEED_LIST = [
  { id: 'yoru', status: 'viendo', progress: 17, rating: 5 },
  { id: 'kaze', status: 'viendo', progress: 9, rating: 4 },
  { id: 'shiro', status: 'viendo', progress: 4, rating: 0 },
  { id: 'mizu', status: 'completado', progress: 13, rating: 5 },
  { id: 'ame', status: 'completado', progress: 11, rating: 4 },
  { id: 'tetsu', status: 'pendiente', progress: 0, rating: 0 },
  { id: 'kosoku', status: 'abandonado', progress: 6, rating: 2 },
]
