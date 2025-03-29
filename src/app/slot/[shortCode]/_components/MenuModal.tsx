import { useState } from 'react';
import { Author, Slot } from '@/types/types';
import MenuModalLayout from './MenuModalLayout';
import SlotsGrid from './SlotsGrid';
import AuthorsList from './AuthorsList';

export type MenuMode = 'slots' | 'otherAuthors' | 'otherAuthorSlots';

const MenuModal = ({
  currentSlot,
  onSlotSelect,
  onCloseClick,
}: {
  currentSlot: Slot;
  onSlotSelect: (slot: Slot) => void;
  onCloseClick: () => void;
}) => {
  const [mode, setMode] = useState<MenuMode>('slots');
  const [otherAuthor, setOtherAuthor] = useState<Author | null>(null);

  switch (mode) {
    case 'slots':
      return (
        <AuthorSlotsModalPage
          author={currentSlot.work.authors[0]}
          onSelect={onSlotSelect}
          // onOtherAuthorsClick={() => setMode('otherAuthors')}
          onOtherAuthorsClick={null}
          onBackClick={null}
          onCloseClick={onCloseClick}
        />
      );
    case 'otherAuthors':
      return (
        <AuthorsModalPage
          onSelect={(author) => {
            setOtherAuthor(author);
            setMode('otherAuthorSlots');
          }}
          onBackClick={() => setMode('slots')}
          onCloseClick={onCloseClick}
        />
      );
    case 'otherAuthorSlots':
      return (
        <AuthorSlotsModalPage
          author={otherAuthor!}
          onSelect={onSlotSelect}
          onOtherAuthorsClick={null}
          onBackClick={() => setMode('otherAuthors')}
          onCloseClick={onCloseClick}
        />
      );
  }
};

export default MenuModal;

const AuthorSlotsModalPage = ({
  author,
  onSelect,
  onOtherAuthorsClick,
  onBackClick,
  onCloseClick,
}: {
  author: Author;
  onSelect: (slot: Slot) => void;
  onOtherAuthorsClick: (() => void) | null;
  onBackClick: (() => void) | null;
  onCloseClick: () => void;
}) => {
  return (
    <MenuModalLayout onBackClick={onBackClick} onCloseClick={onCloseClick}>
      <SlotsGrid
        author={author}
        onSelect={onSelect}
        onOtherAuthorsClick={onOtherAuthorsClick}
      />
    </MenuModalLayout>
  );
};

const AuthorsModalPage = ({
  onSelect,
  onBackClick,
  onCloseClick,
}: {
  onSelect: (author: Author) => void;
  onBackClick: () => void;
  onCloseClick: () => void;
}) => {
  return (
    <MenuModalLayout onBackClick={onBackClick} onCloseClick={onCloseClick}>
      <AuthorsList onSelect={(author) => onSelect(author)} />
    </MenuModalLayout>
  );
};
