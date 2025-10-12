'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Page } from '@/components/Page';
import { Slot } from '@/types/types';
import TriangleLoader from '@/components/TriangleLoader';
import { useViewer } from './_context/ViewerContext';
import * as api from '@/core/api';
import { useTweakpane } from './_context/TweakpaneContext';
import dynamic from 'next/dynamic';

const Overlay = dynamic(() => import('./_components/overlay/Overlay'));
const WorkCanvas = dynamic(() => import('./_components/WorkCanvas'));
const DotButton = dynamic(() => import('./_components/DotButton'));
const ErrorGlassScene = dynamic(() => import('./_components/ErrorGlassScene'));

interface SlotDetailsPageParams {
  shortCode: string;
}

const SlotDetailsPage = ({ params }: { params: SlotDetailsPageParams }) => {
  const [error, setError] = useState<api.ApiException | string | null>(null);
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
        if (err instanceof api.ApiException && err) {
          setError(err);
        } else {
          setError(`An unexpected error occurred: ${err}`);
        }
        setSlot(null);
      }
    };

    loadData();
  }, [params.shortCode, setSlot]);

  if (error && error instanceof api.ApiException) {
    return <ErrorGlassScene text={error.statusCode.toString()} />;
  }

  if (!slot) {
    return (
      <div className="root__loading">
        <TriangleLoader />
      </div>
    );
  }

  const backgroundColor = panelParams?.background ?? slot.work.backgroundColor;

  return (
    <Page back={false}>
      <div
        style={{
          position: 'relative',
          width: '100vw',
          height: '100vh',
          backgroundColor,
        }}
      >
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
      </div>
      <Overlay
        modalVisible={modalVisible}
        onChangeModalVisible={setModalVisible}
      />
    </Page>
  );
};

export default SlotDetailsPage;
