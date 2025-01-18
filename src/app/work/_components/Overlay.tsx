import ProgressIndicator from './ProgressIndicator';
import AuthorsList from '@/components/AuthorsList';
import TriangleButton from '@/components/TriangleButton';
import { Author, authorsMock, Work } from '@/types/work';
import { Fragment, useEffect, useState } from 'react';

const fetchAuthors = async (): Promise<Author[]> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/authors`);
  if (!res.ok) {
    throw Error('Failed to fetch elves');
  }
  return res.json();
};

const Overlay = ({
  work,
  onSelectWork,
}: {
  work: Work;
  onSelectWork: (workId: string) => void;
}) => {
  const [authors, setAuthors] = useState<Author[] | null>(authorsMock);
  const [showAuthors, setShowAuthors] = useState(false);

  // useEffect(() => {
  //   fetchAuthors().then((authors) => {
  //     setAuthors(authors);
  //   });
  // }, []);

  const onCloseAuthorsPage = (workId?: string) => {
    setShowAuthors(false);
    if (workId) {
      onSelectWork(workId);
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    >
      <div style={{ pointerEvents: 'auto' }}>
        <TriangleButton
          onClick={() => setShowAuthors(true)}
          color={work.foregroundColor}
        />
        {showAuthors && (
          <AuthorsList authors={authors} onClose={onCloseAuthorsPage} />
        )}
      </div>

      <div style={{ pointerEvents: 'auto' }}>
        {work.authors.map((author) => (
          <img
            key={author.telegramUserId}
            alt={author.name}
            src={author.logo}
            style={{ position: 'absolute', bottom: 40, left: 20, width: 30 }}
          />
        ))}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            left: 55,
            fontSize: '13px',
            color: work.foregroundColor,
          }}
        >
          <a style={{ color: work.foregroundColor }}>{work.name}</a>
          <br />
          <div>
            {'by '}
            {work.authors.map((author, index) => (
              <Fragment key={author.telegramUserId}>
                <a
                  href={author.channel}
                  style={{ color: work.foregroundColor }}
                >
                  {author.name}
                </a>
                {index < work.authors.length - 1 ? ' & ' : ''}
              </Fragment>
            ))}
          </div>
        </div>
      </div>

      <br />
      {/*<div style={{ position: 'absolute', top: 40, left: 40 }}>ok —</div>*/}
      <div
        style={{
          position: 'absolute',
          bottom: 40,
          right: 20,
          fontSize: '13px',
          pointerEvents: 'auto',
          color: work.foregroundColor,
        }}
      >
        {work.createdAt}
      </div>
      <ProgressIndicator
        backgroundColor={work.backgroundColor}
        color={work.foregroundColor}
      />
    </div>
  );
};

export default Overlay;
