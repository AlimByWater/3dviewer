'use client';

import './WorkCanvas.css';

import { Canvas } from '@react-three/fiber';
import { CameraControls, Lightformer, Environment } from '@react-three/drei';
import { getPixelRatio, isLowPerformanceDevice } from '@/utils/pixelRatio';
import { Slot } from '@/types/types';
import {
  PropsWithChildren,
  ReactNode,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import dynamic from 'next/dynamic';
import { getFileExtensionFromUrl } from '@/utils/getFileExtension';
import { SceneProgressParams } from '@/types/scene';
import ProgressIndicator from './overlay/ProgressIndicator';
import { useTweakpane } from '../_context/TweakpaneContext';
import { PerspectiveCamera } from 'three';
import AudioTrack from './overlay/AudioTrack';

const WorkInAquariumView = dynamic(() => import('./WorkInAquariumView'));
const GltfSceneView = dynamic(() => import('./GltfSceneView'));
const SplatSceneView = dynamic(() => import('./SplatSceneView')); // Import SplatSceneView

const basePath = process.env.NEXT_PUBLIC_BASE_PATH;

const WorkCanvas = ({
  slot,
  lowQuality,
  dotButtons,
  children,
}: PropsWithChildren<{
  slot: Slot;
  lowQuality: boolean;
  dotButtons?: ReactNode[];
}>) => {
  const {
    state: { params: panelParams },
    dispatch,
  } = useTweakpane();
  const [sceneProgress, setSceneProgress] = useState<SceneProgressParams>({
    active: null,
    progress: null,
  });
  const cameraRef = useRef<CameraControls | null>(null);
  const handleRef = (element: CameraControls | null) => {
    cameraRef.current = element;
    if (element) {
      // Элемент появился в DOM
      updateCamera();
    }
  };
  // Означает управляет ли юзер камерой в данный момент
  const isCameraControl = useRef(false);

  const prevSyncCameraEnabled = useRef<boolean | null>(null);

  const updateCamera = useCallback(() => {
    if (isCameraControl.current === true) return;

    const camera = cameraRef.current;
    if (camera && panelParams) {
      const prevSyncCamera = prevSyncCameraEnabled.current;
      if (!prevSyncCamera && panelParams?.syncCamera) {
        // Если переключили syncCamera на true с false, обновляем параметры
        dispatch({
          type: 'params_updated',
          params: {
            ...panelParams,
            distance: camera.distance,
            azimuthAngle: camera.azimuthAngle,
            polarAngle: camera.polarAngle,
          },
        });
      } else {
        if (camera.distance !== panelParams.distance) {
          camera.distance = panelParams.distance;
        }
        if (camera.azimuthAngle !== panelParams.azimuthAngle) {
          camera.azimuthAngle = panelParams.azimuthAngle;
        }
        if (camera.polarAngle !== panelParams.polarAngle) {
          camera.polarAngle = panelParams.polarAngle;
        }
        // Update FOV in real-time
        const origCamera = camera.camera;
        if (
          origCamera instanceof PerspectiveCamera &&
          origCamera.fov !== panelParams.fov
        ) {
          origCamera.fov = panelParams.fov;
          origCamera.updateProjectionMatrix();
        }
      }
    }

    prevSyncCameraEnabled.current = panelParams && panelParams.syncCamera;
  }, [dispatch, panelParams]);

  // Update camera when panelParams change
  useEffect(() => {
    updateCamera();
  }, [updateCamera]);

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

  const backgroundColor = panelParams?.background ?? slot.work.backgroundColor;

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <Canvas
        key={slot.id}
        dpr={getPixelRatio(lowQuality)}
        style={{
          backgroundColor: backgroundColor,
          zIndex: 0,
        }}
        shadows
        camera={{
          position: [-10, 0, 5],
          fov: panelParams?.fov ?? 70,
          near: 0.01,
          far: 10000,
        }}
        gl={{ stencil: true }}
      >
        {/* Ключ нужен для того, чтобы параметры сцены сбрасывались */}
        <Suspense key={slot.id} fallback={null}>
          <color attach="background" args={[backgroundColor]} />
          {/** Стакан аквариума или основная работа */}
          {slot.in_aquarium ? (
            <WorkInAquariumView>{renderWorkComponent()}</WorkInAquariumView> // Aquarium view might need format check too if it can contain splats
          ) : (
            renderWorkComponent() // Render based on format
          )}
          {sceneProgress.active === false && dotButtons}
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
              files={`${basePath}/hdri/${panelParams.hdri}`}
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
              onStart={() => {
                isCameraControl.current = true;
              }}
              onEnd={() => {
                isCameraControl.current = false;
              }}
              onChange={(p) => {
                if (p?.type == 'update') {
                  const camera = cameraRef.current;
                  if (camera && panelParams && panelParams.syncCamera) {
                    dispatch({
                      type: 'params_updated',
                      params: {
                        ...panelParams,
                        distance: camera.distance,
                        azimuthAngle: camera.azimuthAngle,
                        polarAngle: camera.polarAngle,
                      },
                    });
                  }
                }
              }}
            />
          )}
          {children}
        </Suspense>
      </Canvas>
      {sceneProgress.active && (
        <ProgressIndicator
          color={slot.work.foregroundColor}
          progress={sceneProgress.progress}
        />
      )}
      {sceneProgress.active == false && <AudioTrack />}
    </div>
  );
};

export default WorkCanvas;
