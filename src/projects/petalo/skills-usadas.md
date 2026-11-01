# Skills usadas — Pétalo DS (sistema de diseño)

Pétalo es un sistema de diseño con su sitio de documentación. Tiene tokens de color en dos capas, tema claro y oscuro, escala tipográfica fluida, cinco componentes de React y un comprobador de contraste WCAG. Viene del proyecto "Pétalo DS" del portafolio.

- `#/petalo` abre el inicio.
- `#/petalo/<página>` abre cada página: `empezar`, `tokens`, `tipografia`, `componentes`, `contraste` y `cambios`.

Ninguna de estas skills se usó en los proyectos anteriores. Son de **wondelai**, en `.agents/skills/`.

| Skill | Para qué se usó |
|-------|-----------------|
| **software-design-philosophy** | La arquitectura del sistema: tokens en dos capas, módulos profundos e interfaces pequeñas en los componentes |
| **web-typography** | La elección de Geist, la escala fluida, las medidas de lectura y el probador de lectura |
| **technical-documentation** | Las páginas de la documentación: tipos de documento, voz, pasos, código y referencia |

> **Sobre el "plugin de Figma" del portafolio:** aquí es una herramienta web. El comprobador de contraste hace lo que el plugin prometía: revisa el contraste y detecta colores fuera del sistema (sugiere el primitivo más parecido que cumple).

---

## 1. software-design-philosophy (John Ousterhout)

**Puntuación:** 9/10. Cumple 7 de las 8 preguntas del diagnóstico. La que falla es "¿hay revisión de diseño en las revisiones de código?", que no aplica a un proyecto hecho por una sola persona.

| Principio | En el código |
|-----------|--------------|
| **Una decisión, un sitio** | [`ds/tokens.js`](ds/tokens.js) es el único archivo del sistema (`ds/`) con colores. Los componentes, los estilos y el logo los leen de ahí |
| **Ocultar información** | Los componentes leen solo variables semánticas (`--pt-accent`). No saben que existen temas: el modo oscuro no toca ningún componente |
| **Módulo profundo** | [`ds/contrast.js`](ds/contrast.js) expone `contrast(fg, bg)`, que esconde la luminancia relativa, la corrección gamma y los umbrales. La misma función alimenta el comprobador, la auditoría, las estadísticas del inicio y el color del texto de las muestras |
| **Interfaces pequeñas** | `Button` tiene `variant`, `size` e `icon`, y no tiene prop de color. El icono de `Notice` va unido al tono. `Switch.onChange` recibe `true` o `false`, no un evento |
| **Decidir por quien usa el componente** | `Field` exige `label`. Si existe `error`, sustituye a `hint` y marca el campo como inválido. Quien lo usa no tiene que acordarse de `aria-invalid` ni de `aria-describedby` |
| **Comentarios de interfaz** | Cada componente y cada función pública tiene un comentario que explica la abstracción y el porqué, no el cómo |
| **Sin datos duplicados** | Las tablas de tokens, la escala tipográfica, la auditoría y los números del registro de cambios se generan desde `tokens.js`. Si cambia un color, la documentación cambia sola |

**Programación estratégica:** la auditoría encontró tres colores por debajo de 4,5:1 (`verde-600`, `ambar-600` y `rojo-600`). Se corrigieron en el primitivo, en un solo sitio, y la documentación lo cuenta en el registro de cambios.

## 2. web-typography (Jason Santa Maria)

**Puntuación:** 9/10. Cumple 9 de las 10 preguntas del diagnóstico. La que falta es "¿se probó en pantallas reales?": las capturas se hicieron con Chrome sin interfaz, no en dispositivos reales.

- **Elección por función.** Geist tiene un ojo medio alto, aperturas abiertas y `Il1` y `O0` distintos, algo importante en una documentación llena de tokens y valores hexadecimales.
- **Emparejamiento.** Una sola superfamilia: Geist para texto e interfaz y Geist Mono para código. El contraste viene de la estructura (proporcional frente a monoespaciada), no de mezclar estilos.
- **Escala como tokens.** Los siete niveles están en `TYPE_SCALE` y se aplican como variables CSS (`--pt-h1-size`…). Los títulos son fluidos con `clamp()`.
- **Medidas:**
  - Cuerpo de 16 px con interlineado de 1,65.
  - Párrafos limitados a 68 caracteres por línea.
  - Títulos con `text-wrap: balance`.
- **Rendimiento.** Fuentes variables (un archivo por familia), `display=swap` y fuentes del sistema como respaldo.
- **Probador de lectura.** En la página de tipografía hay controles deslizantes de tamaño, interlineado y ancho de línea. Un marcador aplica tres reglas del diagnóstico en directo, con un texto real sobre cómo leemos en lugar de *lorem ipsum*.

## 3. technical-documentation (Google Developer Documentation Style Guide)

**Puntuación:** 10/10. Las reglas `[EN]` no aplican porque la documentación está en español.

| Pregunta del diagnóstico | En la documentación |
|--------------------------|---------------------|
| ¿El primer párrafo dice a quién va dirigida? | Sí. El inicio dice para quién es y qué no cubre ("No cubre la librería de Figma") |
| ¿El tipo de documento encaja con la tarea? | Inicio = README, Empezar = guía práctica, Tokens = concepto + referencia, Componentes = referencia, Cambios = registro de cambios |
| ¿Está todo comprobado contra el código? | Sí. Las rutas, imports, props y el resultado de `contrast('#7A4BDB', '#FFFFFF')` existen y se verificaron |
| ¿Los títulos funcionan como índice? | Sí. Las tareas usan infinitivo ("Añadir Pétalo a tu proyecto") y los conceptos, sustantivos ("Dos capas de color") |
| ¿Los procedimientos son pasos numerados? | Sí. Hay una acción por paso, la condición va antes de la instrucción y la guía termina con "Comprobar el resultado" y "Siguientes pasos" |
| ¿El código lleva frase de introducción y marcadores? | Sí. Cada bloque va tras una frase acabada en dos puntos, y `VARIANT`, `ICON_NAME` y `ERROR_MESSAGE` se explican después |
| ¿Usa segunda persona, voz activa y presente? | Sí. No hay "simplemente", "fácilmente" ni "por favor" |
| ¿Los enlaces tienen texto descriptivo y las tablas encabezados? | Sí. "Consulta Tokens", nunca "haz clic aquí", y todas las tablas tienen encabezado |
| ¿Es atemporal? | Sí. "Sin publicar" no anuncia nada futuro y la versión 1.0.0 tiene fecha ISO |

**Referencia:**
- Las descripciones de props siguen el patrón de la guía: "El…" para valores y "Si es true, …" o "True si…; false si…" para booleanos.
- El registro de cambios sigue Keep a Changelog.
- Cada componente tiene una nota "Por qué así" con la decisión de diseño.

---

## Auditoría de contraste

| Tema | Pares que cumplen |
|------|-------------------|
| Claro | 14 de 14 |
| Oscuro | 14 de 14 |

El token `text-subtle` solo cumple AA para texto grande, y así lo marca la auditoría y lo explica la página de tipografía. `highlight` (rosa-400) da 2,83:1 sobre blanco, por eso es "detalle de marca, nunca texto".

## Diseño visual

- **Iconos de línea**, sin emojis ([`ds/icons.jsx`](ds/icons.jsx)).
- **Logo:** cinco pétalos en degradado de lila a rosa.
- **Portada:** una "flor de tokens" con doce pétalos, uno por cada paso de lila y rosa. Al pasar el cursor por un pétalo se ve su nombre y su valor.
- **El sitio usa sus propios tokens.** El selector de tema cambia la documentación entera y demuestra la capa semántica.
- **Paleta en tiras continuas** con la etiqueta debajo de cada color. En móvil pasa a una cuadrícula de cinco por fila.
- **Escritorio:** barra lateral. **Móvil:** barra superior con el selector de tema y la navegación en una fila deslizable.
