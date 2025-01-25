import './ProgressIndicator.css';
import TriangleLoader from '../../../components/TriangleLoader';
import { useProgress } from '@react-three/drei';

export default function ProgressIndicator({ color }: { color: string }) {
  const { progress } = useProgress();
  if (progress == 100) return;
  return (
    <div
      className="loader-container"
      style={{
        color: color,
      }}
    >
      <div className="loader">
        <TriangleLoader />
        {progress.toFixed(0)}%
      </div>
    </div>
  );
}
