import { PropsWithChildren } from 'react';
import {
  useSignal,
  viewportContentSafeAreaInsets,
  viewportSafeAreaInsets,
} from '@telegram-apps/sdk-react';

const SafeArea = ({ children }: PropsWithChildren) => {
  const safeAreaInsets = useSignal(viewportSafeAreaInsets);
  const contentSafeAreaInsets = useSignal(viewportContentSafeAreaInsets);

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
