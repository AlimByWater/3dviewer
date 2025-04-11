'use client';

import { useEffect, useState } from 'react';
import { Alert } from '@mantine/core';
import Overlay from './_components/overlay/Overlay';
import View from './_components/View';
import { Page } from '@/components/Page';
import { Slot } from '@/types/types';
import TriangleLoader from '@/components/TriangleLoader';

const fetchSlotByShortCode = async (shortCode: string): Promise<Slot> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/slots/by-link/${shortCode}`,
  );

  if (!res.ok) {
    let errorMessage = `Failed to fetch slot - ${shortCode}`;
    try {
      const errorData = await res.json();
      errorMessage = errorData.message || errorMessage;
    } catch (e) {
      // Не удалось распарсить JSON ответ
    }
    throw new Error(errorMessage);
  }
  return res.json();
};

const SlotDetailsPage = ({ params }: { params: { shortCode: string } }) => {
  const [slot, setSlot] = useState<Slot | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpened, setIsModalOpened] = useState<boolean | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchSlotByShortCode(params.shortCode);
        setSlot(data);
        setError(null);
      } catch (err) {
        if (err instanceof Error && err) {
          setError(err.message);
        } else {
          setError('An unexpected error occurred');
        }
        setSlot(null);
      }
    };

    loadData();
  }, [params.shortCode, setSlot]);

  if (error) {
    return (
      <div className="root__loading">
        <Alert
          // icon={<IconAlertCircle size="1rem"/>}
          title="Error!"
          color="red"
          variant="filled"
          maw={500}
          mx="auto"
        >
          {error}
        </Alert>
      </div>
    );
  }

  if (!slot) {
    return (
      <div className="root__loading">
        <TriangleLoader />
      </div>
    );
  }

  return (
    <Page back={false}>
      <View slot={slot} lowQuality={isModalOpened || false} />
      <Overlay
        slot={slot}
        onSlotSelect={setSlot}
        onChangeMenuVisible={setIsModalOpened}
      />
    </Page>
  );
};

export default SlotDetailsPage;
