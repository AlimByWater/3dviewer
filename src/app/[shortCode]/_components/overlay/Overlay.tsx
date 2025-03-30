import ProgressIndicator from './ProgressIndicator';
import { Slot } from '@/types/types';
import dynamic from 'next/dynamic';
import Info from './Info';

const MenuButton = dynamic(() => import('../menu/MenuButton'));

const Overlay = ({
  slot,
  onSlotSelect,
}: {
  slot: Slot;
  onSlotSelect: (slot: Slot) => void;
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
      <MenuButton currentSlot={slot} onSlotSelect={onSlotSelect} />
      <ProgressIndicator color={slot.work.foregroundColor} />
      <Info slot={slot} />
    </div>
  );
};

export default Overlay;
