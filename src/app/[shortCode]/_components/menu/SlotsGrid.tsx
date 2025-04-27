import { Author, Slot } from '@/types/types';
import { useGLTF } from '@react-three/drei';
import { useEffect, useState } from 'react';
import styles from './SlotsGrid.module.css';
import AuthorHeader from './AuthorHeader';
import { Card, Image, Text, useMantineTheme } from '@mantine/core';
import Color from 'color';
import { fetchSlots } from '@/core/api';

const SlotsGrid = ({
  author,
  onSelect,
  onOtherAuthorsClick,
}: {
  author: Author;
  onSelect: (slot: Slot) => void;
  onOtherAuthorsClick: (() => void) | null;
}) => {
  const [slots, setSlots] = useState<Slot[] | null>(null);
  const theme = useMantineTheme();

  useEffect(() => {
    fetchSlots(author.telegramUserId).then((slots) => {
      setSlots(slots);
    });
  }, [author.telegramUserId]);

  useEffect(() => {
    if (slots) {
      for (let i = 0; i < slots.length; i++) {
        useGLTF.preload(slots[i].work.link);
      }
    }
  }, [slots]);

  return (
    <>
      {author && (
        <AuthorHeader
          author={author}
          onOtherAuthorsClick={onOtherAuthorsClick}
        />
      )}
      <div className={styles.worksGrid}>
        {slots &&
          slots.map((slot) => (
            <Card
              bg={Color(theme.colors.gray[7]).alpha(0.3).hexa()}
              c={theme.white}
              className={styles.workCard}
              key={slot.id}
              onClick={() => onSelect(slot)}
            >
              <Card.Section className={styles.preview}>
                <WorkPreview url={slot.previewUrl} alt={slot.work.name} />
              </Card.Section>
              <Card.Section
                bg={Color(theme.colors.gray[7]).alpha(0.3).hexa()}
                className={styles.workInfo}
              >
                <Text fz="sm" fw={500}>
                  {slot.work.name}
                </Text>
              </Card.Section>
            </Card>
          ))}
      </div>
    </>
  );
};

export default SlotsGrid;

const WorkPreview = ({ url, alt }: { url: string; alt: string }) => {
  if (!url) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          width: '100%',
        }}
      >
        <Image
          src={`${process.env.NEXT_PUBLIC_BASE_PATH}/star-placeholder-negate.png`}
          style={{
            width: 48,
            height: 48,
          }}
          alt={alt}
        />
      </div>
    );
  }

  const fileExtension = url.split('.').pop()?.toLowerCase();

  if (fileExtension === 'webm') {
    return (
      <video className={styles.previewContent} autoPlay loop muted playsInline>
        <source src={url} type="video/webm" />
      </video>
    );
  }

  return <Image src={url} alt={alt} className={styles.previewContent} />;
};
