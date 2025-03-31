import styles from './MenuModalLayout.module.css';

import { PropsWithChildren } from 'react';
import {
  useSignal,
  viewportContentSafeAreaInsets,
  viewportSafeAreaInsets,
} from '@telegram-apps/sdk-react';

const MenuModalLayout = ({
  children,
  onBackClick,
  onCloseClick,
}: PropsWithChildren<{
  onBackClick: (() => void) | null;
  onCloseClick: () => void;
}>) => {
  const safeAreaInsets = useSignal(viewportSafeAreaInsets);
  const contentSafeAreaInsets = useSignal(viewportContentSafeAreaInsets);

  return (
    <div
      className={styles.wrapper}
      style={{
        paddingTop: safeAreaInsets.top + contentSafeAreaInsets.top,
        paddingRight: safeAreaInsets.right + contentSafeAreaInsets.right + 12,
        paddingBottom:
          safeAreaInsets.bottom + contentSafeAreaInsets.bottom + 12,
        paddingLeft: safeAreaInsets.left + contentSafeAreaInsets.left + 12,
      }}
    >
      {/* <button
        onClick={onCloseClick}
      >
        ×
      </button>
      {onBackClick && (
        <button
          onClick={onBackClick}
        >
          ←
        </button>
      )} */}
      {children}
    </div>
  );
};

export default MenuModalLayout;
