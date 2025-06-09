'use client';

import { useCallback, useEffect, useState } from 'react';
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
  const [sceneLoaded, setSceneLoaded] = useState(false);

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

  const renderDotButton = useCallback(() => {
    if (modalVisible || !sceneLoaded) return;

    const shortCode = state.slot?.link.short_code;

    if (shortCode == 'dotASHTRAY') {
      return (
        <DotButton
          position={[5, -3, 0]}
          targetUrl="https://www.nobody.solutions/"
          scale={2}
        />
      );
    }

    if (shortCode == 'pension-wealthinesss') {
      return (
        <DotButton
          position={[-0.65, -1.30, 0.15]}
          targetUrl="https://jobs.gleb.solutions"
          scale={0.25}
        />
      );
    }

    if (shortCode == 'leftys-lubrication') {
      return (
        <DotButton
          position={[-4, 0.1, 0]}
          targetUrl="https://jobs.gleb.solutions"
          scale={1}
        />
      );
    }
  }, [sceneLoaded, modalVisible, state.slot?.link.short_code]);

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
      <WorkCanvas
        slot={state.slot}
        lowQuality={modalVisible || false}
        onProgress={(progress) => setSceneLoaded(progress.active === false)}
      >
        {renderDotButton()}
      </WorkCanvas>
      <Overlay
        modalVisible={modalVisible}
        onChangeModalVisible={setModalVisible}
      />
    </Page>
  );
};

export default SlotDetailsPage;
