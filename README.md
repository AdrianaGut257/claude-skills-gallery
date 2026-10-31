# Claude Skills Gallery

Galería de proyectos de prueba creados con las skills de Claude (de wondelai, en `.agents/skills/`).

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
```

## Añadir un proyecto nuevo

1. Crea una carpeta en `src/projects/<slug>/` con su componente, su CSS y sus `.md`.
2. Usa un prefijo propio en las clases CSS (DAYFLOW usa `df-`) para que los estilos no choquen con otros proyectos.
3. Añade una entrada en `src/projects/registry.js` con su número, título, descripción, skills y vista previa.
