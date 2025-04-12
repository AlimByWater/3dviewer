'use client';

import { useLaunchParams } from '@telegram-apps/sdk-react';
import { useSearchParams } from 'next/navigation';
import SlotDetailsPage from './[shortCode]/page';

const SlotPage = () => {
  const lp = useLaunchParams();
  const shortCode = lp.startParam;

  const searchParams = useSearchParams();

  return (
    <SlotDetailsPage
      params={{
        shortCode: shortCode || searchParams.get('shortCode') || '',
      }}
    />
  );
};

export default SlotPage;
