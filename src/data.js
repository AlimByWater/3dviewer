const objects = [
  {
    id: 'demo',
    name: 'SleepTable',
    createdAt: '22/12/2024',
    author: 'Sasha Svoloch',
    channel: 'https://t.me/sashasvoloch',
    model: 'https://efc1ea83-8d42-4e62-ae0e-e88e8e890ca8.selstorage.ru/models/compressed_sleeptable.glb',
    logo: 'https://cdf026bd-e2a5-4a7a-adcd-a11f0029859b.selstorage.ru/svoloch_logo.png',
    previewImage: 'https://cdf026bd-e2a5-4a7a-adcd-a11f0029859b.selstorage.ru/preview_sleep_table.webp',
    backgroundColor: 'black',
    textColor: 'white',
    aquarium: true,
    position: [-2, -2, 0]
  },
  {
    id: 'demo2',
    name: 'SleepTable2',
    createdAt: '22/12/2024',
    author: 'Sasha Svoloch',
    channel: 'https://t.me/sashasvoloch',
    model: 'https://efc1ea83-8d42-4e62-ae0e-e88e8e890ca8.selstorage.ru/models/compressed_sleeptable.glb',
    logo: 'https://cdf026bd-e2a5-4a7a-adcd-a11f0029859b.selstorage.ru/svoloch_logo.png',
    previewImage: 'https://cdf026bd-e2a5-4a7a-adcd-a11f0029859b.selstorage.ru/preview_sleep_table.webp',
    backgroundColor: 'white',
    textColor: 'black',
    aquarium: true,
    position: [-2, -2, 0]
  },
  {
    id: 'demo3',
    name: 'SleepTable2',
    createdAt: '22/12/2024',
    author: 'Sasha Svoloch 3',
    channel: 'https://t.me/sashasvoloch',
    model: 'https://efc1ea83-8d42-4e62-ae0e-e88e8e890ca8.selstorage.ru/models/compressed_sleeptable.glb',
    logo: 'https://cdf026bd-e2a5-4a7a-adcd-a11f0029859b.selstorage.ru/svoloch_logo.png',
    previewImage: 'https://cdf026bd-e2a5-4a7a-adcd-a11f0029859b.selstorage.ru/preview_sleep_table.webp',
    backgroundColor: 'white',
    textColor: 'black',
    aquarium: true,
    position: [-2, -2, 0]
  }
]

export { objects }

export const get3DObject = (id) => {
  id ??= 'demo'
  const obj = objects.find((e) => e.id == id)
  return obj ?? objects[0] // Return first object as fallback
}
