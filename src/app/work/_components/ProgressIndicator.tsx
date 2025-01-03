import "./ProgressIndicator.css";
import TriangleLoader from "../../../components/TriangleLoader";
import { useProgress } from "@react-three/drei";

export default function ProgressIndicator({
  color,
  backgroundColor,
}: {
  color: string;
  backgroundColor: string;
}) {
  const { progress } = useProgress();
  if (progress == 100) return;
  return (
    <div
      className="loader-container"
      style={{
        backgroundColor: backgroundColor,
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
