import { Button, Notice } from '../ds/components.jsx'
import { href } from './pages.js'
import { CodeBlock, PageHeader } from './ui.jsx'

const WRAP = `import { PetaloTheme } from './ds/components.jsx'

export default function App() {
  return (
    <PetaloTheme theme="light">
      {/* El resto de tu aplicación */}
    </PetaloTheme>
  )
}`

const BUTTON = `import { Button } from './ds/components.jsx'

<Button variant="VARIANT" icon="ICON_NAME">
  Guardar
</Button>`

const DARK = `<PetaloTheme theme="dark">`

const CSS = `.mi-tarjeta {
  background: var(--pt-surface);
  border: 1px solid var(--pt-border);
  color: var(--pt-text);
}`

export default function Start() {
  return (
    <article className="pd-prose">
      <PageHeader eyebrow="Guía" title="Empezar con Pétalo">
        Esta guía te enseña a añadir Pétalo a un proyecto de React y a mostrar tu primer botón. Es para personas que
        ya saben crear un proyecto de React.
      </PageHeader>

      <h2>Antes de empezar</h2>
      <p>Necesitas lo siguiente:</p>
      <ul>
        <li>Un proyecto de React 18 o posterior.</li>
        <li>
          Las fuentes <strong>Geist</strong> y <strong>Geist Mono</strong> cargadas en tu <code>index.html</code>, por
          ejemplo desde Google Fonts.
        </li>
      </ul>

      <h2>Añadir Pétalo a tu proyecto</h2>
      <ol className="pd-steps">
        <li>
          <p>
            Copia la carpeta <code>src/projects/petalo/ds/</code> de este repositorio en la carpeta <code>src/</code>{' '}
            de tu proyecto.
          </p>
        </li>
        <li>
          <p>
            Envuelve tu aplicación con <code>PetaloTheme</code>:
          </p>
          <CodeBlock code={WRAP} />
        </li>
        <li>
          <p>Añade un botón donde lo necesites:</p>
          <CodeBlock code={BUTTON} />
          <p>Sustituye lo siguiente:</p>
          <dl className="pd-placeholders">
            <div>
              <dt>
                <code>VARIANT</code>
              </dt>
              <dd>
                <code>primary</code> para la acción principal, <code>secondary</code> para el resto o{' '}
                <code>ghost</code> para acciones de poco peso.
              </dd>
            </div>
            <div>
              <dt>
                <code>ICON_NAME</code>
              </dt>
              <dd>
                El nombre de un icono de <code>ds/icons.jsx</code>, por ejemplo <code>check</code>. Opcional: si no
                quieres icono, quita la prop <code>icon</code>.
              </dd>
            </div>
          </dl>
        </li>
      </ol>

      <h2>Comprobar el resultado</h2>
      <p>Abre tu aplicación. El botón aparece con el color de la variante que elegiste:</p>
      <div className="pd-preview">
        <Button icon="check">Guardar</Button>
        <Button variant="secondary">Cancelar</Button>
        <Button variant="ghost">Más tarde</Button>
      </div>
      <Notice tone="info" title="Si el botón aparece sin estilos">
        Comprueba que está dentro de <code>PetaloTheme</code>. Fuera de él, las variables <code>--pt-*</code> no
        existen.
      </Notice>

      <h2>Cambiar al tema oscuro</h2>
      <p>
        Para usar el tema oscuro, cambia el valor de <code>theme</code>:
      </p>
      <CodeBlock code={DARK} />
      <p>No tienes que cambiar ningún componente. Prueba el selector de tema de esta página para verlo.</p>

      <h2>Usar los tokens en tu CSS</h2>
      <p>
        Para que tus propios estilos cambien con el tema, usa las variables <code>--pt-*</code>:
      </p>
      <CodeBlock code={CSS} lang="css" />
      <p>
        Si escribes un color a mano, por ejemplo <code>#7A4BDB</code>, ese color no cambia con el tema ni pasa por la
        auditoría de contraste.
      </p>

      <h2>Siguientes pasos</h2>
      <ul>
        <li>
          Para conocer todos los tokens y cuándo usar cada uno, consulta <a href={href('tokens')}>Tokens</a>.
        </li>
        <li>
          Para ver las props de cada componente, consulta <a href={href('componentes')}>Componentes</a>.
        </li>
      </ul>
    </article>
  )
}
