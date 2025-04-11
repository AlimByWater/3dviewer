import ProgressIndicator from './ProgressIndicator';
import { Slot } from '@/types/types';
import Info from './Info';
import MenuButton from '../menu/MenuButton';

const Overlay = ({
  slot,
  onSlotSelect,
  onChangeMenuVisible,
}: {
  slot: Slot;
  onSlotSelect: (slot: Slot) => void;
  onChangeMenuVisible?: (visible: boolean) => void;
}) => {
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
      <MenuButton
        currentSlot={slot}
        onSlotSelect={onSlotSelect}
        onChangeMenuVisible={onChangeMenuVisible}
      />
      <ProgressIndicator color={slot.work.foregroundColor} />
      <Info slot={slot} />
    </div>
  );
};

export default Overlay;
