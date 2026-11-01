# Skills usadas — Florecer (app de hábitos)

App móvil donde cada hábito diminuto es una flor que crece cada vez que lo cumples. Si fallas un día, la flor no se marchita: se cierra y te espera. Viene del proyecto "Florecer" del portafolio.

- `#/florecer` abre la app.
- `#/florecer/caso` abre el caso de estudio.

Ninguna de estas skills se usó en DAYFLOW ni en ¡Basta!. Son de **wondelai**, en `.agents/skills/`.

| Skill | Para qué se usó |
|-------|-----------------|
| **improve-retention** | El comportamiento: receta de Tiny Habits, hábitos diminutos, anclas en vez de notificaciones y celebración inmediata |
| **lean-ux** | El caso de estudio: supuestos, hipótesis con criterios fijados antes de probar y métrica de comportamiento |
| **steve-jobs-design-review** | El enfoque: una sola cosa, todo lo que se quitó, estados vacíos y de espera, y la revisión final |

---

## 1. improve-retention (BJ Fogg, B=MAP)

Un comportamiento ocurre cuando coinciden **motivación**, **habilidad** y un **disparador**. Como la motivación sube y baja, la app hace el hábito tan fácil que no la necesita.

| Elemento | En la app |
|----------|-----------|
| **Receta de Tiny Habits** | Cada hábito se crea con la frase "Después de *[ancla]*, voy a *[hábito diminuto]* y lo celebro *[celebración]*" |
| **Habilidad** | La receta viene rellena con sugerencias y se planta con un toque. Regar es otro toque. Las sugerencias son versiones diminutas ("leer una página", "usar el hilo dental en un diente") |
| **Eslabón débil** | El esfuerzo mental de decidir qué hacer y cuándo. Lo resuelven las sugerencias y las anclas por defecto |
| **Aviso si es grande** | Si el hábito tiene más de 6 palabras: "¿Se puede hacer más pequeño? Piensa en algo de menos de 30 segundos" |
| **Disparador** | Tu propia rutina (el ancla). Los hábitos se ordenan por el momento del día del ancla. No hay notificaciones |
| **Celebración** | Al regar, la flor crece a pantalla completa y te recuerda tu celebración: "Celébralo con el puño en alto" |
| **Días de poca motivación** | La flor que espera no se marchita ni se pone gris. El mensaje es "Con hacerlo hoy, vuelve a abrirse", sin culpa |
| **Crecer sin forzar** | Tras 7 veces, se ofrece hacerlo "un poco más grande", con un "Así está bien" igual de visible |

**Ética:** no hay rachas que se rompen. La skill solo acepta el miedo a perder algo cuando la pérdida es real, y aquí nunca se pierde nada por fallar.

**Puntuación:** 8,5/10.

| Pregunta del diagnóstico | Resultado |
|--------------------------|-----------|
| ¿Se hace la acción principal en menos de 60 segundos? | Sí |
| ¿Funciona con poca motivación? | Sí |
| ¿Los disparadores van ligados a rutinas? | Sí |
| ¿Hay celebración inmediata? | Sí |
| ¿Se encontró el eslabón débil? | No del todo (−1,5): lo deduje del diseño, no lo medí con personas |
| ¿Se crece de forma natural? | Sí |

## 2. lean-ux (Gothelf y Seiden)

Se aplica en el **caso de estudio** (`#/florecer/caso`).

- **Supuestos** ordenados en una matriz de riesgo × incertidumbre. Se prueba primero "La culpa al romper una racha es la razón principal del abandono".
- **Hipótesis** con el formato de la skill: *Creemos que* más estudiantes seguirán usando la app después de dos semanas *si* ven una flor que les espera en lugar de una racha que se rompe.
- **Criterios fijados antes de probar:**
  - Validada si el 60 % llega a 8 de 14 días activos.
  - Invalidada si llega menos del 40 %.
- **Resultado, no producción:** se miden días con al menos un hábito cumplido, no cuántas veces se pulsa el botón.
- **Experimento:** el más pequeño posible para un hábito de 14 días es esta app. Cada persona ve "Tu prueba" con sus propios datos, que se calculan en su navegador.
- **Honestidad:** los resultados aparecen como "pendientes". El portafolio menciona "+38 % de retención simulada", pero aquí no se presenta ningún resultado que no exista.

**Puntuación:** 5/10.

| Pregunta del diagnóstico | Resultado |
|--------------------------|-----------|
| ¿Supuestos declarados? | Sí |
| ¿Hipótesis comprobable? | Sí |
| ¿Experimento de la fidelidad más baja posible? | Sí |
| ¿Métricas de resultado? | Sí |
| ¿Diseño en equipo? | No |
| ¿Investigación cada sprint? | No |
| ¿Discovery y delivery en paralelo? | No |
| ¿Hay alguna hipótesis invalidada? | No |

Las cuatro que fallan dependen de un equipo y de semanas de trabajo, y un prototipo hecho por una sola persona no puede cumplirlas.

## 3. steve-jobs-design-review

```
# Design Review: Florecer
**Verdict:** INSANELY GREAT (score 9/10)
**The One Thing:** Que cuidar un hábito pequeño se sienta bien, incluso el día que fallas.
**Keeps its promise?** Sí. Fallar no borra nada: la flor se cierra y espera, y el texto no culpa.
**Cut list:** rachas, notificaciones, estadísticas, categorías, más de 3 hábitos, cuentas, ajustes.
**Fix list:**
  1. Probar en un móvil real. Las capturas se hicieron con un viewport móvil, no con un teléfono.
  2. Revisar la celebración tras 100 usos: dura 2,6 s y puede cansar; probar a acortarla para quien ya lleva semanas.
**Back of the fence:** el estado vacío (bienvenida), la flor que espera, el jardín completo, el modo sin
  almacenamiento y las confirmaciones ("Arrancar esta flor", "Empezar un jardín nuevo") tienen texto y
  diseño propios. No queda ningún aviso nativo del navegador.
```

## Diseño visual

- **Sin emojis.** Todos los iconos son de línea, del mismo grosor y con extremos redondeados ([icons.jsx](icons.jsx), basados en Lucide). Cada hábito, cada momento del día y cada celebración tiene el suyo.
- **El jardín es la pieza central.** Es una escena ilustrada con cielo, sol o luna y dos colinas. El cielo cambia según la hora: amanecer por la mañana, rosa por la tarde, lavanda con estrellas por la noche.
- **Flores con volumen.** Los pétalos van en dos capas con degradado, las hojas tienen nervio y el centro tiene brillo. Las flores regadas hoy tienen un halo suave y gotas de rocío.
- **Paleta:**
  - Fondo de papel cálido (`#FBF6F1`) y tinta ciruela (`#2A1B22`).
  - Un solo acento rosa (`#E0568E`).
  - Cada flor tiene su color: rosa, melocotón o lavanda.
- **Tipografía:** *Fraunces* para títulos y la frase de la receta, y *Plus Jakarta Sans* para el resto.
- **La receta se edita tocando la frase.** Cada parte subrayada abre sus opciones con icono. Así la pantalla de bienvenida es corta en lugar de mostrar tres listas de opciones.
- **Escritorio a dos columnas:** el jardín a la izquierda y la lista de hoy a la derecha.

**Puntuación:** 6 de 7 preguntas del diagnóstico → 9/10. La que falta es la demo en un dispositivo real.

---

## Etapas de la flor

| Veces cumplido | Etapa |
|----------------|-------|
| 0 | Semilla |
| 1 | Brote |
| 3 | Tallo con hojas |
| 6 | Capullo |
| 10 | Flor |
| 21 | Flor en plena floración (con flores pequeñas alrededor) |

La flor **espera** (se cierra y se inclina) cuando lleva al menos un día entero sin regarse. Al regarla, se vuelve a abrir.
