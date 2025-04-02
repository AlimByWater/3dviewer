import { PropsWithChildren, useEffect } from 'react';
import {
  postEvent,
  useSignal,
  viewportContentSafeAreaInsets,
  viewportSafeAreaInsets,
} from '@telegram-apps/sdk-react';

const SafeArea = ({ children }: PropsWithChildren) => {
  const safeAreaInsets = useSignal(viewportSafeAreaInsets);
  const contentSafeAreaInsets = useSignal(viewportContentSafeAreaInsets);

  useEffect(() => {
    postEvent('web_app_request_safe_area');
    postEvent('web_app_request_content_safe_area');
  }, []);

  return (
    <div
      style={{
        marginTop: safeAreaInsets.top + contentSafeAreaInsets.top,
        marginRight: safeAreaInsets.right + contentSafeAreaInsets.right,
        marginBottom: safeAreaInsets.bottom + contentSafeAreaInsets.bottom,
        marginLeft: safeAreaInsets.left + contentSafeAreaInsets.left,
      }}
    >
      {children}
    </div>
  );
};

export default SafeArea;
