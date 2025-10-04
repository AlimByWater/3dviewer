import { EulerAngle, XYZ } from './types';

export type PanelParams = {
  // basic
  showPanel: boolean;
  showWorkInList: boolean;
  background: string;
  foreground: string;
  scale: XYZ;
  position: XYZ;
  rotation: EulerAngle;

  // camera
  // sync scene camera with params
  syncCamera: boolean;
  distance: number;
  /** From -2π to 2π */
  azimuthAngle: number;
  /** From 0 to π */
  polarAngle: number;
  /** Camera field of view in degrees (10-120) */
  fov: number;

  // hdri
  enableHdri: boolean;
  hdri: string;
  useHdriAsBackground: 'true' | 'false' | 'only';

  // dot buttons
  extra: ExtraPanelParams;
};

export type ExtraPanelParams = {
  dotButtons: DotButtonPanelParams[];
};

export type DotButtonPanelParams = {
  id: number;
  svgIcon: string;
  link: string;
  position: { x: number; y: number; z: number };
  scale: number;
};
