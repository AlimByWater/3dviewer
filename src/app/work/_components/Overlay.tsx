import { Fragment, useState } from "react";
import { useLaunchParams } from "@telegram-apps/sdk-react";
import { useProgress } from "@react-three/drei";

import TriangleButton from "../../../components/TriangleButton";
import AuthorsPage from "../../../components/AuthorsPage";
import ProgressIndicator from "../../../components/ProgressIndicator";
import { Work } from "@/types/work";

const Overlay = ({
  work,
  onSelectWork,
}: {
  work: Work;
  onSelectWork: (workId: string) => void;
}) => {
  const [showAuthors, setShowAuthors] = useState(false);
  const { progress } = useProgress();
  const lp = useLaunchParams();
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
            color={work.foregroundColor}
          />
          {showAuthors && <AuthorsPage onClose={onCloseAuthorsPage} />}
        </div>
      )}

      <div style={{ pointerEvents: "auto" }}>
        {work.authors.map((author) => (
          <img
            key={author.telegramUserId}
            alt={author.name}
            src={author.logo}
            style={{ position: "absolute", bottom: 40, left: 20, width: 30 }}
          />
        ))}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            left: 55,
            fontSize: "13px",
            color: work.foregroundColor,
          }}
        >
          <a style={{ color: work.foregroundColor }}>{work.name}</a>
          <br />
          <div>
            {"by "}
            {work.authors.map((author, index) => (
              <Fragment key={author.telegramUserId}>
                <a
                  href={author.channel}
                  style={{ color: work.foregroundColor }}
                >
                  {author.name}
                </a>
                {index < work.authors.length - 1 ? " & " : ""}
              </Fragment>
            ))}
          </div>
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
          color: work.foregroundColor,
        }}
      >
        {work.createdAt}
      </div>
      <ProgressIndicator />
    </div>
  );
};

export default Overlay;
