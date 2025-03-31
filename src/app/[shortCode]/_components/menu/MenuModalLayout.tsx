import styles from './MenuModalLayout.module.css';

import { PropsWithChildren } from 'react';
import SafeArea from '@/components/SafeArea';

const MenuModalLayout = ({
  children,
  onBackClick,
  onCloseClick,
}: PropsWithChildren<{
  onBackClick: (() => void) | null;
  onCloseClick: () => void;
}>) => {
  return (
    <div className={styles.wrapper}>
      <SafeArea>
        {/* <button onClick={onCloseClick}>×</button>
        {onBackClick && <button onClick={onBackClick}>←</button>} */}
        {children}
      </SafeArea>
    </div>
  );
};

export default MenuModalLayout;
