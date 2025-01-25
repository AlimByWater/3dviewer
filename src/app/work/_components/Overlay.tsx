import ProgressIndicator from './ProgressIndicator';
import { Work } from '@/types/work';
import dynamic from 'next/dynamic';
import { Fragment } from 'react';

const MenuButton = dynamic(() => import('./MenuButton'));

const Overlay = ({
  work,
  onSelectWork,
}: {
  work: Work;
  onSelectWork: (workId: string) => void;
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
      <MenuButton color={work.foregroundColor} onSelectWork={onSelectWork} />

      <div style={{ pointerEvents: 'auto' }}>
        {work.authors.map((author) => (
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
            color: work.foregroundColor,
          }}
        >
          <a style={{ color: work.foregroundColor }}>{work.name}</a>
          <br />
          <div>
            {'by '}
            {work.authors.map((author, index) => (
              <Fragment key={author.telegramUserId}>
                <a
                  href={author.channel}
                  style={{ color: work.foregroundColor }}
                >
                  {author.name}
                </a>
                {index < work.authors.length - 1 ? ' & ' : ''}
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
          color: work.foregroundColor,
        }}
      >
        {work.createdAt}
      </div>
      <ProgressIndicator color={work.foregroundColor} />
    </div>
  );
};

export default Overlay;
