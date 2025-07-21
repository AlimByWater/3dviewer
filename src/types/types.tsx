export type Vector3 = [number, number, number];

export interface SlotLink {
  short_code: string;
}

export interface Slot {
  id: string;
  author_id: number;
  in_aquarium: boolean;
  link: SlotLink;
  previewUrl: string;
  work: Work;
}

export interface SlotExtraParams {
  dotButtons: DotButtonParams[] | null;
}

export interface DotButtonParams {
  id: number;
  svgIcon?: string;
  link?: string;
  position?: { x: number; y: number; z: number };
  scale?: number;
}

export interface Work {
  authors: Author[];
  createdAt: string;
  foregroundColor: string;
  backgroundColor: string;
  id: string;
  name: string;
  object: WorkObject;
  link: string;
  showWorkInList: boolean;
  showPanel: boolean | null;
}

export interface Author {
  id: number;
  channel: string;
  logo: string;
  name: string;
  telegramUserId: number;
}

export interface WorkObject {
  position: Vector3;
  scale: Vector3;
  distance: number;
  azimuthAngle: number;
  polarAngle: number;
  enableHdri: false;
  hdri: string;
  useHdriAsBackground: 'true' | 'false' | 'only';
  extra: SlotExtraParams | null;
}

export const authorsMock: Author[] = [
  {
    id: 0,
    channel: 'https://t.me/sashasvoloch',
    logo: 'https://cdf026bd-e2a5-4a7a-adcd-a11f0029859b.selstorage.ru/svoloch_logo.png',
    name: 'Sasha Svoloch',
    telegramUserId: 1099649271,
  },
  {
    id: 5,
    channel: '',
    logo: '',
    name: 'no_alim',
    telegramUserId: 251636949,
  },
];

export const worksMock: Work[] = [
  {
    id: 'ss-instinctive',
    name: 'instinctive',
    createdAt: '2025-03-30T01:33:31.320Z',
    authors: [authorsMock[0], authorsMock[1]],
    link: `${process.env.NEXT_PUBLIC_BASE_PATH}/models/sasha-instinctive.glb`,
    object: {
      scale: [5, 5, 5],
      position: [0, -4, 0],
      distance: 10,
      azimuthAngle: 0,
      polarAngle: 0,
      enableHdri: false,
      hdri: 'env-1',
      useHdriAsBackground: 'false',
      extra: null,
    },
    backgroundColor: 'black',
    foregroundColor: 'white',
    showWorkInList: true,
    showPanel: true,
  },
  {
    id: 'ss-sleep-table',
    name: 'sleep table',
    createdAt: '2025-03-30T01:33:31.320Z',
    authors: [authorsMock[0]],
    link: 'https://efc1ea83-8d42-4e62-ae0e-e88e8e890ca8.selstorage.ru/models/compressed_sleeptable.glb',
    object: {
      scale: [2, 2, 2],
      position: [0, -4, 0],
      distance: 10,
      azimuthAngle: 0,
      polarAngle: 0,
      enableHdri: false,
      hdri: 'env-2',
      useHdriAsBackground: 'false',
      extra: null,
    },
    backgroundColor: 'red',
    foregroundColor: 'white',
    showWorkInList: true,
    showPanel: true,
  },
];

export const slotsMock: Slot[] = [
  {
    id: '0',
    author_id: authorsMock[0].id,
    in_aquarium: false,
    link: {
      short_code: 'slot_0',
    },
    previewUrl:
      'https://cdf026bd-e2a5-4a7a-adcd-a11f0029859b.selstorage.ru/ss-instinctive-preview.webm',
    work: worksMock[0],
  },
  {
    id: '1',
    author_id: authorsMock[0].id,
    in_aquarium: true,
    link: {
      short_code: 'slot_1',
    },
    previewUrl:
      'https://cdf026bd-e2a5-4a7a-adcd-a11f0029859b.selstorage.ru/ss-sleep-table-preview.webm',
    work: worksMock[1],
  },
  {
    id: '2',
    author_id: authorsMock[0].id,
    in_aquarium: false,
    link: {
      short_code: 'dotASHTRAY',
    },
    previewUrl:
      'https://cdf026bd-e2a5-4a7a-adcd-a11f0029859b.selstorage.ru/ss-instinctive-preview.webm',
    work: {
      ...worksMock[0],
      id: 'dot-ashtray',
      name: 'DOT Ashtray',
    },
  },
];
