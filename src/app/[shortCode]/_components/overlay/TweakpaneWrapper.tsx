import SafeArea from '@/components/SafeArea';
import { useTweakpane } from '../../_context/TweakpaneContext';
import { useEffect } from 'react';

const TweakpaneWrapper = () => {
  const {
    state: { pane },
  } = useTweakpane();

  // Внедрение панели
  useEffect(() => {
    if (pane) {
      const wrapper = document.getElementById('tweakpane-wrapper');
      if (wrapper && !wrapper.hasChildNodes()) {
        wrapper.appendChild(pane.element);
      }
    }
  }, [pane]);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        minWidth: '300px',
        width: 'calc(100vw * 0.3)',
        maxWidth: '400px',
        padding: '16px 16px',
        pointerEvents: 'auto',
        zIndex: 100,
      }}
    >
      <SafeArea>
        <div id="tweakpane-wrapper"></div>
      </SafeArea>
    </div>
  );
};

export default TweakpaneWrapper;
