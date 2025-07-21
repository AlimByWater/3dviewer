import TriangleButton from '@/components/TriangleButton';
import styles from './LogoButton.module.css';
import SafeArea from '@/components/SafeArea';
import { useViewer } from '../../_context/ViewerContext';
import { useTweakpane } from '../../_context/TweakpaneContext';

const LogoButton = () => {
  const {
    state: { slot },
  } = useViewer();
  const {
    state: { params: panelParams },
  } = useTweakpane();

  if (!panelParams) return;

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
        <TriangleButton href={botUrl} color={panelParams.foreground} />
      </SafeArea>
    </div>
  );
};

export default LogoButton;
