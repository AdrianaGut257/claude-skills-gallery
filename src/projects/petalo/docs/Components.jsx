import { useState } from 'react'
import { Badge, Button, Field, Notice, Switch } from '../ds/components.jsx'
import { CodeBlock, DesignNote, PageHeader, PropsTable } from './ui.jsx'

const SECTIONS = [
  { id: 'button', name: 'Button' },
  { id: 'field', name: 'Field' },
  { id: 'badge', name: 'Badge' },
  { id: 'switch', name: 'Switch' },
  { id: 'notice', name: 'Notice' },
]

function EmailField() {
  const [value, setValue] = useState('ana@correo')
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  return (
    <Field
      label="Correo electrónico"
      type="email"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      hint="Te escribiremos solo para avisos de tu cuenta."
      error={value && !valid ? 'Escribe un correo completo, por ejemplo ana@correo.com.' : undefined}
    />
  )
}

function SwitchDemo() {
  const [a, setA] = useState(true)
  const [b, setB] = useState(false)
  return (
    <div className="pd-stack">
      <Switch checked={a} onChange={setA} label="Recordatorios por correo" />
      <Switch checked={b} onChange={setB} label="Modo compacto" />
      <Switch checked={false} onChange={() => {}} label="Sincronizar (no disponible)" disabled />
    </div>
  )
}

export default function Components() {
  const go = (id) => document.getElementById(`pd-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  return (
    <article className="pd-prose">
      <PageHeader eyebrow="Construye" title="Componentes">
        Pétalo tiene cinco componentes. Cada uno tiene una interfaz pequeña: pocas props y valores por defecto
        pensados para el caso común.
      </PageHeader>

      <nav className="pd-subnav" aria-label="Componentes en esta página">
        {SECTIONS.map((s) => (
          <button key={s.id} type="button" onClick={() => go(s.id)}>
            {s.name}
          </button>
        ))}
      </nav>

      <section id="pd-button" className="pd-comp">
        <h2>Button</h2>
        <p>Inicia una acción. Usa una sola variante primaria por vista.</p>
        <div className="pd-preview">
          <Button icon="check">Guardar</Button>
          <Button variant="secondary">Cancelar</Button>
          <Button variant="ghost">Más tarde</Button>
          <Button size="sm" icon="plus">
            Añadir
          </Button>
          <Button disabled>No disponible</Button>
        </div>
        <CodeBlock code={`<Button icon="check">Guardar</Button>\n<Button variant="secondary">Cancelar</Button>`} />
        <PropsTable
          rows={[
            ['variant', "'primary' | 'secondary' | 'ghost'", "'primary'", 'El peso visual de la acción.'],
            ['size', "'md' | 'sm'", "'md'", 'El tamaño del botón. Usa sm en tablas y barras de herramientas.'],
            ['icon', 'string', '—', 'El nombre de un icono que aparece antes del texto.'],
            ['disabled', 'boolean', 'false', 'Si es true, el botón no responde y se ve atenuado.'],
          ]}
        />
        <DesignNote>
          No hay prop <code>color</code>. En el proyecto original, cada pantalla acababa con un rosa distinto porque
          cada persona elegía el suyo. Con tres variantes cerradas, el color correcto es el único posible.
        </DesignNote>
      </section>

      <section id="pd-field" className="pd-comp">
        <h2>Field</h2>
        <p>Campo de texto con etiqueta, ayuda y error. Prueba a completar el correo del ejemplo.</p>
        <div className="pd-preview pd-preview-form">
          <EmailField />
          <Field label="Nombre" placeholder="Ana Pérez" />
        </div>
        <CodeBlock code={`<Field\n  label="Correo electrónico"\n  hint="Te escribiremos solo para avisos de tu cuenta."\n  error={ERROR_MESSAGE}\n/>`} />
        <p>
          Sustituye <code>ERROR_MESSAGE</code> por el texto del error, o por <code>undefined</code> si el valor es
          válido.
        </p>
        <PropsTable
          rows={[
            ['label', 'string', '—', 'La etiqueta visible del campo. Obligatoria.'],
            ['hint', 'string', '—', 'Un texto de ayuda bajo el campo.'],
            ['error', 'string', '—', 'El mensaje de error. Si existe, sustituye a hint y marca el campo como inválido.'],
            ['…props', 'InputHTMLAttributes', '—', 'Cualquier otra prop pasa al elemento input.'],
          ]}
        />
        <DesignNote>
          La etiqueta es obligatoria porque un campo sin etiqueta no se puede usar con lector de pantalla. El error
          sustituye a la ayuda en lugar de sumarse: debajo del campo nunca hay dos mensajes compitiendo.
        </DesignNote>
      </section>

      <section id="pd-badge" className="pd-comp">
        <h2>Badge</h2>
        <p>Etiqueta corta para mostrar un estado.</p>
        <div className="pd-preview">
          <Badge>Borrador</Badge>
          <Badge tone="accent">Nuevo</Badge>
          <Badge tone="success">Publicado</Badge>
          <Badge tone="warning">Pendiente</Badge>
          <Badge tone="danger">Rechazado</Badge>
        </div>
        <CodeBlock code={`<Badge tone="success">Publicado</Badge>`} />
        <PropsTable
          rows={[
            ['tone', "'neutral' | 'accent' | 'success' | 'warning' | 'danger'", "'neutral'", 'El significado del estado.'],
            ['children', 'ReactNode', '—', 'El texto de la etiqueta. Una o dos palabras.'],
          ]}
        />
      </section>

      <section id="pd-switch" className="pd-comp">
        <h2>Switch</h2>
        <p>Enciende o apaga una opción. El cambio se aplica al momento, sin botón de guardar.</p>
        <div className="pd-preview">
          <SwitchDemo />
        </div>
        <CodeBlock code={`const [on, setOn] = useState(false)\n\n<Switch checked={on} onChange={setOn} label="Modo compacto" />`} />
        <PropsTable
          rows={[
            ['checked', 'boolean', '—', 'True si la opción está encendida; false si está apagada.'],
            ['onChange', '(checked: boolean) => void', '—', 'Recibe el nuevo valor cada vez que la persona lo cambia.'],
            ['label', 'string', '—', 'El texto que describe la opción.'],
            ['disabled', 'boolean', 'false', 'Si es true, el interruptor no responde.'],
          ]}
        />
        <DesignNote>
          <code>onChange</code> recibe directamente <code>true</code> o <code>false</code>, no un evento. Quien usa el
          componente no necesita saber que por dentro es un botón con <code>role="switch"</code>.
        </DesignNote>
      </section>

      <section id="pd-notice" className="pd-comp">
        <h2>Notice</h2>
        <p>Aviso dentro de la página. Usa uno por sección como mucho.</p>
        <div className="pd-preview pd-preview-stack">
          <Notice tone="info" title="Tu cuenta está casi lista">
            Confirma tu correo para recibir avisos.
          </Notice>
          <Notice tone="success" title="Cambios guardados" />
          <Notice tone="warning" title="Tu plan termina en 3 días">
            Renuévalo para no perder tus proyectos.
          </Notice>
          <Notice tone="danger" title="No se pudo publicar">
            Revisa tu conexión y vuelve a intentarlo.
          </Notice>
        </div>
        <CodeBlock code={`<Notice tone="warning" title="Tu plan termina en 3 días">\n  Renuévalo para no perder tus proyectos.\n</Notice>`} />
        <PropsTable
          rows={[
            ['tone', "'info' | 'success' | 'warning' | 'danger'", "'info'", 'El tipo de aviso. Decide el color y el icono.'],
            ['title', 'string', '—', 'Una frase corta que resume el aviso.'],
            ['children', 'ReactNode', '—', 'El detalle y, si hace falta, qué hacer después.'],
          ]}
        />
        <DesignNote>
          El icono no es una prop: va unido al tono. Así un aviso de error siempre se ve igual y no depende solo del
          color para entenderse.
        </DesignNote>
      </section>
    </article>
  )
}
