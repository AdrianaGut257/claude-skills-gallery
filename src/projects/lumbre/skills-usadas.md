# Skills usadas — Café Lumbre (landing 3D)

Landing de una cafetería de Cochabamba con una taza de cerámica en 3D como pieza central. Viene del proyecto "Café Lumbre" del portafolio, que incluía branding, piezas para redes y una landing con carta interactiva y pedidos por WhatsApp.

- La taza humea, tiene chispas de brasa alrededor y se gira con el dedo o el ratón.
- Cambia entre espresso, capuchino y mocha.

Este proyecto **no usa las skills de wondelai**. Usa dos paquetes nuevos, instalados en `.agents/skills/`:

- **[threejs-skills](https://github.com/CloudAI-X/threejs-skills)** (CloudAI-X): three.js r186.
- **[open-agents](https://github.com/vercel-labs/open-agents)** (Vercel Labs): solo sus cuatro skills de diseño. Las de agentes (ai-sdk, chat-sdk, workflow…) se dejaron fuera a propósito.

| Skill | Para qué se usó |
|-------|-----------------|
| **frontend-design** | La dirección visual: "luz de lumbre", tipografía con carácter y atmósfera |
| **emil-design-eng** | Los detalles de interacción: curvas, pulsación, pestañas con `clip-path`, inercia al arrastrar |
| **web-animation-design** | Qué se anima, cuánto dura y con qué curva |
| **baseline-ui** | Las reglas de accesibilidad, capas y rendimiento |
| **threejs-fundamentals** | Renderizador, cámara, `Timer`, `setAnimationLoop`, tono y limpieza |
| **threejs-geometry** | Taza, plato y asa con `LatheGeometry` y `TubeGeometry` |
| **threejs-materials** | Esmalte con `MeshPhysicalMaterial` y clearcoat, y texturas de canvas en sRGB |
| **threejs-lighting** | Luz clave, contraluz, hemisférica, entorno `RoomEnvironment` y sombras |
| **threejs-shaders** | El vapor: `ShaderMaterial` con ruido fbm |
| **threejs-interaction** | Arrastre con eventos de puntero que valen para ratón, dedo y lápiz |
| **threejs-performance** | Límite de densidad de píxeles, cero reservas de memoria por fotograma y pausa fuera de pantalla |

---

## 1. frontend-design

**Dirección elegida:** "luz de lumbre". Es cálida, nocturna y editorial. Lo que se recuerda es una taza que humea delante de un fuego que no se ve, pero se nota en el brillo y en la luz que parpadea.

- **Tipografía:**
  - **Gloock** para titulares, un serif de alto contraste con aire de rótulo antiguo.
  - **Albert Sans** para el texto, con cifras tabulares en los precios.
  - Ninguna de las dos se había usado en la galería.
- **Color.** La paleta del portafolio: brasa `#FFB347`, crema `#FFF1DC` y tueste `#7A3E2B` sobre espresso `#140D09`. Hay un solo acento por vista.
- **Ritmo.** Las secciones alternan oscuro (portada, la casa, identidad) y papel (carta, horario).
- **Atmósfera.** Un grano de papel fijo sobre toda la página y un único resplandor detrás de la taza.

## 2. emil-design-eng

Decisiones revisadas con el formato de la skill:

| Antes (lo habitual) | Después (en Lumbre) | Por qué |
|---------------------|---------------------|---------|
| Pestañas que cambian de color con `transition: color` | Dos copias de la lista; la activa se recorta con `clip-path` animado | La transición de color sale perfecta: nunca se ven dos estados mezclados |
| Botones sin respuesta al pulsar | `transform: scale(0.97)` en `:active`, 160 ms | El botón confirma que te ha oído |
| `ease` genérico | `--lb-ease-out: cubic-bezier(0.23, 1, 0.32, 1)` | Las curvas de serie no tienen fuerza |
| Girar la taza ligado al ratón sin más | Velocidad con inercia que se frena sola, y vuelve el giro lento tras 1,6 s quieta | Movimiento con momento, no un objeto pegado al cursor |
| Un segundo dedo hace saltar el giro | Se ignora el segundo dedo mientras dura el arrastre | Protección multitáctil |
| La barra del pedido entra y sale igual | Entra en 320 ms y sale en 200 ms | La salida debe ser más rápida |
| Hover también en móvil | Hover solo con `(hover: hover) and (pointer: fine)` | En pantallas táctiles el hover se dispara al tocar |

## 3. web-animation-design

| Elemento | Curva y duración | Motivo |
|----------|------------------|--------|
| Entrada de la portada | `ease-out`, 760 ms, escalonada 70 ms | Marketing, se ve una vez: se permite algo más largo |
| Recorte de la pestaña activa | `ease-in-out`, 300 ms | Un elemento en pantalla que se mueve de un sitio a otro |
| Tarjetas de la carta | `ease-out`, 320 ms, escalonadas 40 ms | Entran: siempre `ease-out` |
| Café que se vacía y se vuelve a llenar | `ease-in-out` al bajar y `ease-out` al subir | Bajar es movimiento en pantalla; subir es "llegar" |
| Taza al aparecer | Opacidad y escala desde 0,97, nunca desde 0 | Nada aparece de la nada |

- Solo se animan `transform` y `opacity`, más `clip-path` en las pestañas.
- Con "reducir movimiento":
  - No hay entrada escalonada ni giro automático.
  - Las chispas se quedan quietas y el vapor va más despacio.
  - El cambio de bebida es instantáneo.

## 4. baseline-ui

**Se aplicó:**
- `100dvh` en lugar de `100vh`.
- La barra fija del pedido respeta `safe-area-inset-bottom`.
- Escala fija de capas (`--lb-z-grain`, `--lb-z-header`, `--lb-z-orderbar`).
- `text-wrap: balance` en títulos, `pretty` en párrafos y `tabular-nums` en precios y horarios.
- `aria-label` en los botones de solo icono.
- La respuesta a la interacción dura 200 ms o menos.
- El bucle 3D se pausa fuera de pantalla.
- Sin cambios de `letter-spacing`.
- Zona táctil de 44 px en los botones de cantidad.

**No se aplicó, y por qué:**
- **Tailwind, `motion/react` y Base UI.** La galería usa CSS propio por proyecto, y la propia skill pide usar primero lo que ya tiene el proyecto.
- **"Nunca degradados" y "nunca animar si no se pide".** Choca con frontend-design y con el encargo (una taza 3D con vapor). Se resolvió con un único degradado radial decorativo detrás de la taza, nunca usado como botón ni en morado.
- **"No rehacer el teclado a mano".** Las pestañas tienen flechas izquierda y derecha hechas a mano, porque el proyecto no tiene Radix ni Base UI.

## 5. Skills de three.js (r186)

Escena en [`cupScene.js`](cupScene.js). Su interfaz es `createCupScene(canvas)`, que devuelve `setDrink()` y `dispose()`.

| Skill | Lo que se siguió |
|-------|------------------|
| fundamentals | `THREE.Timer` con `connect(document)` en lugar de `Clock` (obsoleto en r183), `setAnimationLoop` en lugar de `requestAnimationFrame`, `ACESFilmicToneMapping` y limpieza completa (geometrías, materiales, texturas, `renderer.dispose()` y `forceContextLoss()`) |
| geometry | Taza en dos piezas torneadas (exterior terracota, interior crema, como una taza bañada), asa con `TubeGeometry` sobre una curva y plato torneado con su hueco |
| materials | `MeshPhysicalMaterial` con clearcoat para el esmalte. Texturas de canvas con `colorSpace = SRGBColorSpace`. Latte art, crema atigrada y remolino de mocha dibujados en canvas |
| lighting | `PCFShadowMap` (no el obsoleto `PCFSoftShadowMap`), sombra con cámara ajustada, `ShadowMaterial` para un suelo invisible, `RoomEnvironment` con `PMREMGenerator` y una `PointLight` en candelas que parpadea como una llama |
| shaders | Vapor con `ShaderMaterial`: desplazamiento de vértices que mece el vapor y ruido fbm en el fragmento. Termina con `#include <tonemapping_fragment>` y `<colorspace_fragment>` |
| interaction | Eventos de puntero con `setPointerCapture`. `touch-action: pan-y` para que en móvil el scroll vertical siga funcionando |
| performance | `setPixelRatio(min(dpr, 2))`, sombra de 1024 px, chispas actualizadas sobre el mismo `Float32Array` (sin reservas de memoria por fotograma), `IntersectionObserver` que detiene el bucle fuera de pantalla y three.js cargado aparte con `import()` |

**Peso:** three.js va en su propio paquete (143 KB comprimido) y solo se descarga en esta página.

---

## Notas

- **Pedido por WhatsApp.** El enlace usa `https://wa.me/?text=…` sin número: abre WhatsApp con el pedido escrito y eliges a quién enviarlo. Así no se escribe a ningún número real.
- **Marca de demostración.** Café Lumbre es una marca de demostración: lo dice el pie de página.
- **Falta por probar:**
  - En dispositivos reales. Las capturas se hicieron con Chrome sin interfaz, que dibuja WebGL por software.
  - El giro de la taza con teclado. Es decorativo; el selector de bebida sí funciona con teclado.
