# Claude Skills Gallery

Galería de proyectos de prueba creados con las skills de Claude (de wondelai, CloudAI-X y Vercel Labs, en `.agents/skills/`).

## Arrancar

```bash
npm install
npm run dev
```

Abre la URL que muestra la terminal (normalmente http://localhost:5173). La página de inicio es la galería, y cada tarjeta abre un proyecto.

## Estructura

```
src/
  App.jsx              ← rutas: "#/" galería, "#/<slug>" proyecto
  gallery/             ← página de inicio
    LabScene.jsx       ← lámina 3D: cada proyecto es una molécula (React Three Fiber)
    molecules.js       ← forma, color y colocación de cada molécula
    skills-usadas.md
  projects/
    registry.js        ← lista de proyectos que aparecen en la galería
    dayflow/           ← proyecto 01: landing de DAYFLOW + app funcional
      index.jsx        ← "#/dayflow" landing, "#/dayflow/app" app
      DayflowLanding.jsx
      dayflow.css
      app/             ← la app: tareas, panel "Tu día" y modo Enfoque
    basta/             ← proyecto 02: juego ¡Basta! (tutti frutti en grupo)
      index.jsx        ← fases del juego
      logic.js         ← letras, categorías y puntuación
      game.js          ← estado de la partida y guardado
      skills-usadas.md
      copy-landing.md  ← texto de la landing
      skills-usadas.md ← skills usadas y cómo se aplicaron
    florecer/          ← proyecto 03: app de hábitos Florecer + caso de estudio
      index.jsx        ← "#/florecer" app, "#/florecer/caso" caso de estudio
      store.js         ← hábitos, etapas de la flor y guardado
      Flower.jsx       ← la flor en SVG
      skills-usadas.md
    petalo/            ← proyecto 04: sistema de diseño Pétalo DS + documentación
      index.jsx        ← "#/petalo" inicio, "#/petalo/<página>" cada página
      ds/              ← el sistema: tokens, contraste, componentes e iconos
      docs/            ← las páginas de la documentación
      skills-usadas.md
    lumbre/            ← proyecto 05: landing 3D de Café Lumbre (three.js)
      cupScene.js      ← la escena 3D de la taza
      Menu.jsx         ← carta interactiva y pedido por WhatsApp
      skills-usadas.md
```

## Añadir un proyecto nuevo

1. Crea una carpeta en `src/projects/<slug>/` con su componente, su CSS y sus `.md`.
2. Usa un prefijo propio en las clases CSS (DAYFLOW usa `df-`) para que los estilos no choquen con otros proyectos.
3. Añade una entrada en `src/projects/registry.js` con su número, título, descripción, skills y vista previa.
