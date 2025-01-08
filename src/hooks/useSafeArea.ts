import { postEvent } from '@telegram-apps/sdk-react';

import { on } from '@telegram-apps/sdk-react';
import { useEffect, useState } from 'react';

export function useSafeArea() {
  const [safeAreaInsets, setSafeAreaInsets] = useState({
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
  });

  useEffect(() => {
    // Request initial safe area values
    postEvent('web_app_request_content_safe_area');

    // Listen for safe area changes
    const removeListener = on('content_safe_area_changed', (payload) => {
      setSafeAreaInsets({
        top: payload.top || 0,
        right: payload.right || 0,
        left: payload.left || 0,
        bottom: payload.bottom || 0,
      });
    });

    // Cleanup listener on unmount
    return () => removeListener();
  }, []);

  return { ...safeAreaInsets };
}
