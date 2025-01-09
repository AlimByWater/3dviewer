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
    channel: "https://t.me/sashasvoloch",
    logo: "https://cdf026bd-e2a5-4a7a-adcd-a11f0029859b.selstorage.ru/svoloch_logo.png",
    name: "Sasha Svoloch",
    telegramUserId: 1099649271,
  },
];

export const objects: Work[] = [
  {
    id: "ss-instinctive",
    name: "instinctive",
    createdAt: "09/01/2025",
    authors: [authorsMock[0]],
    object: {
      objectUrl: "https://cdf026bd-e2a5-4a7a-adcd-a11f0029859b.selstorage.ru/sasha-instinctive.glb",
      scale: 5,
      position: [0, -4, 0],
    },
    previewUrl:
      "https://cdf026bd-e2a5-4a7a-adcd-a11f0029859b.selstorage.ru/ss-instinctive-preview.webm",
    backgroundColor: "black",
    foregroundColor: "white",
    inAquarium: false,
  },
  {
    id: "ss-sleep-table",
    name: "sleep table",
    createdAt: "22/12/2024",
    authors: [authorsMock[0]],
    object: {
      objectUrl:
        "https://efc1ea83-8d42-4e62-ae0e-e88e8e890ca8.selstorage.ru/models/compressed_sleeptable.glb",
      scale: 2,
    },
    previewUrl:
      "https://cdf026bd-e2a5-4a7a-adcd-a11f0029859b.selstorage.ru/ss-sleep-table-preview.webm",
    backgroundColor: "red",
    foregroundColor: "white",
    inAquarium: true,
  },
];

export const get3DObject = (id?: string) => {
  id ??= "ss-instinctive";
  const obj = objects.find((e) => e.id == id);
  return obj ?? objects[0]; // Return first object as fallback
};
