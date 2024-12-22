export const get3DObject = (id) => {
    objects.find((e) => e.id == id)
}

const objects = [
    {
        id: 'SleepTable',
        name: 'SleepTable',
        createdAt: '22/12/2024',
        author: 'Sasha Svoloch',
        object: 'https://efc1ea83-8d42-4e62-ae0e-e88e8e890ca8.selstorage.ru/models/compressed_sleeptable.glb',
        logo: '',
    }
]
