'use client';

import './WorkCanvas.css';

import { Canvas } from '@react-three/fiber';
import { CameraControls, Lightformer, Environment } from '@react-three/drei';
import { getPixelRatio, isLowPerformanceDevice } from '@/utils/pixelRatio';
import { Slot } from '@/types/types';
import { Suspense, useMemo } from 'react';

import dynamic from 'next/dynamic';
import { useViewer } from '../_context/ViewerContext';

const WorkInAquariumView = dynamic(() => import('./WorkInAquariumView'));
const WorkView = dynamic(() => import('./WorkView'));
const SplatSceneView = dynamic(() => import('./SplatSceneView')); // Import SplatSceneView

const basePath = process.env.NEXT_PUBLIC_BASE_PATH;

const HDRIVariants = [
  `${basePath}/hdri/env-1.jpg`,
  `${basePath}/hdri/env-2.jpg`,
  `${basePath}/hdri/env-3.jpg`,
  `${basePath}/hdri/env-4.jpg`,
];

const WorkCanvas = ({
  slot,
  lowQuality,
  onLoad, // Add onLoad prop
}: {
  slot: Slot;
  lowQuality: boolean;
  onLoad?: () => void; // Define prop type
}) => {
  const {
    state: { panelParams },
  } = useViewer();

  const useHdriAsBackground = useMemo(() => {
    switch (panelParams?.useHdriAsBackground) {
      case 'true':
        return true;
      case 'false':
        return false;
      default:
        return panelParams?.useHdriAsBackground;
    }
  }, [panelParams?.useHdriAsBackground]);

  // Determine which component to render based on file extension in work.link
  const renderWorkComponent = () => {
    const link = slot.work.link;
    if (!link) {
      console.warn('Work link is missing.');
      onLoad?.(); // Call onLoad even if link is missing to potentially hide loader
      return null;
    }

    // Extract file extension, handling potential query parameters
    const pathname = new URL(link, 'http://dummybase').pathname; // Use dummy base for relative URLs if needed
    const extension = pathname.split('.').pop()?.toLowerCase();

    if (extension === 'glb' || extension === 'gltf') {
      // Assuming WorkView/useGLTF handles its own loading indication or loads fast enough
      // If WorkView needs explicit load handling, it would require similar onLoad logic
      onLoad?.(); // Call onLoad immediately for GLB/GLTF for now
      return <WorkView work={slot.work} />;
    } else if (extension === 'splat' || extension === 'ksplat') {
      // SplatSceneView now uses context for loading state, remove onLoad prop
      return <SplatSceneView work={slot.work} />;
    }
    // Handle unknown format or provide a default
    console.warn('Unknown work format based on extension:', extension, 'from link:', link);
    // Default to WorkView or return null if preferred
    return <WorkView work={slot.work} />; // Defaulting to GLB/GLTF loader
  };

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <Canvas
        dpr={getPixelRatio(lowQuality)}
        style={{
          backgroundColor: panelParams!.background,
        }}
        shadows
        camera={{ position: [-10, 0, 5], fov: 70, near: 1, far: 300 }}
        gl={{ stencil: true }}
      >
        <Suspense fallback={null}>
          <color attach="background" args={[panelParams!.background]} />
          {/** Стакан аквариума или основная работа */}
          {slot.in_aquarium ? (
            <WorkInAquariumView work={slot.work} /> // Aquarium view might need format check too if it can contain splats
          ) : (
            renderWorkComponent() // Render based on format
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
          {panelParams?.enableHdri && (
            <Environment
              files={HDRIVariants[panelParams!.hdri]}
              background={useHdriAsBackground}
            />
          )}
          <CameraControls
            truckSpeed={1}
            dollySpeed={1}
            minDistance={1}
            distance={panelParams?.distance}
            azimuthAngle={panelParams?.azimuthAngle}
            polarAngle={panelParams?.polarAngle}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default WorkCanvas;
