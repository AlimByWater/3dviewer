'use client';

import { useEffect, useState } from 'react';
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
    throw Error(`Failed to fetch slot - ${shortCode}`);
  }
  return res.json();
};

const SlotDetailsPage = ({ params }: { params: { shortCode: string } }) => {
  const [slot, setSlot] = useState<Slot | null>();
  const [isModalOpened, setIsModalOpened] = useState<boolean | null>(null);

  useEffect(() => {
    fetchSlotByShortCode(params.shortCode).then((slot) => {
      setSlot(slot);
    });
  }, [params.shortCode]);

  return slot ? (
    <Page back={false}>
      <View slot={slot} lowQuality={isModalOpened || false} />
      <Overlay
        slot={slot}
        onSlotSelect={setSlot}
        onChangeMenuVisible={setIsModalOpened}
      />
    </Page>
  ) : (
    <div className="root__loading">
      <TriangleLoader />
    </div>
  );
};

export default SlotDetailsPage;
