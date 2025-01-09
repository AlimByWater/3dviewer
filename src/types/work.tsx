type Vector3 = number[];

export interface Work {
  authors: Author[];
  createdAt: string;
  foregroundColor: string;
  backgroundColor: string;
  id: string;
  inAquarium: boolean;
  name: string;
  object: WorkObject;
  previewUrl: string;
}

export interface Author {
  channel: string;
  logo: string;
  name: string;
  telegramUserId: number;
}

export interface WorkObject {
  hdriUrl?: string;
  objectUrl: string;
  position?: Vector3;
  scale?: number | Vector3;
  playAction?: string;
}

export const authorsMock = [
  {
    channel: 'https://t.me/sashasvoloch',
    logo: 'https://cdf026bd-e2a5-4a7a-adcd-a11f0029859b.selstorage.ru/svoloch_logo.png',
    name: 'Sasha Svoloch',
    telegramUserId: 1099649271,
  },
  {
    channel: 'https://t.me/sashasvoloch',
    logo: 'https://cdf026bd-e2a5-4a7a-adcd-a11f0029859b.selstorage.ru/svoloch_logo.png',
    name: 'Sasha Svoloch 3',
    telegramUserId: 0,
  },
];

export const objects: Work[] = [
  {
    id: 'demo',
    name: 'SleepTable',
    createdAt: '22/12/2024',
    authors: [authorsMock[0]],
    object: {
      objectUrl: '/turtle.glb',
      scale: 23,
    },
    previewUrl:
      'https://cdf026bd-e2a5-4a7a-adcd-a11f0029859b.selstorage.ru/preview_sleep_table.webp',
    backgroundColor: 'white',
    foregroundColor: 'black',
    inAquarium: true,
  },
  {
    id: 'demo2',
    name: 'SleepTable2',
    createdAt: '22/12/2024',
    authors: [authorsMock[0]],
    object: {
      objectUrl:
        'https://efc1ea83-8d42-4e62-ae0e-e88e8e890ca8.selstorage.ru/models/compressed_sleeptable.glb',
      scale: 2,
    },
    previewUrl:
      'https://cdf026bd-e2a5-4a7a-adcd-a11f0029859b.selstorage.ru/preview_sleep_table.webp',
    backgroundColor: 'red',
    foregroundColor: 'white',
    inAquarium: true,
  },
  {
    id: 'demo3',
    name: 'SleepTable3',
    createdAt: '22/12/2024',
    authors: [authorsMock[0], authorsMock[1]],
    object: {
      objectUrl:
        'https://efc1ea83-8d42-4e62-ae0e-e88e8e890ca8.selstorage.ru/models/compressed_sleeptable.glb',
      position: [-2, -2, 0],
    },
    previewUrl:
      'https://cdf026bd-e2a5-4a7a-adcd-a11f0029859b.selstorage.ru/preview_sleep_table.webp',
    backgroundColor: 'white',
    foregroundColor: 'black',
    inAquarium: false,
  },
];

export const get3DObject = (id?: string) => {
  id ??= 'demo';
  const obj = objects.find((e) => e.id == id);
  return obj ?? objects[0]; // Return first object as fallback
};
