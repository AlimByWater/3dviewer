'use client';

import { useLaunchParams } from '@telegram-apps/sdk-react';
import { useSearchParams } from 'next/navigation'; // Re-add this
import SlotDetailsPage from './[shortCode]/page';
import { ViewerProvider } from './[shortCode]/_context/ViewerContext';

const SlotPage = () => {
  const lp = useLaunchParams();
  const searchParams = useSearchParams(); // Re-add this

  let finalShortCode: string;
  if (lp.startParam) {
    finalShortCode = lp.startParam;
  } else {
    const queryShortCode = searchParams.get('shortCode');
    if (queryShortCode) {
      finalShortCode = queryShortCode;
    } else {
      finalShortCode = '404';
    }
  }

  return (
    <ViewerProvider>
      <SlotDetailsPage
        params={{
          shortCode: finalShortCode,
        }}
      />
    </ViewerProvider>
  );
};

export default SlotPage;
