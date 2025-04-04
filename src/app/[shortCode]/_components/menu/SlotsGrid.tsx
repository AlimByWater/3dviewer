import { Author, Slot } from '@/types/types';
import { useGLTF } from '@react-three/drei';
import { useEffect, useState } from 'react';
import styles from './SlotsGrid.module.css';
import AuthorHeader from './AuthorHeader';
import { Card, Image, Text, useMantineTheme } from '@mantine/core';
import { addOpacityToHex } from '@/utils/addOpacityToHex';

const fetchSlots = async (telegramUserId: number): Promise<Slot[]> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/slots/by-telegram-id/${telegramUserId}`,
  );
  if (!res.ok) {
    throw Error(`Failed to fetch slots by author ${telegramUserId}`);
  }
  const allSlots = (await res.json()) as Slot[];
  const publicSlots = allSlots.filter((slot) => slot.public);
  return publicSlots;
};

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
              bg={addOpacityToHex(theme.colors.gray[8], 0.5)}
              c={theme.white}
              className={styles.workCard}
              key={slot.id}
              onClick={() => onSelect(slot)}
            >
              <Card.Section>
                <WorkPreview url={slot.previewUrl} alt={slot.work.name} />
              </Card.Section>
              <Card.Section className={styles.workInfo}>
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
  const fileExtension = url.split('.').pop()?.toLowerCase();

  if (fileExtension === 'webm') {
    return (
      <video className={styles.workPreview} autoPlay loop muted playsInline>
        <source src={url} type="video/webm" />
      </video>
    );
  }

  return <Image src={url} alt={alt} className={styles.workPreview} />;
};
