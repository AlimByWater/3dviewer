import { useState } from "react";
import { useLaunchParams } from "@telegram-apps/sdk-react";
import { useProgress } from "@react-three/drei";

import TriangleButton from "../../../components/TriangleButton";
import AuthorsPage from "../../../components/AuthorsPage";
import ProgressIndicator from "../../../components/ProgressIndicator";
import { get3DObject } from "@/types/work";

const Overlay = ({
  onSelectWork,
}: {
  onSelectWork: (workId: string) => void;
}) => {
  const [showAuthors, setShowAuthors] = useState(false);
  const { progress } = useProgress();
  const lp = useLaunchParams();
  const obj3d = get3DObject(lp.startParam);
  const isLoading = progress !== 100;

  const onCloseAuthorsPage = (workId?: string) => {
    setShowAuthors(false);
    if (workId) {
      onSelectWork(workId);
    }
  };

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    >
      {!isLoading && (
        <div style={{ pointerEvents: "auto" }}>
          <TriangleButton
            onClick={() => setShowAuthors(true)}
            color={obj3d.textColor}
          />
          {showAuthors && <AuthorsPage onClose={onCloseAuthorsPage} />}
        </div>
      )}
      {/*<Logo style={{ position: 'absolute', bottom: 40, left: 40, width: 30 }} />*/}
      <div style={{ pointerEvents: "auto" }}>
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
            color: obj3d.textColor,
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
      </div>
      <br />
      {/*<div style={{ position: 'absolute', top: 40, left: 40 }}>ok —</div>*/}
      <div
        style={{
          position: "absolute",
          bottom: 40,
          right: 20,
          fontSize: "13px",
          pointerEvents: "auto",
          color: obj3d.textColor,
        }}
      >
        {obj3d.createdAt}
      </div>
      <ProgressIndicator />
    </div>
  );
};

export default Overlay;
