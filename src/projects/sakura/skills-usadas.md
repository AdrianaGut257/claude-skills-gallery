# Skills usadas — Sakura List (app animada)

Tracker de anime hecho para lucir la animación. Viene del proyecto "Sakura List" del portafolio, una app bonita (y rosa) para llevar tu lista de anime con recomendaciones según tus géneros.

- Los 12 animes, sus sinopsis y sus carteles son **inventados**, para no usar obras con derechos.
- Los carteles son geometría en SVG generada para cada título.

Todas las skills son de Emil Kowalski (`emilkowalski/skills`). Ninguna se había usado en otro proyecto: animate y gestures, del mismo repositorio, ya se usaron en Ecco.

| Skill | Para qué se usó |
|-------|-----------------|
| **choreograph** | Qué se mueve, en qué orden, cuánto se solapa y qué se queda quieto |
| **animation-performance** | Pétalos en un `<canvas>` sin estado de React por fotograma; solo `transform` y `opacity` |
| **animation-vocabulary** | El nombre exacto de cada efecto (tabla de abajo) |
| **ask-sonner** | Los avisos con Sonner: un solo `<Toaster />`, acciones de deshacer y tema oscuro |
| **find-animation-opportunities** | Revisión final: tres sitios que debían animarse y tres que no |

Librerías: **Motion** (motion.dev) para resortes, transiciones de layout y arrastre; **Sonner** para los avisos.

## Cada efecto, con su nombre (animation-vocabulary)

| Dónde | Efecto | Término |
|-------|--------|---------|
| Portada | Pétalos que caen girando y reaccionan al ratón | **Idle animation** + **3D tilt / Flip** (el pétalo se ve de canto) |
| Portada | "Sakura List" letra a letra | **Stagger** de **Slide in** con **Reveal** (las letras suben desde dentro de su línea) |
| Pestañas y menú superior | La píldora viaja de una pestaña a otra | **Shared element transition** (`layoutId`) |
| Tarjeta → ficha | El cartel crece hasta la ficha y vuelve | **Shared element transition** + **Continuity transition** |
| Cambiar de estado | La tarjeta se va y las demás cierran el hueco | **Exit** + **Layout animation** (`popLayout`) |
| Botón +1 | El número sube al sumar y baja al restar | **Number ticker** con **Tabular numbers** |
| Barra de progreso | Crece con un resorte | **Spring** sobre **Scale** (`scaleX`, nunca `width`) |
| Capítulo final | Pétalos que salen del botón | **Pop in** + **Bounce** (momento de celebración) |
| Estrellas | La estrella salta y suelta tres destellos | **Pop in** + **Follow-through** |
| Menú de estado | Sale desde su botón | **Origin-aware animation** |
| Descubrir | La carta sigue al dedo, se inclina y se va lanzada | **Drag** + **Rotate** + **Momentum** / **Velocity**; **Interruptible animation** |
| Descubrir | La carta de debajo crece mientras arrastras | **Layout** enlazado a la misma `x` (un solo valor manda) |
| Mi lista ↔ Descubrir | La vista nueva entra por el lado hacia el que vas | **Direction-aware transition** |

## choreograph

**Portada** (un momento que se ve una vez por visita, así que se permite una ola):

| Elemento | Rol | Empieza | Dura | Movimiento |
|----------|-----|---------|------|------------|
| Letras de "Sakura" | Principal | 0 ms | 700 ms | suben 40 % + aparecen; retrasos que se acortan de 45 a 25 ms |
| Letras de "List" | Principal | 180 ms | 700 ms | igual, solapado |
| Subtítulo | Apoyo | 320 ms | 500 ms | aparece + 8 px |
| Cifras | Apoyo | 400 ms | 500 ms | aparecen + 6 px |
| Pétalos | Decoración | 0 ms | continuo | — |

**Lo que no se mueve, a propósito:**
- **Las opciones del menú de estado** aparecen juntas: se usan decenas de veces al día.
- **El contenido de la ficha no se escalona:** entra el contenedor y el contenido viaja con él (una entrada por contenedor).
- **Al cambiar de pestaña, las tarjetas no se escalonan:** solo un fundido rápido.
- **Las barras de géneros** crecen solo la primera vez que abres Descubrir en la visita.

**Más reglas aplicadas:**
- **Juntos, no en cola.** La tarjeta que se va deja de ocupar sitio al instante (`AnimatePresence mode="popLayout"`), así que las demás cierran el hueco mientras se desvanece.
- **La dirección viaja con `custom`.** Así el número que rueda y el cambio de vista salen en la dirección correcta aunque se interrumpan.
- **Las salidas son más cortas que las entradas.** La ficha entra en 400 ms y sale en 200 ms; el menú, 160 ms y 100 ms.
- **Los acentos aterrizan con el principal.** Los destellos de la estrella salen con 40 ms de diferencia y terminan con su salto.
- **Reducir movimiento.** `MotionConfig reducedMotion="user"` quita los desplazamientos y deja las opacidades. Los pétalos se dibujan quietos.

## animation-performance

- **Los pétalos son un `<canvas>` con su propio bucle:**
  - nada de React por fotograma;
  - densidad de píxeles limitada a 2;
  - menos pétalos en móvil;
  - se pausan fuera de pantalla (`IntersectionObserver`) y con la pestaña oculta.
- **Solo se animan `transform` y `opacity`.** La barra de progreso usa `scaleX` y no `width`; los puntos de capítulo usan `scale`.
- **La baraja usa valores de Motion** (`useMotionValue` y `useTransform`): el giro, los sellos y la carta de debajo se calculan sin volver a pintar React mientras arrastras.

## ask-sonner

- **Un solo `<Toaster />`** con tema oscuro, abajo en el centro y con el estilo de la app.
- **Avisos con acción:**
  - "Deshacer" al cambiar de estado o al añadir desde Descubrir;
  - "Pasar a Completado" al terminar el último capítulo.
- **El botón de acción usa los colores de la app**, con `!important` como indica la skill.

## find-animation-opportunities

**Sobrevivieron y se aplicaron:**

| # | Dónde | Propósito | Movimiento |
|---|-------|-----------|------------|
| 1 | Baraja vacía | Celebración (momento raro) | Aparece y crece desde 0,96, 400 ms ease-out |
| 2 | "Añadir a mi lista" en la ficha | Evitar un cambio brusco | El bloque nuevo aparece y sube 8 px, 250 ms |
| 3 | Pestañas y puntos de capítulo | Respuesta | `scale(0.96)` al pulsar, 140 ms |

**Descartadas:**
- Escalonar las opciones del menú (frecuencia).
- Repetir las barras de géneros en cada visita (frecuencia).
- Animar por dentro el contenido de la ficha (una entrada por contenedor).

## Notas

- **Falta por probar:**
  - El arrastre de la baraja en un móvil real.
  - El paso por la ruta `/review-animations`, que solo puede lanzarse a mano.
- **Restablecer la lista de ejemplo:** está en el pie de página y deja la lista como al principio.
