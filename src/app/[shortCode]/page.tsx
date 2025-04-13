'use client';

import { useCallback, useEffect, useState } from 'react';
import { Alert } from '@mantine/core';
import Overlay from './_components/overlay/Overlay';
import WorkCanvas from './_components/WorkCanvas';
import { Page } from '@/components/Page';
import { Slot } from '@/types/types';
import TriangleLoader from '@/components/TriangleLoader';
import { useViewer } from './_context/ViewerContext';
import { useRouter } from 'next/navigation';

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
  const [error, setError] = useState<string | null>(null);
  const [isModalOpened, setIsModalOpened] = useState<boolean | null>(null);
  const { state, dispatch } = useViewer();
  const router = useRouter();

  const setSlot = useCallback(
    (slot: Slot | null) => {
      dispatch({ type: 'slot_changed', slot: slot });
    },
    [dispatch],
  );

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchSlotByShortCode(params.shortCode);
        dispatch({ type: 'slot_changed', slot: data });
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

  if (!state.slot) {
    return (
      <div className="root__loading">
        <TriangleLoader />
      </div>
    );
  }

  return (
    <Page back={false}>
      <WorkCanvas slot={state.slot} lowQuality={isModalOpened || false} />
      <Overlay
        slot={state.slot}
        onSlotSelect={(s) => router.replace(`?shortCode=${s.link.short_code}`)}
        onChangeMenuVisible={setIsModalOpened}
      />
    </Page>
  );
};

export default SlotDetailsPage;
