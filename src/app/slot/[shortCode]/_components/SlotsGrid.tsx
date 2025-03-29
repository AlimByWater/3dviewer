import { Author, Slot } from '@/types/types';
import { useGLTF } from '@react-three/drei';
import { useEffect, useState } from 'react';

const fetchSlots = async (telegramUserId: number): Promise<Slot[]> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/slots/by-telegram-id/${telegramUserId}`,
  );
  if (!res.ok) {
    throw Error(`Failed to fetch slots by author ${telegramUserId}`);
  }
  return res.json();
};

const fetchAuthor = async (authorId: number): Promise<Author> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/authors/${authorId}`,
  );
  if (!res.ok) {
    throw Error(`Failed to fetch author ${authorId}`);
  }
  return res.json();
};

const SlotsGrid = ({
  author,
  onSelect,
  onOtherAuthorsClick,
}: {
  author: Author;
  onSelect: (slot: Slot) => void;
  onOtherAuthorsClick: (() => void) | null;
}) => {
  const [slots, setSlots] = useState<Slot[] | null>(null);

  useEffect(() => {
    fetchSlots(author.telegramUserId).then((slots) => {
      setSlots(slots);
    });
  }, [author.telegramUserId]);

  useEffect(() => {
    if (slots) {
      for (let i = 0; i < slots.length; i++) {
        useGLTF.preload(slots[i].work.link);
      }
    }
  }, [slots]);

  return (
    <>
      {author && (
        <div className="author-header">
          <img
            src={author.logo}
            alt={author.name}
            className="author-header-logo"
          />
          <h2 className="author-header-name">{author.name}</h2>
          <div className="author-header-actions">
            <a
              href={author.channel}
              className="author-channel-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              Channel →
            </a>
            {onOtherAuthorsClick && (
              <button
                onClick={onOtherAuthorsClick}
                className="other-authors-button"
              >
                Другие авторы
              </button>
            )}
          </div>
        </div>
      )}
      <div className="works-grid">
        {slots &&
          slots.map((slot) => (
            <div
              key={slot.id}
              className="work-card"
              onClick={() => onSelect(slot)}
            >
              <WorkPreview url={slot.work.previewUrl} alt={slot.work.name} />
              <div className="work-info">
                <h3 className="work-name">{slot.work.name}</h3>
              </div>
            </div>
          ))}
      </div>
    </>
  );
};

export default SlotsGrid;

const WorkPreview = ({ url, alt }: { url: string; alt: string }) => {
  const fileExtension = url.split('.').pop()?.toLowerCase();

  if (fileExtension === 'webm') {
    return (
      <video className="work-preview" autoPlay loop muted playsInline>
        <source src={url} type="video/webm" />
      </video>
    );
  }

  return <img src={url} alt={alt} className="work-preview" />;
};
