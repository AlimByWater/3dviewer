import './ProgressIndicator.css';
import TriangleLoader from '@/components/TriangleLoader';
import { useProgress } from '@react-three/drei';
import { useViewer } from '../../_context/ViewerContext'; // Import useViewer

export default function ProgressIndicator({ color }: { color: string }) {
  const { progress } = useProgress();
  const {
    state: { assetLoading }, // Get asset loading state
  } = useViewer();

  // Determine if the loader should be visible based on assetLoading state
  let showLoader = false;
  let showPercentage = false;

  if (assetLoading === 'splat') {
    showLoader = true; // Always show for splat loading
    showPercentage = false; // Don't show percentage for splat
  } else if (assetLoading === 'glb') {
    // For GLB, rely on Drei progress
    if (progress < 100) {
      showLoader = true;
      showPercentage = true;
    }
  }
  // If assetLoading is 'none', showLoader remains false

  if (!showLoader) {
    return null; // Hide loader if not loading splat or GLB (or GLB is done)
  }

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
        {showPercentage ? `${progress.toFixed(0)}%` : ''}
      </div>
    </div>
  );
}
