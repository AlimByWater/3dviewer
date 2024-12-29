import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import {
  useMask,
  useGLTF,
  Float,
  Instances,
  MeshTransmissionMaterial,
} from "@react-three/drei";
import { Group, Object3DEventMap, Vector3 } from "three";
import WorkView from "./WorkView";
import { isLowPerformanceDevice } from "../../../utils/pixelRatio";
import { PropsWithChildren, useLayoutEffect, useRef } from "react";

interface WorkInAquariumViewProps {
  scene: Group<Object3DEventMap>;
}

const WorkInAquariumView = ({ scene }: WorkInAquariumViewProps) => {
  // Плавание
  useFrame((state) => {
    scene.rotation.z = Math.sin(state.clock.elapsedTime / 4) / 2;
  });

  return (
    <Aquarium position={new Vector3(0, 0.25, 0)}>
      <Float
        rotationIntensity={isLowPerformanceDevice() ? 1 : 2}
        floatIntensity={isLowPerformanceDevice() ? 5 : 10}
        speed={2}
      >
        <WorkView
          object={scene}
          position={[0, -0.5, -1]}
          rotation={[0, Math.PI, 0]}
          scale={1}
        />
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

const Aquarium = ({
  children,
  ...props
}: PropsWithChildren<{ position?: Vector3 | undefined }>) => {
  const ref = useRef<Group<Object3DEventMap>>(null);
  const { nodes } = useGLTF("/driptech/shapes-transformed.glb");
  const stencil = useMask(1, false);

  useLayoutEffect(() => {
    // Применяем маску ко всем дочерним объектам
    ref.current?.traverse((child) => {
      const mesh = child as THREE.Mesh;
      return mesh.material && Object.assign(mesh.material, { ...stencil });
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
