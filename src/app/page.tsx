'use client';

import { useLaunchParams } from '@telegram-apps/sdk-react';
import { useSearchParams } from 'next/navigation';
import SlotDetailsPage from './[shortCode]/page';
import { ViewerProvider } from './[shortCode]/_context/ViewerContext';

const SlotPage = () => {
  const lp = useLaunchParams();
  const shortCode = lp.startParam;

  const searchParams = useSearchParams();

  return (
    <ViewerProvider>
      <SlotDetailsPage
        params={{
          shortCode: shortCode || searchParams.get('shortCode') || '',
        }}
      />
    </ViewerProvider>
  );
};

export default SlotPage;
