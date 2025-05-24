import { Work } from '@/types/types';
import { useAnimations, useGLTF } from '@react-three/drei';
import { useEffect, useRef } from 'react';
import { useViewer } from '../_context/ViewerContext';
import { SceneProgressParams } from '@/types/scene';
import { DotButton } from './DotButton';
import * as THREE from 'three';

interface GltfSceneViewProps {
  work: Work;
  onProgress: (params: SceneProgressParams) => void;
  shortCode?: string;
  isGalleryOpen?: boolean;
}

const GltfSceneView = ({ work, onProgress, shortCode, isGalleryOpen }: GltfSceneViewProps) => {
  const { scene, animations } = useGLTF(
    work.link,
    undefined,
    undefined,
    (loader) => {
      loader.manager.onStart = (_, loaded, total) => {
        // console.log(_, (loaded / total) * 100);
        onProgress({ active: true, progress: (loaded / total) * 100 });
      };
      loader.manager.onProgress = (_, loaded, total) => {
        // console.log(_, (loaded / total) * 100);
        onProgress({ active: true, progress: (loaded / total) * 100 });
      };
      loader.manager.onLoad = () => {
        onProgress({ active: false, progress: null });
      };
      loader.manager.onError = (url) => {
        console.error('Error loading gltf scene:', url);
        onProgress({ active: false, progress: null });
      };
    },
  );
  const { actions } = useAnimations(animations, scene);
  const {
    state: { panelParams },
  } = useViewer();
  const pos = panelParams?.position;
  const scale = panelParams?.scale;
  const modelRef = useRef<THREE.Object3D>(null);

  useEffect(() => {
    // Проигрываем все анимации на сцене
    animations.forEach((item) => {
      actions[item.name]?.play();
    });
  }, [actions, animations]);

  // Логирование для отладки
  useEffect(() => {
    console.log('GltfSceneView - shortCode:', shortCode);
    console.log('Should show button:', shortCode === 'dotASHTRAY');
  }, [shortCode]);

  return (
    <>
      <primitive
        ref={modelRef}
        object={scene}
        position={pos && [pos.x, pos.y, pos.z]}
        scale={scale && [scale.x, scale.y, scale.z]}
      />
      
      {/* Добавляем кнопку только для модели с shortCode 'dotASHTRAY' */}
      {shortCode === 'dotASHTRAY' && (
        <DotButton
          position={[5, -3, 0]} // Высоко над моделью
          modelRef={modelRef}
          targetUrl="https://www.nobody.solutions/"
          scale={2} // Увеличиваем размер для лучшей видимости
          hidden={isGalleryOpen}
        />
      )}
    </>
  );
};

export default GltfSceneView;
