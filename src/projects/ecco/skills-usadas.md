# Skills usadas — Ecco (tienda de moda sostenible)

Tienda online de una marca de demostración. Cada prenda lleva una **etiqueta verde** con el agua y el CO₂ que ahorra frente a una prenda convencional, su fibra, su origen y los kilómetros que viaja. La bolsa suma el impacto de todo el pedido.

| Skill | De dónde | Para qué se usó |
|-------|----------|-----------------|
| **impeccable** | pbakaus/impeccable | Dirección visual propia, mínimo de calidad (contraste, foco, selección, estados) y lista de cosas que evitar |
| **design-taste-frontend** | leonxlnx/taste-skill | Tipo de página "producto": fotos que mandan, una sección por pantalla, bordes iguales, hover discreto y una sola entrada en la portada |
| **animate** | emilkowalski/skills | Qué se anima y por qué, con sus curvas y duraciones |
| **gestures** | emilkowalski/skills | La bolsa como cajón con arrastre: usar Vaul en lugar de improvisarlo |

## Dirección: "la etiqueta dice la verdad"

- **La pieza central es la etiqueta verde**, diseñada como una etiqueta de composición de ropa:
  - esquinas superiores cortadas y un agujero;
  - filas con regla y nombres en mayúsculas condensadas.
- **En la portada cuelga del perchero** y se balancea una vez al cargar.
- **Tipografía:** Archivo en tres anchos.
  - **Expandida** para los titulares.
  - **Normal** para el texto.
  - **Condensada** para las etiquetas, como en la ropa.
  - impeccable desaconseja las fuentes "de siempre" (Fraunces, Outfit, DM Sans…), y Archivo no se había usado en la galería.
- **Color:** la paleta del portafolio.
  - Menta `#E8F5EA` y hoja `#7FBF8E` para la etiqueta.
  - Bosque `#1F4A33` para la banda de "Cómo medimos" y los botones.
  - Naranja `#FF9F6E` solo para las cifras de impacto de la bolsa y el contador.
  - Nada de crema, violeta ni degradados.

## impeccable

- **Lanzador no ejecutado.** El lanzador de impeccable descarga y ejecuta un binario, así que no se ejecutó. Se siguieron sus guías leyéndolas: `new-work.md` y `craft-floor.md`.
- **Del mínimo de calidad se aplicó:**
  - contraste de texto de al menos 4,5:1;
  - foco visible con el color de la marca;
  - `::selection` con la paleta;
  - cifras tabulares;
  - errores junto al campo ("Elige una talla…");
  - estados vacío y deshabilitado.
- **Se evitó:**
  - antetítulos sobre los titulares, que impeccable prohíbe;
  - texto con degradado;
  - tarjetas con borde de color a un lado;
  - sombras duras;
  - iconos con emojis (todos son de línea, con el mismo trazo).

## design-taste-frontend

- **Tipo de página:** *product*, con *site-kind* "other": un producto físico que se vende en línea. Eso significa fotos que mandan, fondos planos y ningún efecto ni escena 3D.
- **Fotos:**
  - No hay fotos propias de la marca, así que se usaron **fotos sustitutas** de prendas reales.
  - Son CC0, de Unsplash vía Wikimedia Commons, y se buscaron con la API de Commons como pide la "búsqueda en vivo" de la skill.
  - Ninguna lleva pie de foto. El crédito va en una línea del pie de página.
- **Reglas aplicadas:**
  - la portada sola en la primera pantalla;
  - un dato concreto ("unos 2.700 litros por camiseta");
  - botones con verbo y objeto ("Ver la colección", "Añadir a la bolsa");
  - cada foto distinta;
  - la tarjeta sube 2 px y su foto crece un 3 % con el ratón.
- **Lo que no se pudo usar:** sus scripts (el reparto de paleta y diseño, el comprobador y la puerta final) son código de terceros que el sistema de permisos no deja ejecutar. La comprobación se hizo con capturas en Chrome a 1440, 1100 y 390 px.

## animate (Emil Kowalski)

| Elemento | ¿Se anima? Propósito | Cómo |
|----------|----------------------|------|
| Etiqueta que se balancea | Sí, una vez: **explicación** (enseña que la etiqueta va en cada prenda) | Animación CSS de péndulo amortiguado, 2,4 s, curva senoidal en cada tramo, origen en el agujero |
| Entrada de la portada | Sí, una vez | `ease-out` fuerte (`cubic-bezier(0.23, 1, 0.32, 1)`), 700 ms, escalonada 70 ms |
| Botones y chips | Sí: **respuesta** | `scale(0.97)` al pulsar, 160 ms |
| Tarjeta de producto | Sí, sutil (se ve decenas de veces) | Sube 2 px y la foto crece un 3 %, solo con ratón |
| Cifras de la bolsa | Sí: **indicar el cambio** | La cifra nueva entra con `@starting-style`, 220 ms; transiciones, no keyframes |
| Filtros y orden del catálogo | **No** | Cambio inmediato: se usan muchas veces |

Con "reducir movimiento" no hay balanceo ni entrada, y nada queda oculto.

## gestures (Emil Kowalski)

La skill dice que un cajón bien hecho necesita varias cosas: arrastre con inercia, fondo que se oscurece según el arrastre, cierre por velocidad, foco atrapado y Escape. Por eso recomienda **Vaul** en vez de hacerlo a mano.

- **Escritorio:** la bolsa entra por la derecha.
- **Móvil:** es una hoja inferior que se arrastra hacia abajo para cerrar y se puede atrapar a medio camino.
- **Arrastre:** la lista lleva `data-vaul-no-drag` para que su scroll no arrastre la hoja.

## Notas

- **Marca de demostración:** Ecco lo es, y lo dice el pie. Las cifras de impacto son estimaciones de ejemplo; también se dice en "Cómo medimos".
- **El dato de 2.700 litros por camiseta de algodón** es la cifra que suele citarse (WWF).
- **"Ir a pagar"** no cobra nada: explica que el pago no está conectado.
- **Falta por probar:**
  - El arrastre de la bolsa en un móvil real.
  - **review-animations**, que solo puede lanzarse a mano con `/review-animations`.
