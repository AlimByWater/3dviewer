'use client';
import './View.css';

import { Canvas } from '@react-three/fiber';
import { CameraControls, Lightformer, Environment } from '@react-three/drei';
import { getPixelRatio, isLowPerformanceDevice } from '@/utils/pixelRatio';
import WorkView from './WorkView';
import WorkInAquariumView from './WorkInAquariumView';
import { Work } from '@/types/work';
import { Suspense } from 'react';

import { useTweakpane } from '@/hooks/useTweakpane';
import Color from 'color';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH;

const HDRIVariants = [
  `${basePath}/hdri/env-1.jpg`,
  `${basePath}/hdri/env-2.jpg`,
  `${basePath}/hdri/env-3.jpg`,
  `${basePath}/hdri/env-4.jpg`,
];

const View = ({
  work,
  isAuthorsPageOpen,
}: {
  work: Work;
  isAuthorsPageOpen: boolean;
}) => {
  const DEFAULT_PARAMS = {
    hdri: 0,
    bgColor: Color(work.backgroundColor).hex(),
  };

  const panelParams = useTweakpane(DEFAULT_PARAMS);

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <Canvas
        dpr={getPixelRatio(isAuthorsPageOpen)}
        style={{ backgroundColor: panelParams.bgColor }}
        shadows
        camera={{ position: [-10, 0, 5], fov: 70, near: 1, far: 300 }}
        gl={{ stencil: true }}
      >
        <Suspense fallback={null}>
          {/* <color attach="background" args={[work.backgroundColor]} /> */}
          {/** Стакан аквариума */}
          {work.inAquarium ? (
            <WorkInAquariumView work={work} />
          ) : (
            <WorkView work={work} />
          )}
          {/** Пользовательская среда */}
          <Environment resolution={isLowPerformanceDevice() ? 256 : 1024}>
            <group rotation={[-Math.PI / 3, 0, 0]}>
              {/* Верхний свет */}
              <Lightformer
                intensity={5}
                rotation-x={Math.PI / 2}
                position={[0, 5, -9]}
                scale={[15, 15, 1]}
              />

              {/* Круговые источники света */}
              {(isLowPerformanceDevice()
                ? [3, -3, 3, -3]
                : [3, -3, 3, -3, 3, -3, 3, -3]
              ).map((x, i) => (
                <Lightformer
                  key={i}
                  form="circle"
                  intensity={3}
                  rotation={[Math.PI / 2, 0, 0]}
                  position={[x, 4, i * 4]}
                  scale={[4, 1, 1]}
                />
              ))}

              {/* Боковое освещение */}
              <Lightformer
                intensity={3}
                rotation-y={Math.PI / 2}
                position={[-5, 2, -1]}
                scale={[50, 3, 1]}
              />
              <Lightformer
                intensity={3}
                rotation-y={-Math.PI / 2}
                position={[10, 2, 0]}
                scale={[50, 3, 1]}
              />

              {/* Фронтальный свет */}
              <Lightformer
                intensity={2}
                rotation-z={0}
                position={[0, 0, 10]}
                scale={[10, 10, 1]}
              />
            </group>
          </Environment>
          {/* HDRI карта */}
          <Environment
            backgroundIntensity={0}
            files={HDRIVariants[panelParams.hdri]}
          />
          <CameraControls
            truckSpeed={1}
            dollySpeed={1}
            minDistance={6}
            minPolarAngle={0}
            maxPolarAngle={Math.PI / 2}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default View;
