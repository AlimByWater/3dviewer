import { Work } from '@/types/types';
import { useAnimations, useGLTF } from '@react-three/drei';
import { useEffect } from 'react';
import { useViewer } from '../_context/ViewerContext';

interface WorkViewProps {
  work: Work;
}

const WorkView = ({ work }: WorkViewProps) => {
  const { scene, animations } = useGLTF(work.link);
  const { actions } = useAnimations(animations, scene);
  const {
    state: { panelParams },
  } = useViewer();
  const pos = panelParams?.position;
  const scale = panelParams?.scale;

  useEffect(() => {
    // Проигрываем все анимации на сцене
    animations.forEach((item) => {
      actions[item.name]?.play();
    });
  }, [actions, animations]);

  return (
    <primitive
      object={scene}
      position={pos && [pos.x, pos.y, pos.z]}
      scale={scale && [scale.x, scale.y, scale.z]}
    />
  );
};

export default WorkView;
