import TriangleButton from '@/components/TriangleButton';
import { useState } from 'react';
import MenuModal from './MenuModal';
import { Slot } from '@/types/types';
import styles from './MenuButton.module.css';
import SafeArea from '@/components/SafeArea';

const MenuButton = ({
  currentSlot,
  onSlotSelect,
}: {
  currentSlot: Slot;
  onSlotSelect: (slot: Slot) => void;
}) => {
  const [visible, setVisible] = useState(false);

  const handleSlotSelect = (slot: Slot) => {
    onSlotSelect(slot);
    setVisible(false);
  };

  return (
    <div className={styles.wrapper}>
      <SafeArea>
        <TriangleButton
          onClick={() => setVisible(true)}
          color={currentSlot.work.foregroundColor}
        />
      </SafeArea>
      {visible && (
        <MenuModal
          currentSlot={currentSlot}
          onSlotSelect={handleSlotSelect}
          onCloseClick={() => setVisible(false)}
        />
      )}
    </div>
  );
};

export default MenuButton;
