import './ProgressIndicator.css'

import { useProgress } from '@react-three/drei'

export default function ProgressIndicator() {
  const { active } = useProgress()
  if (!active) return

  return (
    <div className="loader-container">
      <div className="loader">
        <div className="spinner"></div>
        <div className="progress-text">Loading...</div>
      </div>
    </div>
  )
}
