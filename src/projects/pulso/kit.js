// Monta las piezas de design-taste-frontend copiadas en public/pulso/kit/:
// los dos momentos (counter-rolls, word-highlight) y el diagrama. Se cargan como archivos tal cual,
// sin pasar por el empaquetador, como pide la skill ("the kit copied into its public folder").
const KIT = `${import.meta.env.BASE_URL}pulso/kit/`

function css(href) {
  if ([...document.querySelectorAll('link[rel="stylesheet"]')].some((l) => l.href.endsWith(href))) return
  const l = document.createElement('link')
  l.rel = 'stylesheet'
  l.href = href
  document.head.appendChild(l)
}

export async function mountKit(root) {
  window.__momentsManual = true // el cargador no se monta solo: lo hacemos sobre esta página
  css(`${KIT}diagrams/diagram.css`)
  const [moments, diagrams] = await Promise.all([
    import(/* @vite-ignore */ `${KIT}moments/moments.js`),
    import(/* @vite-ignore */ `${KIT}diagrams/diagram.js`),
  ])
  if (!root.isConnected) return
  root.querySelectorAll('[data-moment]').forEach((el) => moments.mount(el))
  diagrams.default.auto(root)
}
