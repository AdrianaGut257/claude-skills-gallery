// Datos de demostración de Pulso. Empresas, personas y cifras son inventadas.

export const TEAM = {
  ana: { name: 'Ana Quiroga', role: 'Líder técnica', initials: 'AQ', hue: 340 },
  bruno: { name: 'Bruno Céspedes', role: 'Backend', initials: 'BC', hue: 200 },
  carla: { name: 'Carla Mendoza', role: 'Frontend', initials: 'CM', hue: 30 },
  diego: { name: 'Diego Rojas', role: 'QA', initials: 'DR', hue: 150 },
  elena: { name: 'Elena Vargas', role: 'Producto', initials: 'EV', hue: 270 },
}

export const CLIENTS = [
  { id: 'pukara', name: 'Cooperativa Pukara', sector: 'Finanzas', health: 86, lastContact: -2, invoices: 1, since: 2021 },
  { id: 'valle', name: 'Farmacia Valle Alto', sector: 'Salud', health: 72, lastContact: -6, invoices: 2, since: 2022 },
  { id: 'qochala', name: "Transportes Q'ochala", sector: 'Logística', health: 48, lastContact: -15, invoices: 3, since: 2023 },
  { id: 'horizonte', name: 'Colegio Nuevo Horizonte', sector: 'Educación', health: 91, lastContact: -1, invoices: 0, since: 2020 },
  { id: 'agrovida', name: 'Agrovida Chapare', sector: 'Agro', health: 64, lastContact: -9, invoices: 1, since: 2023 },
  { id: 'ceibo', name: 'Clínica Ceibo Sur', sector: 'Salud', health: 38, lastContact: -21, invoices: 4, since: 2022 },
  { id: 'mirador', name: 'Hotel Mirador', sector: 'Turismo', health: 79, lastContact: -4, invoices: 0, since: 2024 },
  { id: 'andino', name: 'Banco Comunal Andino', sector: 'Finanzas', health: 88, lastContact: -3, invoices: 1, since: 2021 },
]

export const clientById = Object.fromEntries(CLIENTS.map((c) => [c.id, c]))

export const STATUS = {
  curso: { label: 'En curso', tone: 'ok' },
  riesgo: { label: 'En riesgo', tone: 'warn' },
  pausa: { label: 'En pausa', tone: 'idle' },
  entregado: { label: 'Entregado', tone: 'done' },
}

// due: días desde hoy (negativo = ya pasó)
export const SEED_PROJECTS = [
  { id: 'p1', name: 'App de socios', client: 'pukara', lead: 'ana', status: 'curso', progress: 68, due: 18, hoursUsed: 412, hoursBudget: 600, risk: null },
  { id: 'p2', name: 'Inventario de farmacias', client: 'valle', lead: 'bruno', status: 'riesgo', progress: 54, due: 6, hoursUsed: 498, hoursBudget: 520, risk: 'Quedan 22 h de presupuesto para el 46 % del trabajo' },
  { id: 'p3', name: 'Rastreo de flota', client: 'qochala', lead: 'carla', status: 'riesgo', progress: 31, due: 9, hoursUsed: 260, hoursBudget: 480, risk: 'La API del GPS del cliente sigue sin acceso' },
  { id: 'p4', name: 'Portal de notas', client: 'horizonte', lead: 'elena', status: 'curso', progress: 82, due: 11, hoursUsed: 300, hoursBudget: 380, risk: null },
  { id: 'p5', name: 'Trazabilidad de cosecha', client: 'agrovida', lead: 'bruno', status: 'curso', progress: 45, due: 27, hoursUsed: 210, hoursBudget: 520, risk: null },
  { id: 'p6', name: 'Agenda de citas', client: 'ceibo', lead: 'diego', status: 'pausa', progress: 22, due: 40, hoursUsed: 96, hoursBudget: 400, risk: null },
  { id: 'p7', name: 'Reservas en línea', client: 'mirador', lead: 'carla', status: 'curso', progress: 59, due: 15, hoursUsed: 188, hoursBudget: 340, risk: null },
  { id: 'p8', name: 'Banca por WhatsApp', client: 'andino', lead: 'ana', status: 'curso', progress: 37, due: 34, hoursUsed: 240, hoursBudget: 700, risk: null },
  { id: 'p9', name: 'Web institucional', client: 'horizonte', lead: 'elena', status: 'entregado', progress: 100, due: -12, hoursUsed: 150, hoursBudget: 160, risk: null },
  { id: 'p10', name: 'Facturación electrónica', client: 'pukara', lead: 'diego', status: 'entregado', progress: 100, due: -30, hoursUsed: 330, hoursBudget: 300, risk: null },
]

// Indicadores por periodo (semana, mes, trimestre): valor y el del periodo anterior.
export const KPIS = {
  semana: { hours: [312, 296], billed: [46200, 41800], delivered: [3, 2], incidents: [4, 7] },
  mes: { hours: [1286, 1240], billed: [184300, 171900], delivered: [11, 9], incidents: [15, 19] },
  trimestre: { hours: [3790, 3655], billed: [538600, 497200], delivered: [29, 24], incidents: [41, 52] },
}

const nf = new Intl.NumberFormat('es-BO')
export const fmt = (n) => nf.format(n)
export const bs = (n) => `Bs ${nf.format(n)}`

export function dueLabel(days) {
  if (days === 0) return 'Hoy'
  if (days === 1) return 'Mañana'
  if (days < 0) return `Hace ${-days} d`
  return `En ${days} d`
}

/* ---------- Reportes ---------- */

export const REPORTS = [
  { id: 'avance', label: 'Avance semanal', desc: 'Avance, horas y desvío de cada proyecto activo' },
  { id: 'horas', label: 'Horas por cliente', desc: 'Horas registradas por cliente y por persona' },
  { id: 'riesgos', label: 'Proyectos en riesgo', desc: 'Qué está en riesgo, por qué y desde cuándo' },
]

export const REPORT_STEPS = {
  avance: ['Leyendo 1.240 registros de horas', 'Agrupando por proyecto', 'Calculando el desvío frente al plan'],
  horas: ['Leyendo 1.240 registros de horas', 'Agrupando por cliente y persona', 'Sumando el periodo'],
  riesgos: ['Revisando 10 proyectos', 'Comparando horas y fechas de entrega', 'Ordenando por gravedad'],
}
