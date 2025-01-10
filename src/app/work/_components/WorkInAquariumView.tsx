import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import {
  useMask,
  useGLTF,
  Float,
  Instances,
  MeshTransmissionMaterial,
  useAnimations,
} from '@react-three/drei';
import { isLowPerformanceDevice } from '../../../utils/pixelRatio';
import { PropsWithChildren, useEffect, useLayoutEffect, useRef } from 'react';
import { Work } from '@/types/work';

interface WorkInAquariumViewProps {
  work: Work;
}

const WorkInAquariumView = ({ work }: WorkInAquariumViewProps) => {
  return (
    <Aquarium position={new THREE.Vector3(0, 0.25, 0)}>
      <Float
        rotationIntensity={isLowPerformanceDevice() ? 1 : 2}
        floatIntensity={isLowPerformanceDevice() ? 5 : 10}
        speed={2}
      >
        <WorkView work={work} />
      </Float>
      <Instances renderOrder={-1000}>
        <sphereGeometry
          args={[
            1,
            isLowPerformanceDevice() ? 32 : 64,
            isLowPerformanceDevice() ? 32 : 64,
          ]}
        />
        <meshBasicMaterial depthTest={false} />
      </Instances>
    </Aquarium>
  );
};

export default WorkInAquariumView;

const WorkView = (props: { work: Work }) => {
  const { scene, animations } = useGLTF(props.work.object.objectUrl);
  const { actions, mixer } = useAnimations(animations, scene);
  useEffect(() => {
    mixer.timeScale = 0.5;
    // Проигрываем все анимации на сцене
    animations.forEach((item) => {
      actions[item.name]?.play();
    });
  }, [actions, animations, mixer]);
  useFrame(
    (state) => (scene.rotation.z = Math.sin(state.clock.elapsedTime / 4) / 2),
  );
  return (
    <primitive
      object={scene}
      position={[0, -0.5, -1]}
      rotation={[0, Math.PI, 0]}
      scale={props.work.object.scale}
    />
  );
};

const Aquarium = ({
  children,
  ...props
}: PropsWithChildren<{ position?: THREE.Vector3 | undefined }>) => {
  const ref = useRef<any>(null);
  const { nodes } = useGLTF(`/${process.env.BASE_PATH}/shapes-transformed.glb`);
  const stencil = useMask(1, false);

  useLayoutEffect(() => {
    // Применяем маску ко всем дочерним объектам
    // (Обрезаем все, что выходит за рамки аквариума)
    ref.current?.traverse((child: any) => {
      return child.material && Object.assign(child.material, { ...stencil });
    });
  }, [stencil]);
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        scale={[0.61 * 6, 0.8 * 6, 1 * 6]}
        geometry={(nodes.Cube as THREE.Mesh).geometry}
      >
        <MeshTransmissionMaterial
          backside
          samples={isLowPerformanceDevice() ? 2 : 4}
          thickness={3}
          chromaticAberration={isLowPerformanceDevice() ? 0.015 : 0.025}
          anisotropy={isLowPerformanceDevice() ? 0.05 : 0.1}
          distortion={isLowPerformanceDevice() ? 0.05 : 0.1}
          distortionScale={0.1}
          temporalDistortion={isLowPerformanceDevice() ? 0.1 : 0.2}
          iridescence={isLowPerformanceDevice() ? 0.5 : 1}
          iridescenceIOR={1}
          iridescenceThicknessRange={[0, isLowPerformanceDevice() ? 700 : 1400]}
        />
      </mesh>
      <group ref={ref}>{children}</group>
    </group>
  );
};
