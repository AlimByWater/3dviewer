import './ProgressIndicator.css';
import TriangleLoader from '@/components/TriangleLoader';

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
