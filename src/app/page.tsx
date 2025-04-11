'use client';

import { useLaunchParams } from '@telegram-apps/sdk-react';
import { redirect } from 'next/navigation';

const SlotPage = () => {
  const lp = useLaunchParams();
  const shortCode = lp.startParam;

  redirect(`/${shortCode}`);
};

export default SlotPage;
