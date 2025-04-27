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
import DripNumberScene from './_components/Error404Scene';
import { fetchSlotByShortCode } from '@/core/api';

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
    return <DripNumberScene />;
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
        onSlotSelect={(s) => {
          // Обновляем контекст напрямую
          dispatch({ type: 'slot_changed', slot: s });
          // Не меняем URL здесь, чтобы избежать повторной загрузки
        }}
        onChangeMenuVisible={setIsModalOpened}
      />
    </Page>
  );
};

export default SlotDetailsPage;
