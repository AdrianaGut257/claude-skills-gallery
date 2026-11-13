# Skills usadas — Pulso (panel + web del producto)

Viene del caso de panel de gestión del portafolio (allí se llamaba GenSoft Admin; aquí se renombró como Pulso): un panel para administrar proyectos, clientes y reportes con gráficos en tiempo real. El caso dice "−70 % de tiempo en reportes" y "10 semanas" de trabajo.

**Excepción pedida:** este proyecto **reutiliza** tres skills de proyectos anteriores, a propósito y solo esta vez.

| Skill | Ya se usó en | Para qué se usó aquí |
|-------|--------------|----------------------|
| **impeccable** | Ecco | El panel en modo *Operate* (precisión antes que expresión), el mínimo de calidad y lo que no se hace |
| **design-taste-frontend** | Ecco | La web del producto como página *software*: el producto de verdad en un marco de app, dos momentos y un diagrama del kit |
| **animate** | Ecco | Qué se mueve y qué no, con sus curvas y duraciones |

Hay dos superficies:

- **`#/pulso`**: la web del producto.
- **`#/pulso/panel`**: el panel, con cuatro secciones que funcionan (Resumen, Proyectos, Clientes y Reportes).

## impeccable

**Modos.** El panel es *Operate*: el usuario viene a hacer una tarea. La web es *Persuade*. Lo que cambia:

- **El panel** usa patrones conocidos (barra lateral, tabla ordenable, control segmentado, cajón lateral) y la marca vive en los detalles: el rosa del foco, la barra ciruela, los indicadores amarillos de riesgo.
- **La escena física decide el claro o el oscuro.** Un equipo revisa proyectos de día en monitores de oficina, así que el panel es **claro**. La web, que persuade, va en ciruela.

**Tipografía.** Onest para la interfaz (cifras tabulares) y Bricolage Grotesque para los titulares de la web. Ninguna está en la lista de fuentes "de siempre" que impeccable pide evitar (Inter, DM Sans, Outfit, Plus Jakarta…).

**Del mínimo de calidad (`craft-floor.md`):**
- contraste de texto de al menos 4,5:1 (el rosa de texto es `#B0235A`, no el `#FF7AA8` de los rellenos);
- foco visible con la paleta, y `::selection` también;
- cifras tabulares en todo el panel;
- estados vacíos ("Ningún proyecto coincide…", "El reporte aparecerá aquí") y el botón deshabilitado mientras se genera un reporte;
- avisos con "Deshacer" al cambiar el estado de un proyecto.

**Se evitó:**
- **Antetítulos sobre los titulares.** impeccable los prohíbe.
- **Tarjetas iguales de icono + título + texto.** Las tres de la web llevan **fragmentos reales de la interfaz**.
- **Bordes de color a un lado, degradados en texto y cristal decorativo.**
- **Indicadores como cuatro tarjetas sueltas.** Son una sola franja con divisiones de 1 px.

**Lanzador no ejecutado.** El lanzador de impeccable descarga un binario, así que no se ejecutó; se siguieron sus guías leyéndolas.

## design-taste-frontend

**Tipo de página:** *software*. Eso permite fondo oscuro en la portada y piezas del kit: momentos, diagramas e iconos reales.

**Piezas del kit**, copiadas en `public/pulso/kit/` y montadas como dicen sus referencias:

| Pieza | Dónde | Qué hace |
|-------|-------|----------|
| **word-highlight** (momento) | La frase "Antes, el estado de cada proyecto vivía en cinco hojas de cálculo…" | Las palabras pasan de media tinta a tinta al cruzar la pantalla; «un solo panel», al rosa |
| **counter-rolls** (momento) | Las cifras del caso: 70 % y 10 semanas | Los dígitos giran una vez como un cuentakilómetros y paran en la cifra real |
| **Diagrama `fanin`** | "Cómo llegan los datos al panel" | Hojas de cálculo, GitHub y MySQL → API REST en Node.js → panel en Vue, con pulsos por las líneas |

**Reglas aplicadas:**
- **Portada sola en la primera pantalla,** con el **producto de verdad** funcionando en un marco de app (el Resumen en vivo, con su gráfico), no una captura.
- **Logos reales** de Vue, Node.js, MySQL, Docker, GitHub y Google Sheets, de Simple Icons en su color de marca. El crédito va en el pie.
- **Un dato concreto en la portada** ("los reportes semanales tardan un 70 % menos"), botones con verbo y objeto, hover discreto (tarjeta que sube 2 px y subrayado que se dibuja) y entrada de la portada una sola vez.
- **Las cifras vienen del brief** (70 % y 10 semanas) y no se inventan.

**Scripts no ejecutados.** Los scripts de reparto y comprobación no se ejecutaron (código de terceros); la revisión se hizo con capturas a 1440 y 390 px.

## animate (Emil Kowalski)

| Elemento | ¿Se anima? | Por qué y cómo |
|----------|------------|----------------|
| Navegación del panel | **No** | Se usa cien veces al día: cambio inmediato |
| Ordenar la tabla | **No** | Frecuente; además son datos que se leen |
| Cifra en vivo del gráfico | **No** | Es un dato que se lee |
| Gráfico en vivo | Sí: **indicar estado** | Movimiento constante → `linear`. La línea se desliza un paso en los 2 s entre datos, y el punto sube o baja a la vez |
| Control segmentado | Sí: **continuidad** | El indicador se desliza: `transform`, 200 ms `cubic-bezier(0.23, 1, 0.32, 1)` |
| Generar un reporte | Sí: **indicar estado** | La barra avanza lineal (representa tiempo); cada paso se marca con un check que crece desde 0,6 en 160 ms |
| El reporte terminado | Sí: **evitar un cambio brusco** | Aparece y sube 8 px, 260 ms ease-out |
| Botones | Sí: **respuesta** | `scale(0.97)` al pulsar, 140 ms; hover solo con ratón |
| "En vivo" | Sí, lento | Un pulso cada 2,4 s; se apaga con "reducir movimiento" |
| Cajón de proyecto | Sí | Con Vaul: la skill pide no improvisar un cajón |

Con "reducir movimiento" no hay entrada ni pulso, el gráfico salta de dato en dato y los momentos quedan en su estado final.

## Notas

- **Todo lo del panel es inventado:** empresas, personas y cifras. Se avisa en el panel ("Datos de demostración") y en el pie de la web.
- **Los reportes se descargan en CSV de verdad,** generado en el navegador.
- **Falta por probar** en dispositivos reales.
