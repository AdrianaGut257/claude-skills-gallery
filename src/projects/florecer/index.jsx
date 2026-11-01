import CaseStudy from './CaseStudy.jsx'
import FlorecerApp from './FlorecerApp.jsx'
import './florecer.css'

// "#/florecer" abre la app y "#/florecer/caso" el caso de estudio.
export default function Florecer({ subpath }) {
  return subpath === 'caso' ? <CaseStudy /> : <FlorecerApp />
}
