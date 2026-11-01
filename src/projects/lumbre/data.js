// Contenido de Café Lumbre. Marca de demostración del portafolio.

export const CATEGORIES = [
  { id: 'espresso', label: 'Espresso', icon: 'coffee' },
  { id: 'filtrados', label: 'Filtrados', icon: 'droplets' },
  { id: 'frios', label: 'Fríos', icon: 'cupSoda' },
  { id: 'comer', label: 'Para acompañar', icon: 'cookie' },
]

// price en bolivianos (Bs). drink: bebida que muestra la taza 3D al elegirla.
export const MENU = [
  { id: 'espresso', cat: 'espresso', name: 'Espresso', desc: 'Doble, corto y con crema atigrada.', price: 12, drink: 'espresso' },
  { id: 'cortado', cat: 'espresso', name: 'Cortado', desc: 'Espresso con una nube de leche.', price: 15, drink: 'espresso' },
  { id: 'capuchino', cat: 'espresso', name: 'Capuchino', desc: 'Leche texturizada y latte art.', price: 18, drink: 'capuchino', tag: 'El de la casa' },
  { id: 'latte', cat: 'espresso', name: 'Latte', desc: 'Más leche, más suave, en taza grande.', price: 20, drink: 'capuchino' },
  { id: 'mocha', cat: 'espresso', name: 'Mocha', desc: 'Espresso, chocolate boliviano y leche.', price: 22, drink: 'mocha' },
  { id: 'v60', cat: 'filtrados', name: 'V60', desc: 'Filtrado a mano. Notas a panela y naranja.', price: 22 },
  { id: 'chemex', cat: 'filtrados', name: 'Chemex para dos', desc: 'Medio litro para compartir sin prisa.', price: 38 },
  { id: 'prensa', cat: 'filtrados', name: 'Prensa francesa', desc: 'Cuerpo redondo, cuatro minutos de espera.', price: 25 },
  { id: 'coldbrew', cat: 'frios', name: 'Cold brew', desc: 'Dieciocho horas en frío, servido con hielo.', price: 22, tag: 'Nuevo' },
  { id: 'tonic', cat: 'frios', name: 'Espresso tonic', desc: 'Tónica, hielo y un espresso por encima.', price: 24 },
  { id: 'frappe', cat: 'frios', name: 'Frappé de café', desc: 'Batido con hielo y leche entera.', price: 26 },
  { id: 'cunape', cat: 'comer', name: 'Cuñapé', desc: 'Pan de queso y almidón de yuca, recién horneado.', price: 4 },
  { id: 'saltena', cat: 'comer', name: 'Salteña', desc: 'Jugosa, de carne. Solo por la mañana.', price: 10 },
  { id: 'alfajor', cat: 'comer', name: 'Alfajor de maicena', desc: 'Relleno de dulce de leche y coco.', price: 6 },
  { id: 'queque', cat: 'comer', name: 'Queque de naranja', desc: 'Porción generosa, hecho en casa.', price: 9 },
]

// 0 = domingo. open/close en horas decimales (7.5 = 7:30).
export const HOURS = [
  { day: 1, label: 'Lunes', open: 7, close: 20 },
  { day: 2, label: 'Martes', open: 7, close: 20 },
  { day: 3, label: 'Miércoles', open: 7, close: 20 },
  { day: 4, label: 'Jueves', open: 7, close: 20 },
  { day: 5, label: 'Viernes', open: 7, close: 21 },
  { day: 6, label: 'Sábado', open: 8, close: 21 },
  { day: 0, label: 'Domingo', open: 8, close: 13 },
]

export const TIMEZONE = 'America/La_Paz'

export const formatBs = (n) => `Bs ${n}`
export const formatHour = (h) => `${Math.floor(h)}:${h % 1 ? '30' : '00'}`
