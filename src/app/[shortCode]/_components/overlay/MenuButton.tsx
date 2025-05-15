import MenuModal from '../menu/MenuModal';
import { Slot } from '@/types/types';
import styles from './MenuButton.module.css';
import SafeArea from '@/components/SafeArea';
import { useViewer } from '../../_context/ViewerContext';
import { Button } from '@mantine/core';

const MenuButton = ({
  modalVisible,
  onChangeModalVisible,
}: {
  modalVisible: boolean;
  onChangeModalVisible: (visible: boolean) => void;
}) => {
  const {
    state: { slot, panelParams },
    dispatch,
  } = useViewer();

  const onOpenClick = () => onChangeModalVisible(true);
  const onCloseClick = () => onChangeModalVisible(false);

  const handleSlotSelect = (slot: Slot) => {
    dispatch({ type: 'slot_changed', slot: slot });
    onChangeModalVisible(false);
  };

  return (
    <div className={styles.wrapper}>
      <SafeArea>
        <Button
          className={styles.galleryButton}
          variant="outline"
          size="compact-sm"
          color={panelParams?.foreground}
          onClick={onOpenClick}
        >
          Gallery
        </Button>
      </SafeArea>
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
