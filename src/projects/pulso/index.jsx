import Landing from './Landing.jsx'
import Panel from './Panel.jsx'
import './pulso.css'

// "#/pulso" es la web del producto; "#/pulso/panel[/<sección>]" el panel.
export default function Pulso({ subpath = '' }) {
  const [first, view = ''] = subpath.split('/')
  return <div className="gs">{first === 'panel' ? <Panel view={view} /> : <Landing />}</div>
}
