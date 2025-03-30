import './MenuModalLayout.css';

import { PropsWithChildren } from 'react';
import { useLaunchParams } from '@telegram-apps/sdk-react';
import { useSafeArea } from '@/hooks/useSafeArea';

const MenuModalLayout = ({
  children,
  onBackClick,
  onCloseClick,
}: PropsWithChildren<{
  onBackClick: (() => void) | null;
  onCloseClick: () => void;
}>) => {
  const safeAreaInsets = useSafeArea();
  const lp = useLaunchParams();

  const pageStyle = {
    padding: `calc(${safeAreaInsets.top}px + 12px) calc(${safeAreaInsets.right}px + 12px) calc(${safeAreaInsets.bottom}px + 12px) calc(${safeAreaInsets.left}px + 12px)`,
  };

  const closeButtonStyle = {
    top: `calc(${safeAreaInsets.top}px + 20px)`,
    right: `calc(${safeAreaInsets.right}px + 20px)`,
  };

  const backButtonStyle = {
    top: `calc(${safeAreaInsets.top}px + 20px)`,
    left: `calc(${safeAreaInsets.left}px + 20px)`,
  };

  if (['android', 'android_x', 'ios'].includes(lp.platform)) {
    // pageStyle.top = `calc(${safeAreaInsets.top}px + 60px)`
    closeButtonStyle.top = `calc(${safeAreaInsets.top}px + 40px)`;
    backButtonStyle.top = `calc(${safeAreaInsets.top}px + 40px)`;
  }

  return (
    <div className="menu-modal-layout" style={pageStyle}>
      {/* <button
        className="close-button"
        onClick={onCloseClick}
        style={closeButtonStyle}
      >
        ×
      </button>
      {onBackClick && (
        <button
          className="back-button"
          onClick={onBackClick}
          style={backButtonStyle}
        >
          ←
        </button>
      )} */}
      {children}
    </div>
  );
};

export default MenuModalLayout;
