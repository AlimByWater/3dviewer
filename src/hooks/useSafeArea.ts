import {
  postEvent,
  useSignal,
  viewportContentSafeAreaInsets,
  viewportSafeAreaInsets,
} from '@telegram-apps/sdk-react';

import { useEffect } from 'react';

export function useSafeArea() {
  const safeAreaInsets = useSignal(viewportSafeAreaInsets);
  const contentSafeAreaInsets = useSignal(viewportContentSafeAreaInsets);

  useEffect(() => {
    postEvent('web_app_request_safe_area');
    postEvent('web_app_request_content_safe_area');
  }, []);

  return {
    top: safeAreaInsets.top + contentSafeAreaInsets.top,
    right: safeAreaInsets.right + contentSafeAreaInsets.right,
    bottom: safeAreaInsets.bottom + contentSafeAreaInsets.bottom,
    left: safeAreaInsets.left + contentSafeAreaInsets.left,
  };
}
