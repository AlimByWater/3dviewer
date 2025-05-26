'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Overlay from './_components/overlay/Overlay';
import WorkCanvas from './_components/WorkCanvas';
import { Page } from '@/components/Page';
import { Slot } from '@/types/types';
import TriangleLoader from '@/components/TriangleLoader';
import { useViewer } from './_context/ViewerContext';
import DripNumberScene from './_components/Error404Scene';
import { fetchSlotByShortCode } from '@/core/api';
import { DotButton } from './_components/DotButton';

const SlotDetailsPage = ({ params }: { params: { shortCode: string } }) => {
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const { state, dispatch } = useViewer();

  const showDotButton = useMemo(
    () => state.slot?.link.short_code === 'dotASHTRAY',
    [state.slot?.link.short_code],
  );

  // Логирование для отладки
  useEffect(() => {
    console.log('Should show dot button:', showDotButton);
  }, [showDotButton]);

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
      <WorkCanvas slot={state.slot} lowQuality={modalVisible || false}>
        {/* Добавляем кнопку только для модели с shortCode 'dotASHTRAY' */}
        {showDotButton && !modalVisible && (
          <DotButton
            position={[5, -3, 0]} // Высоко над моделью
            targetUrl="https://www.nobody.solutions/"
            scale={2} // Увеличиваем размер для лучшей видимости
          />
        )}
      </WorkCanvas>
      <Overlay
        modalVisible={modalVisible}
        onChangeModalVisible={setModalVisible}
      />
    </Page>
  );
};

export default SlotDetailsPage;
