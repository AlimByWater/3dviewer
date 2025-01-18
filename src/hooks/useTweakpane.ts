import { Color } from '@tweakpane/core';
import { useEffect, useState } from 'react';

import { Pane as Tweakpane } from 'tweakpane';

type PanelParams = {
  hdri: number;
  bgColor: string;
};

export function useTweakpane(defaultParams: PanelParams) {
  const [params, setParams] = useState<PanelParams>(defaultParams);

  useEffect(() => {
    console.log('render');
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

    return () => {
      pane.dispose();
    };
  }, []);

  return params;
}
