'use client';

import './WorkCanvas.css';

import { Canvas } from '@react-three/fiber';
import { CameraControls, Lightformer, Environment } from '@react-three/drei';
import { getPixelRatio, isLowPerformanceDevice } from '@/utils/pixelRatio';
import { Slot } from '@/types/types';
import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import dynamic from 'next/dynamic';
import { useViewer } from '../_context/ViewerContext';
import { getFileExtensionFromUrl } from '@/utils/getFileExtension';
import { SceneProgressParams } from '@/types/scene';
import ProgressIndicator from './overlay/ProgressIndicator';

const WorkInAquariumView = dynamic(() => import('./WorkInAquariumView'));
const GltfSceneView = dynamic(() => import('./GltfSceneView'));
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
}: {
  slot: Slot;
  lowQuality: boolean;
}) => {
  const {
    state: { panelParams },
    dispatch,
  } = useViewer();
  const [sceneProgress, setSceneProgress] = useState<SceneProgressParams>({
    active: false,
    progress: null,
  });
  const cameraRef = useRef<CameraControls | null>(null);
  const handleRef = (element: CameraControls | null) => {
    cameraRef.current = element;
    if (element) {
      // Элемент появился в DOM
      updateParams();
    }
  };
  // Означает управляет ли юзер камерой в данный момент
  const isCameraControl = useRef(false);

  const updateParams = useCallback(() => {
    if (isCameraControl.current === true) return;

    const camera = cameraRef.current;
    if (camera && panelParams) {
      if (camera.distance !== panelParams.distance) {
        camera.distance = panelParams.distance;
      }
      if (camera.azimuthAngle !== panelParams.azimuthAngle) {
        camera.azimuthAngle = panelParams.azimuthAngle;
      }
      if (camera.polarAngle !== panelParams.polarAngle) {
        camera.polarAngle = panelParams.polarAngle;
      }
    }
  }, [panelParams]);

  useEffect(() => {
    updateParams();
  }, [updateParams]);

  // Determine which component to render based on file extension in work.link
  const renderWorkComponent = () => {
    const link = slot.work.link;
    if (!link) {
      console.warn('Work link is missing.');
      return null;
    }

    // Extract file extension, handling potential query parameters
    const extension = getFileExtensionFromUrl(link);

    if (extension === 'glb' || extension === 'gltf') {
      // Assuming WorkView/useGLTF handles its own loading indication or loads fast enough
      // If WorkView needs explicit load handling, it would require similar onLoad logic
      return <GltfSceneView work={slot.work} onProgress={setSceneProgress} />;
    } else if (extension === 'splat' || extension === 'ksplat') {
      // SplatSceneView now uses context for loading state, remove onLoad prop
      return <SplatSceneView work={slot.work} onProgress={setSceneProgress} />;
    }
    // Handle unknown format
    console.error(
      'Unknown work format based on extension:',
      extension,
      'from link:',
      link,
    );
    return null;
  };

  const hdriBackgroundProp = useMemo(() => {
    if (panelParams?.enableHdri) {
      switch (panelParams.useHdriAsBackground) {
        case 'true':
          return true; // Use HDRI for background and environment
        case 'only':
          return 'only'; // Use HDRI for environment only
        case 'false':
        default:
          return false; // No HDRI at all
      }
    }
    return false; // No HDRI if not enabled
  }, [panelParams?.enableHdri, panelParams?.useHdriAsBackground]);

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      {sceneProgress.active && (
        <ProgressIndicator
          color={slot.work.foregroundColor}
          progress={sceneProgress.progress}
        />
      )}

      <Canvas
        dpr={getPixelRatio(lowQuality)}
        style={{
          backgroundColor: panelParams!.background,
        }}
        shadows
        camera={{ position: [-10, 0, 5], fov: 70, near: 0.01, far: 300 }}
        gl={{ stencil: true }}
      >
        {/* Ключ нужен для того, чтобы параметры сцены сбрасывались */}
        <Suspense key={slot.id} fallback={null}>
          <color attach="background" args={[panelParams!.background]} />
          {/** Стакан аквариума или основная работа */}
          {slot.in_aquarium ? (
            <WorkInAquariumView>{renderWorkComponent()}</WorkInAquariumView> // Aquarium view might need format check too if it can contain splats
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
              files={`${basePath}/hdri/${panelParams!.hdri}.jpg`}
              background={hdriBackgroundProp}
            />
          )}
          {slot.in_aquarium ? (
            <CameraControls
              truckSpeed={1}
              distance={15}
              azimuthAngle={Math.PI / 2}
              polarAngle={Math.PI / 2}
            />
          ) : (
            <CameraControls
              ref={handleRef}
              truckSpeed={1}
              dollySpeed={1}
              minDistance={0.1}
              onStart={() => (isCameraControl.current = true)}
              onEnd={() => (isCameraControl.current = false)}
              onChange={(p) => {
                if (isCameraControl.current) {
                  if (p?.type == 'update') {
                    const camera = cameraRef.current;
                    if (camera && panelParams) {
                      dispatch({
                        type: 'panel_params_changed',
                        panelParams: {
                          ...panelParams,
                          distance: camera.distance,
                          azimuthAngle: camera.azimuthAngle,
                          polarAngle: camera.polarAngle,
                        },
                      });
                    }
                  }
                }
              }}
            />
          )}
        </Suspense>
      </Canvas>
    </div>
  );
};

export default WorkCanvas;
