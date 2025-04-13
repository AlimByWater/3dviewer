import TriangleButton from '@/components/TriangleButton';
import { useEffect, useState } from 'react';
import MenuModal from './MenuModal';
import { Slot } from '@/types/types';
import styles from './MenuButton.module.css';
import SafeArea from '@/components/SafeArea';
import { useViewer } from '../../_context/ViewerContext';

const MenuButton = ({
  currentSlot,
  onSlotSelect,
  onChangeMenuVisible,
}: {
  currentSlot: Slot;
  onSlotSelect: (slot: Slot) => void;
  onChangeMenuVisible?: (visible: boolean) => void;
}) => {
  const [visible, setVisible] = useState(false);
  const {
    state: { panelParams },
  } = useViewer();

  const handleSlotSelect = (slot: Slot) => {
    onSlotSelect(slot);
    setVisible(false);
  };

  useEffect(() => {
    if (onChangeMenuVisible) onChangeMenuVisible(visible);
  }, [visible, onChangeMenuVisible]);

  return (
    <div className={styles.wrapper}>
      <SafeArea>
        <TriangleButton
          onClick={() => setVisible(true)}
          color={panelParams?.foreground}
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
