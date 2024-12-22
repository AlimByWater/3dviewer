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
        model: 'https://efc1ea83-8d42-4e62-ae0e-e88e8e890ca8.selstorage.ru/models/compressed_sleeptable.glb',
        logo: '',
        backgroundColor: 'red'
    }
]
