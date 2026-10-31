import DayflowApp from './app/DayflowApp.jsx'
import DayflowLanding from './DayflowLanding.jsx'

export default function Dayflow({ subpath }) {
  return subpath === 'app' ? <DayflowApp /> : <DayflowLanding />
}
