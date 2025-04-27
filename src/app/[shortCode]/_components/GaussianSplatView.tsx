'use client';

import { Splat } from '@react-three/drei';
import { Work } from '@/types/types';
import { useViewer } from '../_context/ViewerContext';

interface GaussianSplatViewProps {
  work: Work;
}

const GaussianSplatView = ({ work }: GaussianSplatViewProps) => {
  const {
    state: { panelParams },
  } = useViewer();
  const pos = panelParams?.position;
  const scale = panelParams?.scale;

  return (
    <Splat
      src={work.link}
      position={pos && [pos.x, pos.y, pos.z]}
      scale={scale && [scale.x, scale.y, scale.z]}
    />
  );
};

export default GaussianSplatView;