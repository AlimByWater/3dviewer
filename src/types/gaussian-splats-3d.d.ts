// Basic module declaration to satisfy TypeScript
// For more robust typing, specific classes and methods could be defined here.
declare module '@mkkellogg/gaussian-splats-3d' {
  import * as THREE from 'three';

  export interface ViewerParams {
    cameraUp?: number[];
    initialCameraPosition?: number[];
    initialCameraLookAt?: number[];
    threeScene?: THREE.Scene;
    selfDrivenMode?: boolean;
    renderer?: THREE.WebGLRenderer;
    camera?: THREE.Camera;
    useBuiltInControls?: boolean;
    ignoreDevicePixelRatio?: boolean;
    gpuAcceleratedSort?: boolean;
    enableSIMDInSort?: boolean;
    sharedMemoryForWorkers?: boolean;
    integerBasedSort?: boolean;
    splatSortDistanceMapPrecision?: number;
    halfPrecisionCovariancesOnGPU?: boolean;
    dynamicScene?: boolean;
    webXRMode?: any; // Replace 'any' with specific enum if known
    webXRSessionInit?: any;
    renderMode?: any; // Replace 'any' with specific enum if known
    sceneRevealMode?: any; // Replace 'any' with specific enum if known
    antialiased?: boolean;
    kernel2DSize?: number;
    focalAdjustment?: number;
    logLevel?: any; // Replace 'any' with specific enum if known
    sphericalHarmonicsDegree?: 0 | 1 | 2;
    enableOptionalEffects?: boolean;
    optimizeSplatData?: boolean;
    inMemoryCompressionLevel?: 0 | 1 | 2;
    freeIntermediateSplatData?: boolean;
    splatRenderMode?: any; // Replace 'any' with specific enum if known
    sceneFadeInRateMultiplier?: number;
  }

  export interface SplatSceneParams {
    format?: 'Ply' | 'Splat' | 'KSplat';
    splatAlphaRemovalThreshold?: number;
    showLoadingUI?: boolean;
    position?: number[];
    rotation?: number[]; // Quaternion [x, y, z, w]
    scale?: number[];
    progressiveLoad?: boolean;
  }

  export class DropInViewer extends THREE.Object3D {
    constructor(params?: ViewerParams);
    addSplatScene(path: string, params?: SplatSceneParams): Promise<void>;
    addSplatScenes(scenes: { path: string } & SplatSceneParams[]): Promise<void>;
    update(delta: number): void;
    render(): void; // Note: Render might be handled internally in selfDrivenMode=false
    dispose(): void;
    // Add other methods/properties as needed
  }

  // Add other exports from the library if needed (e.g., Viewer, enums)
}