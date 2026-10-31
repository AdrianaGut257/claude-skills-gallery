# Skills usadas — ¡Basta! (tutti frutti)

Juego por turnos para varias personas con un solo móvil. Sale una letra en una ruleta 3D, cada persona rellena las categorías en su turno y, al final de la ronda, el grupo revisa las respuestas.

Ninguna de estas skills se usó en el proyecto 01 (DAYFLOW). Son de **wondelai**, en `.agents/skills/`.

> **Sobre el "estilo 3D":** entre las 53 skills no hay ninguna de 3D. El volumen se ha hecho con CSS: perspectiva y `rotateX` en la ruleta, cantos sólidos en botones y tarjetas, letras extruidas con `text-shadow` y un podio de bloques con cara superior y cara frontal. Lo han guiado **refactoring-ui** (sombras y elevación) y **microinteractions** (botones que se hunden al pulsarlos).

| Skill | Para qué se usó |
|-------|-----------------|
| **hooked-ux** | El bucle del juego: ruleta, turno, puntos y revancha |
| **microinteractions** | Respuesta inmediata en cada acción y los momentos firma |
| **design-everyday-things** | Que se entienda sin instrucciones y que sea difícil equivocarse |
| **refactoring-ui** | Sistema visual: escalas, jerarquía, color y profundidad 3D |
| **contagious** | Que la partida se comente y se comparta fuera de la pantalla |

---

## 1. hooked-ux (Nir Eyal)

| Fase | En el juego |
|------|-------------|
| **Disparador** | Externo: "Gira la ruleta". Interno: las ganas de ganar a tus amigos y de no aburrirte en una reunión |
| **Acción** | Un solo toque para girar y una palabra por categoría. Sin cuentas ni registro |
| **Recompensa variable** | *Hunt*: la letra es una sorpresa (y no se repite en la partida). *Tribe*: el marcador, los empates y "Solo se le ocurrió a…" con +20. *Self*: superar tu mejor ronda |
| **Inversión** | Jugadores, categorías y ajustes se guardan para la siguiente partida, y "¡Revancha!" vuelve a empezar con un toque |

**Ética:** no hay rachas, notificaciones ni nada que empuje a seguir jugando sola o solo. Cada partida tiene un final claro (podio) y nadie gana nada fuera del juego.

**Puntuación:** 8/10. Disparador interno 1, acción 2, recompensa variable 2, inversión 2.

## 2. microinteractions (Dan Saffer)

- **Disparadores con estado visible:** el botón ¡Basta! está gris hasta que rellenas todo y luego "late". Los botones 3D se hunden al pulsarlos.
- **Feedback inmediato, proporcional a lo que pasa:**
  - Pequeño: ✓ verde o ! rojo en cada respuesta mientras escribes, y "clic" del contador en los últimos 10 segundos.
  - Grande: sello a pantalla completa de "¡Basta!" o "¡Tiempo!", confeti y fanfarria en el podio.
- **Momentos firma:**
  1. La ruleta 3D, con "clics" que se espacian al frenar y un pequeño rebote al final.
  2. El gran botón rojo de ¡Basta!
  3. El podio, que sube por bloques.
- **Bucles:** "¡Revancha!" mantiene jugadores y ajustes. Las letras que ya salieron no se repiten hasta agotarlas.
- **Sin bloquear:** el sello se puede saltar con un toque.
- **Sonido solo como extra:** todo lo que suena también se ve, y hay botón para quitar el sonido.

**Puntuación:** 9/10. Falta reducir la ayuda para quien ya ha jugado muchas veces.

## 3. design-everyday-things (Don Norman)

- **Restricciones:**
  - No se puede empezar sin jugadores ni con menos de 3 categorías, y el botón dice por qué.
  - Nombres repetidos bloqueados, con aviso.
  - Máximo de 8 jugadores y de 12 categorías.
  - ¡Basta! solo funciona con todo relleno.
- **Señales:** el campo muestra "M…" como pista, cada categoría tiene su etiqueta y el turno dice "Palabras que empiecen por M · 4 de 7".
- **Modelo mental del juego de papel:**
  - "Pasa el móvil a Ana" funciona como pasar la hoja, y los demás no ven lo que escribió la persona anterior.
  - "Anular" funciona como cuando el grupo discute si una palabra vale.
- **Errores:**
  - "Tiene que empezar por M" aparece mientras escribes, no al final.
  - Anular se puede deshacer ("Aceptar").
  - Salir de la partida pide confirmación.
  - Al recargar en mitad de un turno, vuelves a la pantalla de "Pasa el móvil" sin perder la partida.

**Puntuación:** 10/10 en el diagnóstico rápido.

## 4. refactoring-ui (Wathan y Schoger)

- **Escalas fijas:**
  - Espaciado: 4, 8, 16, 24, 32, 48 y 64 px.
  - Texto: 12, 14, 16, 18, 24, 30 y 36 px, más los tamaños de pantalla.
  - Una sola familia tipográfica: *Rubik*, de 400 a 900.
- **Jerarquía:** etiquetas pequeñas en mayúsculas y gris, y valores grandes y oscuros (marcador, puntos, respuestas). Un único botón principal por pantalla (tomate) y los secundarios en crema.
- **Color (paleta "noche de juegos"):** fondo índigo profundo (`#15122E`) con tarjetas un poco más claras (`#221D4A`) para dar elevación, y texto lila claro en lugar de blanco puro. El amarillo sol (`#FFD23F`) es la acción principal y las letras, el frambuesa (`#FF4D6D`) es el botón ¡Basta!, la menta (`#2FD8A1`) marca lo correcto y los +20, y el violeta (`#7B6BFF`) es la ruleta. Sobre los colores vivos el texto va oscuro (`#1A1440`) para que se lea bien.
- **Profundidad:** cada elemento tiene su elevación. Las tarjetas tienen un canto de 6 px, los botones de 5 px y el botón ¡Basta! de 12 px. En la ruleta y los avatares hay brillo arriba y sombra dentro.
- **Diseño de pantalla:** pantallas de juego estrechas (720 px) pensadas para el móvil. Textos alineados a la izquierda en formularios y listas, y centrados solo en títulos y botones únicos.

**Puntuación:** 9/10. El único punto débil es que algunos textos terciarios están cerca del mínimo de contraste.

## 5. contagious (Jonah Berger, STEPPS)

| Principio | En el juego |
|-----------|-------------|
| **Social Currency** | "Solo se le ocurrió a…" premia en público la respuesta más original, y el podio deja ver quién ganó |
| **Triggers** | Juego de reuniones, sobremesas y viajes: el móvil ya está en la mesa |
| **Emotion** | Emoción alta: el tiempo apretando, el sello ¡BASTA!, las discusiones al anular y el confeti |
| **Public** | Se juega en grupo con un solo dispositivo, así que se ve y se oye |
| **Practical Value** | No hace falta papel ni boli, y la puntuación se hace sola |
| **Stories** | "Compartir resultado" genera un texto listo para el grupo de WhatsApp: letras jugadas y clasificación |

**Puntuación:** 8/10 (10 de 12 en bruto). Para subir, faltaría una imagen para compartir y no solo texto.

---

## Reglas de puntuación

| Puntos | Cuándo |
|--------|--------|
| **20** | Eres la única persona con respuesta válida en esa categoría |
| **10** | Respuesta válida que nadie más ha puesto |
| **5** | Respuesta repetida, sin contar mayúsculas ni tildes ("Mango" y "mangó" se consideran la misma) |
| **0** | Vacía, no empieza por la letra o anulada por el grupo |

Si juega una sola persona, cada respuesta válida vale 10.
