import { useSafeArea } from '@/hooks/useSafeArea';
import { useLaunchParams } from '@telegram-apps/sdk-react';

const ParamsPanel = () => {
  const lp = useLaunchParams();
  const { top, right } = useSafeArea();

  const panelStyles = {
    top: `calc(${top}px + 15px)`,
    right: `calc(${right}px + 15px)`,
  };

  if (['android', 'android_x', 'ios'].includes(lp.platform)) {
    panelStyles.top = `calc(${top}px + 55px)`;
  }

  return (
    <div
      style={{
        position: 'absolute',
        display: 'grid',
        width: 200,
        gap: 10,
        background: '#181C20',
        ...panelStyles,
      }}
    >
      <div id="tweakpane-container"></div>
    </div>
  );
};

export default ParamsPanel;
