import { Canvas, useFrame, extend, ReactThreeFiber } from '@react-three/fiber';
import {
  OrbitControls,
  useTexture,
  PerspectiveCamera,
  CameraControls,
} from '@react-three/drei';
import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { Font, FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

extend({ TextGeometry });

const DripNumber = () => {
  const groupRef = useRef<THREE.Group>(null);
  const textGeomRef = useRef<TextGeometry>(null);
  const textMeshRef = useRef<THREE.Mesh>(null);
  const [font, setFont] = useState<Font | null>(null);
  const noiseTexture = useTexture(
    `${process.env.NEXT_PUBLIC_BASE_PATH}/textures/rust-0.jpeg`,
    (texture) => {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(0.07, 0.07);
    },
  );

  useEffect(() => {
    const loader = new FontLoader();
    loader.load(
      'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json',
      (loadedFont) => {
        setFont(loadedFont);
      },
    );
  }, []);

  useFrame(({ clock }) => {
    // Вращение текста
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.5;
      groupRef.current.rotation.x =
        Math.sin(clock.getElapsedTime() * 0.5) * 0.1;
    }

    // Центрирование текста
    if (
      textGeomRef.current &&
      !textGeomRef.current.boundingBox &&
      textMeshRef.current
    ) {
      textGeomRef.current.computeBoundingBox();
      const boundingBox = textGeomRef.current.boundingBox!;
      const width = boundingBox.max.x - boundingBox.min.x;
      const height = boundingBox.max.y - boundingBox.min.y;
      textMeshRef.current.position.set(-0.5 * width, -0.5 * height, 0);
    }
  });

  if (!font) return null;

  return (
    <group ref={groupRef}>
      <mesh ref={textMeshRef}>
        <textGeometry
          ref={textGeomRef}
          args={[
            '404',
            {
              font: font,
              size: 10,
              depth: 2, // Толщина
              bevelEnabled: true,
              curveSegments: 3,
              bevelThickness: 0.5,
              bevelSize: 0.5,
            },
          ]}
        />
        <meshBasicMaterial map={noiseTexture} toneMapped={false} />
      </mesh>
    </group>
  );
};

const DripNumberScene = () => {
  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
      }}
    >
      <Canvas linear={true}>
        <PerspectiveCamera makeDefault position={[0, 0, 70]} fov={50} />

        <DripNumber />
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
        <CameraControls
          dollySpeed={0}
          minPolarAngle={Math.PI / 2}
          maxPolarAngle={Math.PI / 2}
          minAzimuthAngle={0}
          maxAzimuthAngle={0}
        />
      </Canvas>
    </div>
  );
};

export default DripNumberScene;

declare global {
  namespace JSX {
    interface IntrinsicElements {
      textGeometry: ReactThreeFiber.Object3DNode<
        TextGeometry,
        typeof TextGeometry
      >;
    }
  }
}
