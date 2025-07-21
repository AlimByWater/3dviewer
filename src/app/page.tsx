'use client';

import { useLaunchParams } from '@telegram-apps/sdk-react';
import { useSearchParams } from 'next/navigation'; // Re-add this
import SlotDetailsPage from './[shortCode]/page';
import { ViewerProvider } from './[shortCode]/_context/ViewerContext';
import { TweakpaneProvider } from './[shortCode]/_context/TweakpaneContext';

const SlotPage = () => {
  const lp = useLaunchParams();
  const searchParams = useSearchParams(); // Re-add this

  const queryShortCode = searchParams.get('shortCode');
  const finalShortCode = queryShortCode ?? lp.startParam ?? '404';

  return (
    <ViewerProvider>
      <TweakpaneProvider>
        <SlotDetailsPage
          params={{
            shortCode: finalShortCode,
          }}
        />
      </TweakpaneProvider>
    </ViewerProvider>
  );
};

export default SlotPage;
