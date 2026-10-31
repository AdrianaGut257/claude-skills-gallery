# Skills usadas — Landing DAYFLOW

Las cuatro skills son de **wondelai** y están en `.agents/skills/`.

| Skill | ¿Obligatoria? | Para qué se usó |
|-------|---------------|-----------------|
| **ux-heuristics** | Sí | Claridad del texto y usabilidad |
| **top-design** | Sí | Dirección visual, tipografía, movimiento y momento firma |
| **storybrand-messaging** | Elegida | Estructura narrativa de las 5 secciones y one-liner |
| **cro-methodology** | Elegida | Una sola acción, objeciones y pruebas de confianza |

---

## 1. ux-heuristics (Krug + Nielsen)

**Qué aporté de esta skill:**
- **"No me hagas pensar":** titulares en lenguaje llano y botones con verbo + objeto (`Empieza ahora`, `Ver cómo funciona`). Nada de nombres ingeniosos ni jerga.
- **"Quita la mitad de las palabras":** sin párrafos de bienvenida. Cada bloque tiene como mucho 2 o 3 frases cortas.
- **Diseño minimalista (Nielsen #8):** un único botón principal, repetido en el hero y en el cierre.
- **Coherencia (Nielsen #4):** el mismo texto de botón en toda la página.
- **Accesibilidad:** contraste 4.5:1, botones de al menos 44 px y foco visible.
- **Patrones oscuros:** nada de "Gratis" sin confirmarlo, ni urgencia falsa, ni frases que hagan sentir culpa.

**Puntuación estimada del texto:** 9/10. Para llegar a 10 falta probar la página con 3 a 5 usuarios reales (prueba de 5 segundos).

## 2. top-design (estilo de agencias Awwwards)

**Qué aporté de esta skill:**
- **Concepto antes que diseño:**
  - Esencia de marca: *calma*
  - Tensión visual: vacío frente a desorden
  - **Momento firma:** la pila de tareas que se disuelve en tres al hacer scroll (sección 2)
- **Tipografía como arquitectura:** el titular del hero es el elemento visual principal, con un ratio de tamaño 10:1 frente al cuerpo.
- **Color:** crema cálido + tinta + un único acento. Nada de negro o blanco puros ni del degradado morado-azul.
- **Movimiento:** curvas `cubic-bezier` propias, entrada escalonada y respeto a "reducir movimiento".
- **Composición:** la sección 3 es asimétrica en lugar de tres tarjetas iguales.

**Puntuación estimada de la web:** 8/10 (tipografía 9, composición 8, movimiento 8, color 8, detalles 8).

Para llegar a 10 faltaría:
- Scroll suave con una librería como Lenis.
- Capturas reales de la app en lugar de maquetas hechas con HTML.
- Una tipografía de fundición premium.

## 3. storybrand-messaging (SB7, Donald Miller)

**Por qué la elegí:** es la skill específica para escribir el texto de una web, y define en qué orden contar las cosas.

**Cómo encaja cada sección en el esquema SB7:**
| SB7 | Sección |
|-----|---------|
| Personaje + deseo | 1. Hero: "Haz espacio para lo que importa" |
| Problema (externo, interno y filosófico) + villano ("el ruido") | 2. El problema |
| Guía (empatía) | 2 y 3 |
| Plan en 3 pasos + plan de garantías | 4. Cómo funciona |
| Llamada a la acción directa y secundaria | 1 y 5 |
| Éxito y fracaso | 5. Cierre |

También salió de aquí el **one-liner**.

**Puntuación:** 8/10. Falta autoridad real (testimonios o cifras), que depende de tener datos verdaderos.

## 4. cro-methodology (Conversion Rate Experts)

**Por qué la elegí:** una landing tiene que convertir, y esta skill es la que trata las landing pages y las objeciones.

**Qué aporté de esta skill:**
- **Una sola acción** en toda la página.
- **Tabla de objeciones (O/CO)** con las 5 objeciones típicas: confianza, precio, encaje, momento y esfuerzo. Cada respuesta está colocada donde surge la duda.
- **Respuesta implícita:** "Lista en 2 minutos" responde a "me va a costar aprenderla" sin tener que decirlo.
- **Pruebas honestas:** los testimonios quedan como hueco en lugar de inventarlos.

**Puntuación:** 6/10. Las objeciones son las típicas del sector, no salen de una investigación con usuarios de DAYFLOW. Para subir: encuestas a usuarios beta y testimonios reales.

---

## Cómo se aplicaron en la web

| Decisión en la web | Skill |
|--------------------|-------|
| Titular enorme en serif (*Instrument Serif*) frente al cuerpo en *Manrope*, con un ratio de tamaño de 10:1 o más | top-design |
| Entrada del titular palabra a palabra, con curvas `cubic-bezier` propias | top-design |
| **Momento firma:** en "El problema", al hacer scroll, 11 notificaciones se disuelven y las 3 tareas importantes se ordenan en la tarjeta "Hoy" | top-design + storybrand (el villano: "el ruido") |
| Crema cálido + tinta + un solo acento verde. La sección final cambia a fondo oscuro | top-design |
| Tarjeta "Hoy" del hero interactiva: puedes marcar tareas y el contador cambia | top-design (microinteracciones) + ux-heuristics (estado visible) |
| El tamaño del titular también depende de la altura de la pantalla, para que el botón principal se vea sin hacer scroll | ux-heuristics + cro-methodology |
| Un solo botón principal (`Empieza ahora`), repetido en la navegación, el hero y el cierre | cro-methodology + storybrand |
| Al pulsar el botón aparece el aviso "Esto es una demo…" en vez de no hacer nada | ux-heuristics (Nielsen #1, estado del sistema) |
| Testimonios como huecos marcados, no inventados | cro-methodology (pruebas honestas) |
| Contraste AA, botones de al menos 44 px, foco visible y respeto a "reducir movimiento" (se desactivan las animaciones y la sección del problema se muestra ya ordenada) | ux-heuristics + top-design |

## Skills que valoré y no usé

- **one-page-marketing:** sirve para un plan de marketing completo, no para el texto de una página.
- **refactoring-ui** y **web-typography:** útiles cuando se pase al diseño visual.
- **conversion-optimization** y **create-website:** son recorridos largos que combinan varias skills. Para esta prueba basta con usar sus piezas por separado.
- **hooked-ux** y **microinteractions:** se centran en el producto, no en la landing.

## La app funcional (`#/dayflow/app`)

"Empieza ahora" abre una app que funciona, sin registro, con las tres funciones que promete la landing:

| Función | Qué hace | Skill que la guía |
|---------|----------|-------------------|
| **Organiza** | Escribes en lenguaje natural ("Llamar al banco mañana a las 10, 30 min !") y la app detecta el día, la hora, la duración y la prioridad. Antes de añadir, muestra cómo lo ha entendido | ux-heuristics (estado visible, no me hagas pensar) |
| **Planifica** | El panel "Tu día" suma las duraciones y te dice si cabe en tus horas disponibles ("Te pasas 1 h. Mueve algo a mañana.") | storybrand (la promesa "un día realista") |
| **Enfócate** | Modo Enfoque a pantalla completa con temporizador de 15, 25 o 50 min. Se puede pausar, el tiempo aparece en la pestaña, suena un aviso al terminar y "Terminar tarea" la marca como hecha | top-design (momento oscuro, tipografía grande) |
| Deshacer | Marcar como hecha, eliminar y "Borrar todo" se pueden deshacer desde el aviso, en lugar de pedir confirmación | ux-heuristics (Nielsen #3, control y libertad) |
| Atajo **N** | Lleva al campo para escribir una tarea nueva | ux-heuristics (Nielsen #7, eficiencia) |
| Exportar datos | Descarga un .json con tus tareas: cumple la promesa "Exporta tus datos cuando quieras" | cro-methodology (las promesas tienen que ser ciertas) |

Las tareas se guardan solo en el navegador (localStorage). Las tareas de "Mañana" pasan solas a "Hoy" al día siguiente.
