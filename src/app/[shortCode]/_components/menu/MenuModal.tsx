import { useEffect, useState } from 'react';
import { Author, Slot } from '@/types/types';
import MenuModalLayout from './MenuModalLayout';
import SlotsGrid from './SlotsGrid';
import AuthorsList from './AuthorsList';
import { backButton } from '@telegram-apps/sdk-react';

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

  useEffect(() => {
    const handleBack = () => {
      onCloseClick();
    };

    backButton.show();
    backButton.onClick(handleBack);
    window.addEventListener('popstate', handleBack);

    return () => {
      backButton.hide();
      backButton.offClick(handleBack);
      window.removeEventListener('popstate', handleBack);
    };
  }, []);

  switch (mode) {
    case 'slots':
      return (
        <MenuModalLayout onBackClick={null} onCloseClick={onCloseClick}>
          <SlotsGrid
            author={currentSlot.work.authors[0]}
            onSelect={onSlotSelect}
            onOtherAuthorsClick={null}
            // onOtherAuthorsClick={() => setMode('otherAuthors')}
          />
        </MenuModalLayout>
      );
    case 'otherAuthors':
      return (
        <MenuModalLayout
          onBackClick={() => setMode('slots')}
          onCloseClick={onCloseClick}
        >
          <AuthorsList
            onSelect={(author) => {
              setOtherAuthor(author);
              setMode('otherAuthorSlots');
            }}
          />
        </MenuModalLayout>
      );
    case 'otherAuthorSlots':
      return (
        <MenuModalLayout
          onBackClick={() => setMode('otherAuthors')}
          onCloseClick={onCloseClick}
        >
          <SlotsGrid
            author={otherAuthor!}
            onSelect={onSlotSelect}
            onOtherAuthorsClick={null}
          />
        </MenuModalLayout>
      );
  }
};

export default MenuModal;
