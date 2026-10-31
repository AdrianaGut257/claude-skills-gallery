# DAYFLOW — Copy de la landing page

> **Concepto:** *Make space for what matters.* / Haz espacio para lo que importa.
> **Tono:** calma, claridad, control. Frases cortas. Sin jerga técnica.
> **Acción principal (una sola en toda la página):** `Empieza ahora`
> **Acción secundaria:** `Ver cómo funciona`

**One-liner** (para usar en redes, bio, pitch):
> DAYFLOW ayuda a quienes sienten que el día se les escapa a reunir tareas y tiempo en un solo lugar, para que puedan centrarse en lo que importa.

Los textos marcados con **[confirmar]** dependen de datos que todavía no tenemos (testimonios reales). No se deben publicar sin verificarlos.

---

## Estructura (5 secciones)

| # | Sección | Qué tiene que lograr |
|---|---------|----------------------|
| 1 | Hero | Que en 5 segundos se entienda qué es y para quién |
| 2 | El problema | Que el visitante se reconozca ("esto me pasa a mí") |
| 3 | La solución | Mostrar 3 beneficios, no una lista de funciones |
| 4 | Cómo funciona | Quitar el miedo a "otra app más que aprender" |
| 5 | Cierre | Pintar el "después" y pedir la acción |

---

## 1. Hero

**Etiqueta superior:** DAYFLOW

# Haz espacio para lo que importa.

*(Versión EN: **Make space for what matters.**)*

**Subtítulo:**
Organiza tus tareas, protege tu tiempo y trabaja con calma. Todo en una sola app que no se interpone en tu camino.

**Botón principal:** `Empieza ahora`
**Enlace secundario:** `Ver cómo funciona ↓`

**Texto bajo el botón:** Sin registro. Empiezas en segundos.

> **Nota de diseño:** el titular es el protagonista. Tipografía display muy grande (ratio 10:1 frente al texto), mucho aire alrededor y nada más compitiendo. Animación de entrada: palabras del titular escalonadas, después subtítulo, después botón.

---

## 2. El problema

## Tu día no necesita más apps. Necesita menos ruido.

Tareas en notas. Recordatorios en el móvil. Reuniones en el calendario. Todo está en algún sitio, y nada está a la vista.

Así que acabas el día con la cabeza llena y la sensación de no haber avanzado en lo importante.

**Organizarte no debería ser otro trabajo más.**

> **Nota de diseño (momento firma):** al hacer scroll, una pila desordenada de tareas, avisos y pestañas se va disolviendo hasta dejar solo tres tareas limpias. Es la idea de "hacer espacio" contada sin palabras. Solo con `transform` y `opacity`, y desactivada si el usuario tiene "reducir movimiento".

---

## 3. La solución

## Todo lo que necesitas. Nada que te sobre.

**Organiza**
### Todo en un solo lugar.
Escribe lo que tienes en mente. DAYFLOW lo ordena por día y prioridad para que no tengas que recordarlo.

**Planifica**
### Un día realista, no una lista infinita.
Dale un hueco a cada tarea y comprueba de un vistazo si tu día cabe en tu día.

**Enfócate**
### Una cosa a la vez.
El modo Enfoque oculta todo lo demás hasta que terminas lo que tienes delante.

> **Nota de diseño:** tres bloques, pero no tres tarjetas iguales en fila. Composición asimétrica, con un bloque más grande que los otros, y cada uno acompañado de una captura real de la app, no de iconos genéricos.

---

## 4. Cómo funciona

## Empezar es sencillo.

**1. Vacía tu cabeza.**
Escribe todo lo que tienes pendiente, sin ordenarlo.

**2. Elige lo que importa hoy.**
Quédate con lo esencial. El resto espera su turno.

**3. Trabaja con calma.**
Una tarea a la vez, sin distracciones.

**Sin configuraciones eternas · Exporta tus datos cuando quieras · Sin cuenta ni registro**

**Lo que dicen quienes ya lo usan:**

> *[Testimonio real 1 — idealmente sobre el alivio mental: "Ya no me voy a dormir pensando en lo que se me olvidó". Con nombre, rol y foto.]*
>
> *[Testimonio real 2 — idealmente sobre lo fácil que fue empezar. Con nombre, rol y foto.]*

> **Nota:** no inventar testimonios ni cifras. Si aún no hay usuarios, se quita este bloque o se cambia por un dato verificable (por ejemplo, resultados de una beta).

---

## 5. Cierre

## Mañana puede ser un día más tranquilo.

Imagina cerrar el portátil sabiendo que hiciste lo que importaba, y que lo demás está en su sitio.

O puedes seguir una semana más apagando fuegos. Tú eliges.

**Botón principal:** `Empieza ahora`
**Texto bajo el botón:** Sin registro. Tus tareas se guardan en este navegador.

> **Nota de diseño:** cambio de color de fondo para marcar el final (por ejemplo, de crema claro a tinta oscura). Titular grande otra vez, botón con el único color de acento de la página.

---

## Objeciones y dónde se responden

| Lo que piensa el visitante | Respuesta en la página | Sección |
|----------------------------|------------------------|---------|
| "Otra app más que aprender" (esfuerzo) | "Lista en 2 minutos", plan de 3 pasos | 1, 4 |
| "¿Sirve para alguien como yo?" (encaje) | Problema descrito con situaciones cotidianas | 2 |
| "¿Me puedo fiar?" (confianza) | Testimonios reales **[pendiente]** | 4 |
| "¿Cuánto cuesta?" (precio) | "Sin registro", la app se usa al momento | 1, 5 |
| "Ya lo haré otro día" (momento) | "Mañana puede ser un día más tranquilo" | 5 |

## Guía visual rápida

- **Tipografía:** display con personalidad (p. ej. *Instrument Serif* o *Fraunces*) + sans limpia para el cuerpo (p. ej. *Manrope*). Evitar Inter, Roboto o Arial en el hero.
- **Color:** casi todo crema cálido (`#F6F3EE`) y tinta (`#1C1B19`). Nunca negro ni blanco puros. Un solo acento, reservado para los botones. Evitar el degradado morado-azul típico de SaaS.
- **Movimiento:** curvas propias (`cubic-bezier(0.16, 1, 0.3, 1)`), entradas escalonadas, nada que bloquee el scroll. Respetar `prefers-reduced-motion`.
- **Accesibilidad:** contraste mínimo 4.5:1, botones de al menos 44 px de alto en móvil y estados de foco visibles.
