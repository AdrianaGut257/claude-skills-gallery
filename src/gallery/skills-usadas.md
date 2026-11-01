# Skills usadas — Portada de la galería

La portada tiene una **lámina 3D**, en la línea de "Laboratorio de skills":

- **Cada proyecto es una molécula.** El núcleo es el proyecto y cada átomo, una de sus skills. Café Lumbre, con 11 skills, es la molécula más grande.
- **Pasar el cursor** sobre una molécula (o sobre su tarjeta, más abajo) la resalta: crece, gira más rápido y su etiqueta se pone en negro. La tarjeta también se levanta.
- **Hacer clic o tocar** una molécula abre su proyecto.
- **Al cargar**, las moléculas se montan solas: primero el núcleo y luego los átomos, que salen por sus enlaces.
- **La cámara sigue un poco al ratón.** Como las sombras caen en una pared de papel detrás, se nota la profundidad.

No se ha tocado ningún proyecto. Solo cambian `src/gallery/` y `vite.config.js`.

| Skill | Para qué se usó |
|-------|-----------------|
| **threejs-react-three-fiber** | La escena escrita como componentes de React: `<Canvas>`, `useFrame`, `useThree` y eventos de puntero |
| **threejs-animation** | El montaje de cada molécula: un `AnimationClip` con pistas de fotogramas clave y un `AnimationMixer` |
| **threejs-fundamentals** | Cámara, tono de color, espacio de color y limpieza de geometrías y materiales |
| **threejs-materials** | Plástico brillante de maqueta con `MeshPhysicalMaterial` y clearcoat; `ShadowMaterial` para la pared |
| **threejs-lighting** | Luz clave con sombra suave, luz hemisférica de relleno y entorno `RoomEnvironment` |
| **threejs-performance** | Una sola geometría para todos los átomos, bucle parado fuera de pantalla y three.js cargado aparte |

Las dos primeras no se habían usado en ningún proyecto.

---

## 1. threejs-react-three-fiber

- **Escena declarativa.** [`LabScene.jsx`](LabScene.jsx) pinta una molécula por cada proyecto del registro con `projects.map(...)`. Un proyecto nuevo aparece en la lámina sin tocar nada más.
- **Tono de color "Neutral".** `gl={{ toneMapping: NeutralToneMapping }}` se pasa como objeto fijo fuera del componente. Fiber solo aplica su ACES si no se le da otro tono. Neutral respeta mejor los colores de marca de cada proyecto.
- **Sombras.** `shadows="percentage"` en lugar de `shadows`. Así se elige `PCFShadowMap` sin el aviso de `PCFSoftShadowMap`, que está obsoleto.
- **Un solo `useFrame` para todo.** Mueve la cámara, el montaje, la flotación, el resalte y las etiquetas. Los cambios por fotograma se hacen sobre objetos (`ref`), nunca con `setState`.
- **Delta del fotograma, no incrementos fijos.** Todo usa `delta`, limitado a 0,1 s para que no salte tras volver a la pestaña. `state.clock.elapsedTime`, no `getElapsedTime()`.
- **Zona de puntero.** Cada molécula tiene una esfera invisible (`colorWrite: false`) que recibe los eventos. Así el resalte no parpadea al pasar de un átomo a un enlace, y la zona es más grande, más fácil de acertar.
- **Toque frente a scroll.** `e.delta > 6` descarta el clic si el dedo se movió: hacer scroll sobre la lámina no abre un proyecto.
- **Modo bajo demanda.** Con "reducir movimiento" el lienzo usa `frameloop="demand"` y llama a `invalidate()` cuando algo cambia.

## 2. threejs-animation

- **El montaje es un `AnimationClip` por molécula.** Tiene pistas `VectorKeyframeTrack` de posición y escala para cada átomo y cada enlace, que se encuentran por nombre (`a3.position`, `b3.scale`).
- **Reproducción una sola vez.** `LoopOnce` con `clampWhenFinished`: al terminar, cada pieza se queda en su sitio. Cuando salta el evento `finished`, el mixer deja de actualizarse.
- **`mixer.update(0)` nada más crear la acción.** Aplica la pose inicial antes del primer fotograma, así nada se ve en su sitio final antes de tiempo.
- **Curva ease-out muestreada en 8 claves** (las pistas interpolan en línea recta entre claves). El núcleo sale al 40 %, se pasa al 108 % y se asienta.
- **Generación a generación.** Un átomo empieza cuando su padre casi ha llegado, y antes de su turno está oculto (escala casi 0).
- **Movimiento procedural con `MathUtils.damp`** para el resalte (crecer y encoger) y para la cámara que sigue al ratón. No depende de la velocidad de refresco de la pantalla.
- **Limpieza.** `stopAllAction()` y `uncacheRoot()` al desmontar.

## 3. Resto de skills de three.js

| Skill | Lo que se siguió |
|-------|------------------|
| fundamentals | Cámara de 30° (menos deformación, como en una foto de producto), lienzo transparente para que se vea el papel milimetrado de la página, colores en sRGB y limpieza de todo lo creado a mano |
| materials | `MeshPhysicalMaterial` con `clearcoat` 0,75 para el plástico. Los enlaces, en metal satinado (`metalness` 0,55). Un material por color, compartido entre moléculas |
| lighting | Luz direccional cálida con sombra (`radius` 7, cámara de sombra ajustada al tamaño de la lámina), luz hemisférica crema y `RoomEnvironment` con `PMREMGenerator` para los brillos, sin descargar ningún HDR |
| performance | Una `SphereGeometry` y un `CylinderGeometry` para todos los átomos y enlaces (escalados), `dpr={[1, 2]}`, `frameloop="never"` cuando la lámina sale de pantalla (`IntersectionObserver`) y la escena cargada con `lazy()` después del texto |

---

## Cómo se construye una molécula

En [`molecules.js`](molecules.js):

- **Semilla.** Todo sale del slug del proyecto, así que la misma molécula se dibuja siempre igual.
- **Primeros cuatro átomos.** Se enlazan al núcleo en tetraedro, como un carbono.
- **El resto crece en ramas** con el ángulo de 109,5°. Se prueban varios giros y se queda el que deja más espacio libre.
- **Colores.** Salen de la paleta de cada proyecto (elegidos a mano para los cinco actuales). Los proyectos nuevos usan su vista previa.
- **Colocación en la lámina.** Las moléculas empiezan en espiral y se separan hasta no pisarse. Cada una reserva también el sitio de su etiqueta. Se recalcula al cambiar el tamaño de la pantalla.

## Accesibilidad

- La lámina es decorativa (`aria-hidden`). Las tarjetas siguen siendo la navegación principal.
- Las etiquetas de la lámina no se alcanzan con el tabulador, para no repetir cada enlace dos veces.
- Con el teclado, al enfocar una tarjeta se resalta su molécula.
- Con "reducir movimiento":
  - No hay montaje, giro, flotación ni paralaje.
  - Las moléculas aparecen ya montadas y quietas.
  - El resalte sigue funcionando, sin animación.
- Si WebGL falla, en lugar de la escena se ve un icono de línea y la portada sigue en pie.

## Notas

- **Aviso de `THREE.Clock` en la consola.** Viene de React Three Fiber 9.8, que crea un `Clock` por dentro. La propia skill lo advierte; no viene de este código.
- **Peso.** three.js va en su propio paquete (`three-*.js`, 187 KB comprimido), compartido con Café Lumbre: se descarga una vez y el otro lo encuentra en caché. Fiber necesita three.js completo, por eso pesa más que cuando solo lo usaba Lumbre (143 KB). La escena de la portada suma 60 KB comprimidos, y todo se descarga después de que la página ya se ve.
- **Falta por probar** en dispositivos reales: las capturas se hicieron con Chrome sin interfaz, que dibuja WebGL por software.
