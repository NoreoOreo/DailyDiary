import { createTables, addDiaryEntry, getAllDiaryEntries } from '../database/diaryRepository'

const db = new Map<number, any>()

jest.mock('expo-sqlite', () => ({
    openDatabaseSync: () => ({
        execAsync: async (sql: string) => {
            if (sql.startsWith('INSERT INTO diary')) {
                const keys = sql.match(/\(([^)]+)\)/)?.[1].split(',').map(k => k.trim()) ?? []
                const vals = sql.match(/VALUES\s+\(([^)]+)\)/)?.[1].split(',').map(v => v.replace(/'/g, '').trim()) ?? []
                const obj: any = { id: db.size + 1 }
                keys.forEach((k, i) => obj[k] = vals[i])
                db.set(obj.id, obj)
            }
        },
        getAllAsync: async () => Array.from(db.values())
    })
}))

describe('Entry structure snapshot', () => {
    beforeEach(async () => {
        db.clear()
        await createTables()
    })

    it('keeps the data structure consistent', async () => {
        const sample = {
            title: 'Snapshot 👀',
            event: 'Coding Marathon',
            positiveReflections: 'Viel geschafft',
            negativeReflections: 'Kaum geschlafen',
            lessonsLearned: 'Mehr Pausen machen',
            date: '2024-09-17',
            picture: 'snapshot.png',
            caption: 'Drei Tage durchgecodet'
        }

        await addDiaryEntry(sample)
        const all = await getAllDiaryEntries()
        expect(Object.keys(all[0])).toEqual(
            expect.arrayContaining(['id','title','event','positiveReflections','negativeReflections','lessonsLearned','date','picture','caption'])
        )
        expect(all[0]).toMatchSnapshot()
    })
})
