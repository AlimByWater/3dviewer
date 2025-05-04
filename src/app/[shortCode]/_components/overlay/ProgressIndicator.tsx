import './ProgressIndicator.css';
import TriangleLoader from '@/components/TriangleLoader';
import { useProgress } from '@react-three/drei';
import { useViewer } from '../../_context/ViewerContext'; // Import useViewer

export default function ProgressIndicator({
  color,
  progress,
}: {
  color: string;
  progress: number | null;
}) {
  // Render the loader
  return (
    <div
      className="loader-container"
      style={{
        color: color,
      }}
    >
      <div className="loader">
        <TriangleLoader />
        {/* Show percentage only if loading GLB */}
        {progress && `${progress.toFixed(0)}%`}
      </div>
    </div>
  );
}
