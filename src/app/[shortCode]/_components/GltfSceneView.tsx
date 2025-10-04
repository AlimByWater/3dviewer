import { Work } from '@/types/types';
import { useAnimations, useGLTF } from '@react-three/drei';
import { useEffect } from 'react';
import { SceneProgressParams } from '@/types/scene';
import * as THREE from 'three';
import { useTweakpane } from '../_context/TweakpaneContext';

interface GltfSceneViewProps {
  work: Work;
  onProgress: (params: SceneProgressParams) => void;
}

const GltfSceneView = ({ work, onProgress }: GltfSceneViewProps) => {
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
    state: { params: panelParams },
  } = useTweakpane();
  const pos = panelParams?.position;
  const scale = panelParams?.scale;
  const rotation = panelParams?.rotation;

  useEffect(() => {
    // Проигрываем все анимации на сцене
    animations.forEach((item) => {
      actions[item.name]?.play();
    });
  }, [actions, animations]);

  return (
    <>
      <primitive
        object={scene}
        position={pos && [pos.x, pos.y, pos.z]}
        scale={scale && [scale.x, scale.y, scale.z]}
        rotation={
          rotation && new THREE.Euler(rotation.x, rotation.y, rotation.z)
        }
      />
    </>
  );
};

export default GltfSceneView;
