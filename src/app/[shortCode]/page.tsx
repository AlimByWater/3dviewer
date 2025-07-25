'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Overlay from './_components/overlay/Overlay';
import WorkCanvas from './_components/WorkCanvas';
import { Page } from '@/components/Page';
import { Slot } from '@/types/types';
import TriangleLoader from '@/components/TriangleLoader';
import { useViewer } from './_context/ViewerContext';
import DripNumberScene from './_components/Error404Scene';
import * as api from '@/core/api';
import { DotButton } from './_components/DotButton';
import { useTweakpane } from './_context/TweakpaneContext';

interface SlotDetailsPageParams {
  shortCode: string;
}

const SlotDetailsPage = ({ params }: { params: SlotDetailsPageParams }) => {
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const {
    state: { slot },
    dispatch,
  } = useViewer();
  const {
    state: { params: panelParams },
  } = useTweakpane();

  const dotButtonParams = panelParams?.extra.dotButtons;

  const setSlot = useCallback(
    (slot: Slot | null) => {
      dispatch({ type: 'slot_changed', slot: slot });
    },
    [dispatch],
  );

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log(`Fetching slot from shortCode: ${params.shortCode}`);
        const data = await api.fetchSlotByShortCode(params.shortCode);
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

  if (!slot) {
    return (
      <div className="root__loading">
        <TriangleLoader />
      </div>
    );
  }

  return (
    <Page back={false}>
      <WorkCanvas
        slot={slot}
        lowQuality={modalVisible || false}
        dotButtons={
          dotButtonParams
            ? dotButtonParams.map((params) => {
                const pos = params.position;
                return (
                  <DotButton
                    key={params.id}
                    position={[pos.x, pos.y, pos.z]}
                    targetUrl={params.link}
                    svgIcon={params.svgIcon}
                    scale={params.scale}
                  />
                );
              })
            : undefined
        }
      ></WorkCanvas>
      <Overlay
        modalVisible={modalVisible}
        onChangeModalVisible={setModalVisible}
      />
    </Page>
  );
};

export default SlotDetailsPage;
