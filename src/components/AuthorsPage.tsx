import { useState, useEffect, CSSProperties } from "react";
import "./AuthorsPage.css";
import { postEvent, on, useLaunchParams } from "@telegram-apps/sdk-react";
import { Author, Work } from "@/types/work";

const getAuthors = async (): Promise<Author[]> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/authors`);
  if (!res.ok) {
    throw Error("Failed to fetch authors");
  }
  return res.json();
};

const getAuthorWorks = async (telegramUserId: number): Promise<Work[]> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/works?telegramUserId=${telegramUserId}`
  );
  if (!res.ok) {
    throw Error(`Failed to fetch works author ${telegramUserId}`);
  }
  return res.json();
};

const AuthorsPage = ({ onClose }: { onClose: (workId?: string) => void }) => {
  const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);
  const [safeAreaInsets, setSafeAreaInsets] = useState({
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  });
  const [authors, setAuthors] = useState<Author[] | null>(null);
  const lp = useLaunchParams();

  useEffect(() => {
    // Get authors
    getAuthors().then((authors) => {
      setAuthors(authors);
    });

    // Request initial safe area values
    postEvent("web_app_request_content_safe_area");

    // Listen for safe area changes
    const removeListener = on("content_safe_area_changed", (payload) => {
      setSafeAreaInsets({
        top: payload.top || 0,
        left: payload.left || 0,
        right: payload.right || 0,
        bottom: payload.bottom || 0,
      });
    });

    // Cleanup listener on unmount
    return () => removeListener();
  }, []);

  const pageStyle = {
    padding: `calc(${safeAreaInsets.top}px + 40px) calc(${safeAreaInsets.right}px + 40px) calc(${safeAreaInsets.bottom}px + 40px) calc(${safeAreaInsets.left}px + 40px)`,
  };

  const closeButtonStyle = {
    top: `calc(${safeAreaInsets.top}px + 20px)`,
    right: `calc(${safeAreaInsets.right}px + 20px)`,
  };

  const backButtonStyle = {
    top: `calc(${safeAreaInsets.top}px + 20px)`,
    left: `calc(${safeAreaInsets.left}px + 20px)`,
  };

  if (["android", "android_x", "ios"].includes(lp.platform)) {
    // pageStyle.top = `calc(${safeAreaInsets.top}px + 60px)`
    closeButtonStyle.top = `calc(${safeAreaInsets.top}px + 40px)`;
    backButtonStyle.top = `calc(${safeAreaInsets.top}px + 40px)`;
  }

  const handleAuthorClick = (author: Author) => {
    setSelectedAuthor(author);
  };

  const handleBack = () => {
    setSelectedAuthor(null);
  };

  if (selectedAuthor) {
    return (
      <WorksPage
        author={selectedAuthor}
        onSelect={onClose}
        onBack={handleBack}
        onClose={onClose}
        pageStyle={pageStyle}
        backButtonStyle={backButtonStyle}
        closeButtonStyle={closeButtonStyle}
      />
    );
  }

  return (
    <div className="authors-page" style={pageStyle}>
      <button
        className="close-button"
        onClick={() => onClose()}
        style={closeButtonStyle}
      >
        ×
      </button>
      <div className="authors-list">
        {authors &&
          authors.map((author, index) => (
            <div
              key={index}
              className="author-list-item"
              onClick={() => handleAuthorClick(author)}
            >
              <img
                src={author.logo}
                alt={author.name}
                className="author-list-logo"
              />
              <div className="author-list-name">{author.name}</div>
            </div>
          ))}
      </div>
    </div>
  );
};

const WorksPage = ({
  author,
  onSelect,
  onBack,
  onClose,
  pageStyle,
  closeButtonStyle,
  backButtonStyle,
}: {
  author: Author;
  onSelect: (workId: string) => void;
  onBack: () => void;
  onClose: () => void;
  pageStyle?: CSSProperties | undefined;
  closeButtonStyle?: CSSProperties | undefined;
  backButtonStyle?: CSSProperties | undefined;
}) => {
  const [works, setWorks] = useState<Work[] | null>(null);

  useEffect(() => {
    getAuthorWorks(author.telegramUserId).then((fetchedWorks) => {
      setWorks(fetchedWorks);
    });
  });

  return (
    <div className="authors-page" style={pageStyle}>
      <button
        className="close-button"
        onClick={() => onClose()}
        style={closeButtonStyle}
      >
        ×
      </button>
      <button className="back-button" onClick={onBack} style={backButtonStyle}>
        ←
      </button>
      <div className="author-header">
        <img
          src={author.logo}
          alt={author.name}
          className="author-header-logo"
        />
        <h2 className="author-header-name">{author.name}</h2>
        <a
          href={author.channel}
          className="author-channel-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          Channel →
        </a>
      </div>
      <div className="works-grid">
        {works &&
          works.map((work) => (
            <div
              key={work.id}
              className="work-card"
              onClick={() => onSelect(work.id)}
            >
              <img
                src={work.previewUrl}
                alt={work.name}
                className="work-preview"
              />
              <div className="work-info">
                <h3 className="work-name">{work.name}</h3>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default AuthorsPage;
