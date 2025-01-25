import './AuthorsList.css';
import { useState, useEffect, CSSProperties } from 'react';
import { useLaunchParams } from '@telegram-apps/sdk-react';
import { Author, Work } from '@/types/work';
import { useSafeArea } from '@/hooks/useSafeArea';
import { useGLTF } from '@react-three/drei';

const getAuthorWorks = async (telegramUserId: number): Promise<Work[]> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/works?telegramUserId=${telegramUserId}`,
  );
  if (!res.ok) {
    throw Error(`Failed to fetch works author ${telegramUserId}`);
  }
  return res.json();
};

type WorksByAuthor = Map<number, Work[]>;

const AuthorsList = ({
  authors,
  onClose,
}: {
  authors: Author[] | null;
  onClose: (workId?: string) => void;
}) => {
  const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);
  const [worksByAuthor, setWorksByAuthor] = useState<WorksByAuthor | null>(
    null,
  );
  const safeAreaInsets = useSafeArea();
  const lp = useLaunchParams();

  useEffect(() => {
    // Получаем работы всех авторов
    if (authors) {
      Promise.all(
        authors.map(async (author) => {
          const works = await getAuthorWorks(author.telegramUserId);
          return [author.telegramUserId, works] as [number, Work[]];
        }),
      ).then((res) => {
        setWorksByAuthor(new Map(res));
      });
    }
  }, [authors]);

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

  if (['android', 'android_x', 'ios'].includes(lp.platform)) {
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
      <WorksList
        author={selectedAuthor}
        initialWorks={
          worksByAuthor && worksByAuthor.get(selectedAuthor.telegramUserId)!
        }
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

export default AuthorsList;

const WorkPreview = ({ url, alt }: { url: string; alt: string }) => {
  // Определяем расширение файла
  const fileExtension = url.split('.').pop()?.toLowerCase();

  if (fileExtension === 'webm') {
    return (
      <video className="work-preview" autoPlay loop muted playsInline>
        <source src={url} type="video/webm" />
      </video>
    );
  }

  // Для gif и всех остальных изображений используем img
  return <img src={url} alt={alt} className="work-preview" />;
};

const WorksList = ({
  author,
  initialWorks: works,
  onSelect,
  onBack,
  onClose,
  pageStyle,
  closeButtonStyle,
  backButtonStyle,
}: {
  author: Author;
  initialWorks: Work[] | null;
  onSelect: (workId: string) => void;
  onBack: () => void;
  onClose: () => void;
  pageStyle?: CSSProperties | undefined;
  closeButtonStyle?: CSSProperties | undefined;
  backButtonStyle?: CSSProperties | undefined;
}) => {
  useEffect(() => {
    if (works) {
      for (let i = 0; i < works.length; i++) {
        useGLTF.preload(works[i].object.objectUrl);
      }
    }
  }, [works]);

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
              <WorkPreview url={work.previewUrl} alt={work.name} />
              <div className="work-info">
                <h3 className="work-name">{work.name}</h3>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
