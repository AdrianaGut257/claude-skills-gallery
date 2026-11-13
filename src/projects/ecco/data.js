// Catálogo de Ecco, una marca de demostración.
// Las cifras de impacto son estimaciones de ejemplo frente a una prenda convencional equivalente.
// Fotografías: Unsplash vía Wikimedia Commons (CC0), usadas como sustitutas de las fotos de producto.

const img = (name) => `${import.meta.env.BASE_URL}ecco/${name}.jpg`

export const PRODUCTS = [
  {
    id: 'cardigan-alpaca',
    name: 'Cárdigan de alpaca',
    price: 690,
    photo: img('cardigan-alpaca'),
    focus: '60% 35%',
    fibre: '100 % alpaca',
    origin: 'Altiplano, Oruro',
    km: 230,
    water: 1900,
    co2: 6.2,
    tags: ['local', 'natural'],
    alt: 'Mujer de espaldas con un cárdigan gris de punto grueso frente a un valle con niebla',
    note: 'Punto grueso con fibra de alpaca sin teñir. Abriga sin pesar y se lava a mano en agua fría.',
  },
  {
    id: 'sueter-crudo',
    name: 'Suéter de algodón orgánico',
    price: 420,
    photo: img('sueter-crudo'),
    focus: '55% 60%',
    fibre: '100 % algodón orgánico',
    origin: 'Santa Cruz',
    km: 480,
    water: 2300,
    co2: 3.8,
    tags: ['organica', 'local'],
    alt: 'Suéter de punto color crudo doblado sobre una mesa de madera',
    note: 'Punto de panal en algodón cultivado sin pesticidas. El color es el de la fibra: no lleva tinte.',
  },
  {
    id: 'chaqueta-mezclilla',
    name: 'Chaqueta de mezclilla reciclada',
    price: 560,
    photo: img('chaqueta-mezclilla'),
    focus: '50% 40%',
    fibre: '80 % algodón reciclado, 20 % algodón orgánico',
    origin: 'Cochabamba',
    km: 35,
    water: 5400,
    co2: 9.1,
    tags: ['reciclada', 'local'],
    alt: 'Hombre con gorra roja y chaqueta de mezclilla en una playa',
    note: 'Hecha con retazos de mezclilla recuperados en talleres de Cochabamba, cortados y cosidos otra vez.',
  },
  {
    id: 'camiseta-rayas',
    name: 'Camiseta a rayas',
    price: 160,
    photo: img('camiseta-rayas'),
    focus: '50% 55%',
    fibre: '100 % algodón orgánico',
    origin: 'Santa Cruz',
    km: 480,
    water: 2100,
    co2: 2.1,
    tags: ['organica'],
    alt: 'Hombre con camiseta roja de rayas finas en un camino con árboles',
    note: 'Punto liso de algodón orgánico, rayas tejidas y no estampadas: no se agrietan con los lavados.',
  },
  {
    id: 'chaqueta-campo',
    name: 'Chaqueta de mezclilla clara',
    price: 540,
    photo: img('chaqueta-campo'),
    focus: '42% 40%',
    fibre: '100 % algodón reciclado',
    origin: 'Cochabamba',
    km: 35,
    water: 4800,
    co2: 8.3,
    tags: ['reciclada', 'local'],
    alt: 'Mujer sonriente con chaqueta de mezclilla clara en un campo de hierba seca',
    note: 'Lavado claro conseguido con ozono en lugar de piedra pómez y cloro.',
  },
  {
    id: 'cuello-alto',
    name: 'Jersey de cuello alto',
    price: 480,
    photo: img('cuello-alto'),
    focus: '50% 40%',
    fibre: '100 % lana de oveja criolla',
    origin: 'Potosí',
    km: 520,
    water: 1200,
    co2: 4.0,
    tags: ['natural', 'local'],
    alt: 'Mujer con jersey blanco de cuello alto sentada en un coche antiguo',
    note: 'Lana de oveja criolla hilada en cooperativas de Potosí. Cuello doble que no da de sí.',
  },
  {
    id: 'manta-poncho',
    name: 'Manta tejida de llama',
    price: 750,
    photo: img('manta-poncho'),
    focus: '50% 45%',
    fibre: '100 % fibra de llama',
    origin: 'Altiplano, La Paz',
    km: 380,
    water: 900,
    co2: 5.5,
    tags: ['natural', 'local', 'mano'],
    alt: 'Persona envuelta en una manta tejida mirando un lago entre montañas',
    note: 'Tejida a mano en telar de cintura. Cada pieza tarda unas dos semanas.',
  },
  {
    id: 'chal-azul',
    name: 'Chal tejido a mano',
    price: 310,
    photo: img('chal-azul'),
    focus: '45% 50%',
    fibre: '70 % alpaca, 30 % algodón orgánico',
    origin: 'Tarabuco, Chuquisaca',
    km: 610,
    water: 700,
    co2: 1.9,
    tags: ['natural', 'mano'],
    alt: 'Mujer con un chal azul de punto grueso a orillas de un lago',
    note: 'Punto calado tejido a mano por artesanas de Tarabuco, teñido con índigo.',
  },
]

export const productById = Object.fromEntries(PRODUCTS.map((p) => [p.id, p]))

export const FILTERS = [
  { id: 'todas', label: 'Todas' },
  { id: 'reciclada', label: 'Reciclada' },
  { id: 'organica', label: 'Orgánica' },
  { id: 'natural', label: 'Fibra animal' },
  { id: 'local', label: 'Hecho en Bolivia' },
  { id: 'mano', label: 'Hecho a mano' },
]

export const SORTS = [
  { id: 'agua', label: 'Más agua ahorrada' },
  { id: 'co2', label: 'Más CO₂ evitado' },
  { id: 'precio', label: 'Precio más bajo' },
]

export const SIZES = ['XS', 'S', 'M', 'L', 'XL']

const nf = new Intl.NumberFormat('es-BO')
const nf1 = new Intl.NumberFormat('es-BO', { minimumFractionDigits: 1, maximumFractionDigits: 1 })

export const formatBs = (n) => `Bs ${nf.format(n)}`
export const formatLitres = (n) => `${nf.format(Math.round(n))} L`
export const formatKg = (n) => `${nf1.format(n)} kg`

// Una ducha de 5 minutos gasta unos 50 litros: sirve para que los litros se entiendan.
export const showers = (litres) => Math.round(litres / 50)
