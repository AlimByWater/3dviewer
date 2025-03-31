import { Fragment } from 'react';
import styles from './Info.module.css';
import { Slot } from '@/types/types';
import { Avatar, Text } from '@mantine/core';

const Info = ({ slot }: { slot: Slot }) => {
  const fontStyle = { color: slot.work.foregroundColor };

  return (
    <footer className={styles.footerBlock}>
      <div className={styles.footerContent} style={fontStyle}>
        <Avatar
          src={slot.work.authors[0].logo}
          size="md"
          className={styles.authorLogo}
        />

        <div className={styles.workInfo}>
          <Text fz="sm" fw={600}>
            {slot.work.name}
          </Text>

          <Text fz="sm">
            {'by '}
            {slot.work.authors.map((author, index) => (
              <Fragment key={author.telegramUserId}>
                <a
                  href={author.channel}
                  style={{
                    ...fontStyle,
                    pointerEvents: 'all',
                  }}
                >
                  {author.name}
                </a>
                {index < slot.work.authors.length - 1 ? ' & ' : ''}
              </Fragment>
            ))}
          </Text>
        </div>

        <Text fz="sm" c={fontStyle.color} className={styles.uploadDate}>
          {new Date(slot.work.createdAt).toLocaleDateString([], {
            dateStyle: 'short',
          })}
        </Text>
      </div>
    </footer>
  );
};

export default Info;
