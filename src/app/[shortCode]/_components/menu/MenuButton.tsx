import TriangleButton from '@/components/TriangleButton';
import { useState } from 'react';
import MenuModal from './MenuModal';
import { Slot } from '@/types/types';

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
    <div style={{ pointerEvents: 'auto' }}>
      <TriangleButton
        onClick={() => setVisible(true)}
        color={currentSlot.work.foregroundColor}
      />
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
