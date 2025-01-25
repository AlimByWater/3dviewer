import AuthorsList from '@/components/AuthorsList';
import TriangleButton from '@/components/TriangleButton';
import { Author, authorsMock } from '@/types/work';
import { useEffect, useState } from 'react';

const fetchAuthors = async (): Promise<Author[]> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/authors`);
  if (!res.ok) {
    throw Error('Failed to fetch authors');
  }
  return res.json();
};

const MenuButton = ({
  color,
  onSelectWork,
}: {
  color: string;
  onSelectWork: (workId: string) => void;
}) => {
  const [authors, setAuthors] = useState<Author[] | null>(authorsMock);
  const [showAuthors, setShowAuthors] = useState(false);

  useEffect(() => {
    fetchAuthors().then((authors) => {
      setAuthors(authors);
    });
  }, []);

  const onCloseAuthorsPage = (workId?: string) => {
    setShowAuthors(false);
    if (workId) {
      onSelectWork(workId);
    }
  };

  return (
    <div style={{ pointerEvents: 'auto' }}>
      <TriangleButton onClick={() => setShowAuthors(true)} color={color} />
      {showAuthors && (
        <AuthorsList authors={authors} onClose={onCloseAuthorsPage} />
      )}
    </div>
  );
};

export default MenuButton;
