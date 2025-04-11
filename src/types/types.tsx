type Vector3 = number[];

export interface SlotLink {
  short_code: string;
}

export interface Slot {
  id: string;
  author_id: number;
  public: boolean;
  in_aquarium: boolean;
  link: SlotLink;
  previewUrl: string;
  work: Work;
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
}

export interface Author {
  id: number;
  channel: string;
  logo: string;
  name: string;
  telegramUserId: number;
}

export interface WorkObject {
  hdriUrl?: string;
  position?: Vector3;
  scale?: number | Vector3;
  playAction?: string;
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
      scale: 5,
      position: [0, -4, 0],
    },
    backgroundColor: 'black',
    foregroundColor: 'white',
  },
  {
    id: 'ss-sleep-table',
    name: 'sleep table',
    createdAt: '2025-03-30T01:33:31.320Z',
    authors: [authorsMock[0]],
    link: 'https://efc1ea83-8d42-4e62-ae0e-e88e8e890ca8.selstorage.ru/models/compressed_sleeptable.glb',
    object: {
      scale: 2,
    },
    backgroundColor: 'red',
    foregroundColor: 'white',
  },
];

export const slotsMock: Slot[] = [
  {
    id: '0',
    author_id: authorsMock[0].id,
    in_aquarium: false,
    public: true,
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
    public: true,
    link: {
      short_code: 'slot_1',
    },
    previewUrl:
      'https://cdf026bd-e2a5-4a7a-adcd-a11f0029859b.selstorage.ru/ss-sleep-table-preview.webm',
    work: worksMock[1],
  },
];

export const get3DObject = (id?: string) => {
  id ??= 'ss-instinctive';
  const obj = worksMock.find((e) => e.id == id);
  return obj ?? worksMock[0]; // Return first object as fallback
};
