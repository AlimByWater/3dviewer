import './ProgressIndicator.css'

import { useProgress } from '@react-three/drei'

export default function ProgressIndicator() {
  const { progress } = useProgress()
  if (progress == 100) return
  return (
    <div className="loader-container">
      <div className="loader">
        <div className="spinner"></div>
        <div className="progress-text">Loading...</div>
      </div>
    </div>
  )
}
