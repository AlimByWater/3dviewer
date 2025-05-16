import MenuModal from '../menu/MenuModal';
import { Slot } from '@/types/types';
import styles from './MenuButton.module.css';
import { useViewer } from '../../_context/ViewerContext';
import { Button } from '@mantine/core';
import { useCallback } from 'react';

const MenuButton = ({
  className,
  modalVisible,
  onChangeModalVisible,
}: {
  className?: string;
  modalVisible: boolean;
  onChangeModalVisible: (visible: boolean) => void;
}) => {
  const {
    state: { slot, panelParams },
    dispatch,
  } = useViewer();

  // useCallback фиксит рекурсию при открытии MenuModal на ios
  const onOpenClick = useCallback(
    () => onChangeModalVisible(true),
    [onChangeModalVisible],
  );
  const onCloseClick = useCallback(
    () => onChangeModalVisible(false),
    [onChangeModalVisible],
  );

  const handleSlotSelect = (slot: Slot) => {
    dispatch({ type: 'slot_changed', slot: slot });
    onChangeModalVisible(false);
  };

  return (
    <div className={className}>
      <Button
        className={styles.galleryButton}
        variant="outline"
        size="compact-sm"
        color={panelParams?.foreground}
        onClick={onOpenClick}
      >
        Gallery
      </Button>
      {modalVisible && (
        <MenuModal
          currentSlot={slot!}
          onSlotSelect={handleSlotSelect}
          onCloseClick={onCloseClick}
        />
      )}
    </div>
  );
};

export default MenuButton;
