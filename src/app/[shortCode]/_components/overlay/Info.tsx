import { Fragment } from 'react';
import styles from './Info.module.css';
import { Avatar, Text } from '@mantine/core';
import SafeArea from '@/components/SafeArea';
import { useViewer } from '../../_context/ViewerContext';

const Info = () => {
  const {
    state: { slot, panelParams },
  } = useViewer();
  const fontStyle = { color: panelParams!.foreground };

  return (
    <div className={styles.footerBlock}>
      <SafeArea>
        <div className={styles.footerContent} style={fontStyle}>
          <Avatar
            src={slot!.work.authors[0].logo}
            size="md"
            className={styles.authorLogo}
          />

          <div className={styles.workInfo}>
            <Text fz="sm" fw={600}>
              {slot!.work.name}
            </Text>

            <Text fz="sm">
              {'by '}
              {slot!.work.authors.map((author, index) => (
                <Fragment key={author.telegramUserId}>
                  <a
                    href={author.channel}
                    style={{
                      ...fontStyle,
                      pointerEvents: 'auto',
                    }}
                  >
                    {author.name}
                  </a>
                  {index < slot!.work.authors.length - 1 ? ' & ' : ''}
                </Fragment>
              ))}
            </Text>
          </div>

          <Text fz="sm" c={fontStyle.color} className={styles.uploadDate}>
            {new Date(slot!.work.createdAt).toLocaleDateString([], {
              dateStyle: 'short',
            })}
          </Text>
        </div>
      </SafeArea>
    </div>
  );
};

export default Info;
