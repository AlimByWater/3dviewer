import { backButton } from '@telegram-apps/sdk-react';
import { PropsWithChildren, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function Page({
  children,
  back = true,
}: PropsWithChildren<{
  /**
   * True if it is allowed to go back from this page.
   * @default true
   */
  back?: boolean;
}>) {
  const navigate = useNavigate();

  useEffect(() => {
    if (back) {
      backButton.show();
    } else {
      backButton.hide();
    }
  }, [back]);

  useEffect(() => {
    return backButton.onClick(() => {
      navigate(-1);
    });
  }, [navigate]);

  return <>{children}</>;
}
