import './View.css';

import { Canvas } from '@react-three/fiber';
import { CameraControls, Lightformer, Environment } from '@react-three/drei';
import { getPixelRatio, isLowPerformanceDevice } from '@/utils/pixelRatio';
import WorkView from './WorkView';
import WorkInAquariumView from './WorkInAquariumView';
import { Work } from '@/types/work';
import { Suspense } from 'react';

// import { Leva, LevaPanel, useControls, useCreateStore } from 'leva';
import { useLaunchParams } from '@telegram-apps/sdk-react';
import { useSafeArea } from '@/hooks/useSafeArea';

const HDRIVariants = [
  '/driptech/hdri/env-1.jpg',
  '/driptech/hdri/env-2.jpg',
  '/driptech/hdri/env-3.jpg',
  '/driptech/hdri/env-4.jpg',
];

const View = ({
  work,
  isAuthorsPageOpen,
}: {
  work: Work;
  isAuthorsPageOpen: boolean;
}) => {
  const lp = useLaunchParams();
  // const hdriStore = useCreateStore();

  // const { hdri } = useControls(
  //   {
  //     hdri: {
  //       value: 0,
  //       min: 0,
  //       max: HDRIVariants.length - 1,
  //       step: 1,
  //     },
  //   },
  //   { store: hdriStore }
  // );

  const { top, right } = useSafeArea();

  const levaPanelStyles = {
    top: `calc(${top}px + 15px)`,
    right: `calc(${right}px + 15px)`,
  };

  if (['android', 'android_x', 'ios'].includes(lp.platform)) {
    levaPanelStyles.top = `calc(${top}px + 55px)`;
  }

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <Canvas
        dpr={getPixelRatio(isAuthorsPageOpen)}
        style={{ backgroundColor: work.backgroundColor }}
        shadows
        camera={{ position: [-10, 0, 5], fov: 70, near: 1, far: 300 }}
        gl={{ stencil: true }}
      >
        <Suspense fallback={null}>
          <color attach="background" args={[work.backgroundColor]} />
          {/** Стакан аквариума */}
          {work.inAquarium ? (
            <WorkInAquariumView work={work} />
          ) : (
            <WorkView work={work} />
          )}
          {/** Мягкие тени */}
          {/*<AccumulativeShadows*/}
          {/*  temporal*/}
          {/*  frames={isLowPerformanceDevice() ? 30 : 100}*/}
          {/*  color="lightblue"*/}
          {/*  colorBlend={2}*/}
          {/*  opacity={0.5}*/}
          {/*  scale={80}*/}
          {/*  position={[0, -5, 0]}*/}
          {/*>*/}
          {/*  <RandomizedLight*/}
          {/*    amount={isLowPerformanceDevice() ? 4 : 8}*/}
          {/*    radius={20}*/}
          {/*    ambient={0.7}*/}
          {/*    intensity={1.5}*/}
          {/*    position={[0, 15, -5]}*/}
          {/*    size={25}*/}
          {/*  />*/}
          {/*</AccumulativeShadows>*/}
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

              {/* Добавляем фронтальный свет */}
              <Lightformer
                intensity={2}
                rotation-z={0}
                position={[0, 0, 10]}
                scale={[10, 10, 1]}
              />
            </group>
          </Environment>
          <Environment
            backgroundIntensity={0}
            files={HDRIVariants[1]}
            background
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

      {/* <div
        style={{
          position: 'absolute',
          display: 'grid',
          width: 250,
          gap: 10,
          overflow: 'auto',
          background: '#181C20',
          borderRadius: '8px',
          ...levaPanelStyles,
        }}
      >
        <LevaPanel fill flat titleBar={false} store={hdriStore} />
      </div> */}
    </div>
  );
};

export default View;
