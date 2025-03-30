import { Work } from '@/types/types';
import { useAnimations, useGLTF } from '@react-three/drei';
import { useEffect } from 'react';

interface WorkViewProps {
  work: Work;
}

const WorkView = ({ work }: WorkViewProps) => {
  const { scene, animations } = useGLTF(work.link);
  const { actions } = useAnimations(animations, scene);

  useEffect(() => {
    // Проигрываем все анимации на сцене
    animations.forEach((item) => {
      actions[item.name]?.play();
    });
  }, [actions, animations]);

  return (
    <primitive
      object={scene}
      position={work.object.position}
      scale={work.object.scale}
    />
  );
};

export default WorkView;
