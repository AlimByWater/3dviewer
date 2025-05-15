import TriangleButton from '@/components/TriangleButton';
import styles from './LogoButton.module.css';
import SafeArea from '@/components/SafeArea';
import { useViewer } from '../../_context/ViewerContext';

const LogoButton = () => {
  const {
    state: { panelParams },
  } = useViewer();

  return (
    <div className={styles.wrapper}>
      <SafeArea>
        <TriangleButton
          href={process.env.NEXT_PUBLIC_BOT_URL}
          color={panelParams?.foreground}
        />
      </SafeArea>
    </div>
  );
};

export default LogoButton;
