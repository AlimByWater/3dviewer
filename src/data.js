export const get3DObject = (id) => {
  id ??= 'demo'
  return objects.find((e) => e.id == id)
}

const objects = [
  {
    id: 'demo',
    name: 'SleepTable',
    createdAt: '22/12/2024',
    author: 'Sasha Svoloch',
    channel: 'https://t.me/sashasvoloch',
    model: 'https://efc1ea83-8d42-4e62-ae0e-e88e8e890ca8.selstorage.ru/models/compressed_sleeptable.glb',
    logo: 'https://cdf026bd-e2a5-4a7a-adcd-a11f0029859b.selstorage.ru/svoloch_logo.png',
    backgroundColor: 'white',
    textColor: 'black',
    aquarium: true,
    position: [-2, -2, 0]
  }
]
