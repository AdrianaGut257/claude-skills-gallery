import { PRIMITIVE_LIST, SEMANTIC, TYPE_SCALE } from '../ds/tokens.js'
import { href } from './pages.js'
import { PageHeader } from './ui.jsx'

export default function Changelog() {
  return (
    <article className="pd-prose">
      <PageHeader eyebrow="Proyecto" title="Registro de cambios">
        Todos los cambios importantes de Pétalo se anotan en esta página. El formato sigue Keep a Changelog y las
        versiones siguen el versionado semántico.
      </PageHeader>

      <section className="pd-release">
        <h2>Sin publicar</h2>
        <p className="pd-muted">No hay cambios pendientes de publicar.</p>
      </section>

      <section className="pd-release">
        <h2>
          1.0.0 <time dateTime="2026-11-01">2026-11-01</time>
        </h2>
        <p>Primera versión pública.</p>

        <h3>Añadido</h3>
        <ul>
          <li>
            {PRIMITIVE_LIST.length} colores primitivos en seis familias: lila, rosa, neutro, verde, ámbar y rojo.
          </li>
          <li>
            {SEMANTIC.length} tokens semánticos con tema claro y oscuro. Consulta <a href={href('tokens')}>Tokens</a>.
          </li>
          <li>
            Escala tipográfica de {TYPE_SCALE.length} niveles con tamaños fluidos. Consulta{' '}
            <a href={href('tipografia')}>Tipografía</a>.
          </li>
          <li>
            Componentes <code>Button</code>, <code>Field</code>, <code>Badge</code>, <code>Switch</code> y{' '}
            <code>Notice</code>.
          </li>
          <li>
            Función <code>contrast(fg, bg)</code> y auditoría automática de los temas. Consulta{' '}
            <a href={href('contraste')}>Comprobador de contraste</a>.
          </li>
        </ul>

        <h3>Notas de la versión</h3>
        <ul>
          <li>
            Antes de publicar, la auditoría de contraste detectó tres colores por debajo de 4,5:1. Se oscurecieron:{' '}
            <code>verde-600</code> (de #1F8A4C a #187A42), <code>ambar-600</code> (de #A76200 a #945600) y{' '}
            <code>rojo-600</code> (de #C9302C a #B82A26).
          </li>
        </ul>
      </section>
    </article>
  )
}
