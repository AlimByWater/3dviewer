import { useLaunchParams } from '@telegram-apps/sdk-react';
import { useEffect, useState } from 'react';

import { Pane as Tweakpane } from 'tweakpane';
import { useSafeArea } from './useSafeArea';

type PanelParams = {
  hdri: number;
  bgColor: string;
};

export function useTweakpane(defaultParams: PanelParams) {
  const lp = useLaunchParams();
  const { top, right } = useSafeArea();

  const [params, setParams] = useState<PanelParams>(defaultParams);

  useEffect(() => {
    const pane = new Tweakpane({
      title: 'Model parameters',
      expanded: true,
    });

    const hdri = pane.addBinding(defaultParams, 'hdri', {
      min: 0,
      max: 3,
      step: 1,
    });
    const bgColor = pane.addBinding(defaultParams, 'bgColor');

    hdri.on('change', (event) =>
      setParams((prevParams) => ({ ...prevParams, hdri: event.value })),
    );
    bgColor.on('change', (event) =>
      setParams((prevParams) => ({ ...prevParams, bgColor: event.value })),
    );

    // For correct position in mobile
    pane.element.style.position = 'relative';
    pane.element.style.top = `calc(${top}px + 15px)`;
    pane.element.style.right = `calc(${right}px + 15px)`;

    if (['android', 'android_x', 'ios'].includes(lp.platform)) {
      pane.element.style.top = `calc(${top}px + 92px)`;
    }

    return () => {
      pane.dispose();
    };
  }, []);

  return params;
}
