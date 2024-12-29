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

  const mainAuthor = obj3d.authors[0];

  return (
    <div
      className="loader-container"
      style={{
        backgroundColor: obj3d.backgroundColor,
        color: obj3d.foregroundColor,
      }}
    >
      <div className="loader">
        <TriangleLoader />
        {/*<div className="progress-text">Loading...</div>*/}
      </div>
      <div className="overlay">
        <a href={mainAuthor.channel}>
          <img
            alt={mainAuthor.name}
            src={mainAuthor.logo}
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
          <a href={mainAuthor.channel} style={{ color: obj3d.foregroundColor }}>
            {obj3d.name}
          </a>
          <br />
          <a href={mainAuthor.channel} style={{ color: obj3d.foregroundColor }}>
            by {mainAuthor.name}
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
