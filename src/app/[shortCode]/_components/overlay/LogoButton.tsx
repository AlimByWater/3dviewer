import TriangleButton from '@/components/TriangleButton';
import styles from './LogoButton.module.css';
import SafeArea from '@/components/SafeArea';
import { useViewer } from '../../_context/ViewerContext';
import { useLaunchParams } from '@telegram-apps/sdk-react';

const LogoButton = () => {
  const {
    state: { panelParams, slot },
  } = useViewer();
  const lp = useLaunchParams();

  const userId = slot?.author_id;
  const slotId = slot?.id;

  let botUrl = process.env.NEXT_PUBLIC_BOT_URL;
  if (userId) {
    botUrl += `?start=ref_${userId}`;
    if (slotId) {
      botUrl += `_${slotId}`;
    }
  }

  return (
    <div className={styles.wrapper}>
      <SafeArea>
        <TriangleButton
          href={botUrl}
          color={panelParams?.foreground}
        />
      </SafeArea>
    </div>
  );
};

export default LogoButton;