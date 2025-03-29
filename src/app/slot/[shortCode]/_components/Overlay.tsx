import ProgressIndicator from './ProgressIndicator';
import { Slot } from '@/types/types';
import dynamic from 'next/dynamic';
import { Fragment } from 'react';

const MenuButton = dynamic(() => import('./MenuButton'));

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

      <div style={{ pointerEvents: 'auto' }}>
        {slot.work.authors.map((author) => (
          <img
            key={author.telegramUserId}
            alt={author.name}
            src={author.logo}
            style={{ position: 'absolute', bottom: 40, left: 20, width: 30 }}
          />
        ))}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            left: 55,
            fontSize: '13px',
            color: slot.work.foregroundColor,
          }}
        >
          <a style={{ color: slot.work.foregroundColor }}>{slot.work.name}</a>
          <br />
          <div>
            {'by '}
            {slot.work.authors.map((author, index) => (
              <Fragment key={author.telegramUserId}>
                <a
                  href={author.channel}
                  style={{ color: slot.work.foregroundColor }}
                >
                  {author.name}
                </a>
                {index < slot.work.authors.length - 1 ? ' & ' : ''}
              </Fragment>
            ))}
          </div>
        </div>
      </div>

      <br />
      {/*<div style={{ position: 'absolute', top: 40, left: 40 }}>ok —</div>*/}
      <div
        style={{
          position: 'absolute',
          bottom: 40,
          right: 20,
          fontSize: '13px',
          pointerEvents: 'auto',
          color: slot.work.foregroundColor,
        }}
      >
        {new Date(slot.work.createdAt).toDateString()}
      </div>
      <ProgressIndicator color={slot.work.foregroundColor} />
    </div>
  );
};

export default Overlay;
