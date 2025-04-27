'use client';

import { Work } from '@/types/types';
import { DropInViewer } from '@mkkellogg/gaussian-splats-3d';
import { useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useViewer } from '../_context/ViewerContext';

interface SplatSceneViewProps {
  work: Work;
  // onLoad prop is removed as we now use context for loading state
}

const SplatSceneView = ({ work }: SplatSceneViewProps) => { // Removed onLoad from props
  const viewerRef = useRef<DropInViewer | null>(null);
  const {
    state: { panelParams },
    dispatch, // Get dispatch from context
  } = useViewer();
  const pos = panelParams?.position;
  const scale = panelParams?.scale;

  useEffect(() => {
    dispatch({ type: 'asset_loading', assetType: 'splat' }); // Dispatch asset loading start
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
      })
      .then(() => {
        console.log('Splat scene loaded:', work.link);
        // Apply initial transform from panelParams once loaded
        // Note: Position/Scale are applied relative to the rotated viewer object
        if (viewerRef.current) { // Check ref before accessing
            if (pos) {
              viewerRef.current.position.set(pos.x, pos.y, pos.z);
            }
            if (scale) {
              viewerRef.current.scale.set(scale.x, scale.y, scale.z);
            }
        }
        // onLoad?.(); // Removed onLoad callback
        dispatch({ type: 'asset_loaded' }); // Dispatch asset loaded on success
      })
      .catch((err: Error) => { // Specify Error type for err
        console.error('Error loading splat scene:', err);
        // Optionally call onLoad here too, or handle error state separately
        // onLoad?.(); // Removed onLoad callback
        dispatch({ type: 'asset_loaded' }); // Dispatch asset loaded on error
      });
      // Removed .finally() block

    // Cleanup on unmount
    return () => {
      viewerRef.current?.dispose();
      viewerRef.current = null;
    };
  }, [work.link, dispatch]); // Add dispatch to dependency array

  // Update transform based on panelParams changes
  useEffect(() => {
    if (viewerRef.current && pos) {
      viewerRef.current.position.set(pos.x, pos.y, pos.z);
    }
    if (viewerRef.current && scale) {
      viewerRef.current.scale.set(scale.x, scale.y, scale.z);
    }
    // Note: Rotation is not currently handled by panelParams, but could be added here
  }, [pos, scale]);

  // No need for manual update in useFrame for DropInViewer when selfDrivenMode is false.
  // It should update automatically when part of the scene graph.
  // useFrame((state, delta) => {
  //   // viewerRef.current?.update(delta); // Removed this line
  // });

  // Return the viewer object to be added to the R3F scene
  // Need to cast because the ref type includes null
  return viewerRef.current ? <primitive object={viewerRef.current} /> : null;
};

export default SplatSceneView;