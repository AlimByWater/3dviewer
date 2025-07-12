export type PanelParams = {
  // basic
  showPanel: boolean;
  showWorkInList: boolean;
  background: string;
  foreground: string;
  scale: { x: number; y: number; z: number };
  position: { x: number; y: number; z: number };

  // camera
  /** From 1 to 100 */
  distance: number;
  /** From -2π to 2π */
  azimuthAngle: number;
  /** From 0 to 2π */
  polarAngle: number;

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
