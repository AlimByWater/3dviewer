'use client';

import { Work } from '@/types/types';
import { DropInViewer } from '@mkkellogg/gaussian-splats-3d';
import { useEffect, useRef } from 'react';
import { useViewer } from '../_context/ViewerContext';
import { SceneProgressParams } from '@/types/scene';

interface SplatSceneViewProps {
  work: Work;
  onProgress: (params: SceneProgressParams) => void;
}

const SplatSceneView = ({ work, onProgress }: SplatSceneViewProps) => {
  // Removed onLoad from props
  const viewerRef = useRef<DropInViewer | null>(null);
  const {
    state: { panelParams },
  } = useViewer();
  const pos = panelParams?.position;
  const scale = panelParams?.scale;

  useEffect(() => {
    onProgress({ active: true, progress: null });
    // Initialize the viewer
    const viewer = new DropInViewer({
      selfDrivenMode: false, // We'll drive updates via useFrame
      // Disable features requiring SharedArrayBuffer as COEP is removed
      gpuAcceleratedSort: false,
      sharedMemoryForWorkers: false,
      // Consider adding other relevant options from panelParams if needed
    });
    viewerRef.current = viewer;
    // Apply rotation to fix potential vertical flip
    viewer.rotation.x = Math.PI;

    // Load the splat scene
    viewer
      .addSplatScene(work.link, {
        // Optional: Add scene-specific params like splatAlphaRemovalThreshold if needed
        // splatAlphaRemovalThreshold: 5,
        showLoadingUI: false, // Assuming loading is handled elsewhere
        progressiveLoad: true,
      })
      .then(() => {
        onProgress({ active: false, progress: null });
        console.log('Splat scene loaded:', work.link);
      })
      .catch((err: Error) => {
        // Specify Error type for err
        console.error('Error loading splat scene:', err);
        onProgress({ active: false, progress: null });
      });

    // Cleanup on unmount
    return () => {
      viewerRef.current?.dispose();
      viewerRef.current = null;
    };
  }, [work.link, onProgress]); // Add dispatch to dependency array

  // Return the viewer object to be added to the R3F scene
  // Need to cast because the ref type includes null
  return viewerRef.current ? (
    <primitive
      object={viewerRef.current}
      position={pos && [pos.x, pos.y, pos.z]}
      scale={scale && [scale.x, scale.y, scale.z]}
    />
  ) : null;
};

export default SplatSceneView;
