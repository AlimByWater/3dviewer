import styles from './MenuModalLayout.module.css';

import { PropsWithChildren } from 'react';
import SafeArea from '@/components/SafeArea';
import { addOpacityToHex } from '@/utils/addOpacityToHex';
import { useMantineTheme } from '@mantine/core';

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
        backgroundColor: addOpacityToHex(theme.colors.gray[9], 0.5),
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
