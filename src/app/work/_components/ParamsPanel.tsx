import { useSafeArea } from '@/hooks/useSafeArea';
import { useLaunchParams } from '@telegram-apps/sdk-react';
import { LevaPanel } from 'leva';
import { LevaRootProps } from 'leva/dist/declarations/src/components/Leva/LevaRoot';

const ParamsPanel = ({ ...params }: Partial<LevaRootProps>) => {
  const lp = useLaunchParams();
  const { top, right } = useSafeArea();

  const levaPanelStyles = {
    top: `calc(${top}px + 15px)`,
    right: `calc(${right}px + 15px)`,
  };

  if (['android', 'android_x', 'ios'].includes(lp.platform)) {
    levaPanelStyles.top = `calc(${top}px + 55px)`;
  }

  return (
    <div
      style={{
        position: 'absolute',
        display: 'grid',
        width: 200,
        gap: 10,
        background: '#181C20',
        ...levaPanelStyles,
      }}
    >
      <LevaPanel {...params} />
    </div>
  );
};

export default ParamsPanel;
