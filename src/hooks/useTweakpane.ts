import { useEffect, useState } from 'react';

import { Pane as Tweakpane } from 'tweakpane';

type PanelParams = {
  hdri: number;
};

export function useTweakpane(defaultParams: PanelParams) {
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

    hdri.on('change', (event) =>
      setParams((prevParams) => ({ ...prevParams, hdri: event.value })),
    );

    return () => {
      pane.dispose();
    };
  }, [defaultParams]);

  return params;
}
