import "./ProgressIndicator.css";
import { useProgress } from "@react-three/drei";
import { useLaunchParams } from "@telegram-apps/sdk-react";
import TriangleLoader from "./TriangleLoader";
import { useEffect } from "react";
import { get3DObject } from "@/types/work";

export default function ProgressIndicator() {
  const { progress } = useProgress();
  const lp = useLaunchParams();
  const obj3d = get3DObject(lp.startParam);

  useEffect(() => {
    console.log(progress);
  });
  if (progress === 100) return null;

  return (
    <div
      className="loader-container"
      style={{ backgroundColor: obj3d.backgroundColor, color: obj3d.textColor }}
    >
      <div className="loader">
        <TriangleLoader />
        {/*<div className="progress-text">Loading...</div>*/}
      </div>
      <div className="overlay">
        <a href={obj3d.channel}>
          <img
            alt={obj3d.name}
            src={obj3d.logo}
            style={{ position: "absolute", bottom: 40, left: 20, width: 30 }}
          />
        </a>
        <div
          style={{
            position: "absolute",
            bottom: 40,
            left: 55,
            fontSize: "13px",
          }}
        >
          <a href={obj3d.channel} style={{ color: obj3d.textColor }}>
            {obj3d.name}
          </a>
          <br />
          <a href={obj3d.channel} style={{ color: obj3d.textColor }}>
            by {obj3d.author}
          </a>
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 40,
            right: 20,
            fontSize: "13px",
          }}
        >
          {obj3d.createdAt}
        </div>
      </div>
    </div>
  );
}
