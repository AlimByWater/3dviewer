import styles from './MenuModalLayout.module.css';

import { PropsWithChildren } from 'react';
import SafeArea from '@/components/SafeArea';
import { useMantineTheme } from '@mantine/core';
import Color from 'color';

const MenuModalLayout = ({
  children,
  onBackClick,
  onCloseClick,
}: PropsWithChildren<{
  onBackClick: (() => void) | null;
  onCloseClick: () => void;
}>) => {
  const theme = useMantineTheme();

  return (
    <div
      className={styles.wrapper}
      style={{
        backgroundColor: Color(theme.colors.gray[9]).alpha(0.5).hexa(),
        color: theme.white,
      }}
    >
      <SafeArea>
        {/* <button onClick={onCloseClick}>×</button>
        {onBackClick && <button onClick={onBackClick}>←</button>} */}
        {children}
      </SafeArea>
    </div>
  );
};

export default MenuModalLayout;
