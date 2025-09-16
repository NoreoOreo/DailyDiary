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

describe('Valid entry creation', () => {
    beforeEach(async () => {
        db.clear()
        await createTables()
    })

    it('stores a complete entry in the mock DB', async () => {
        const newEntry = {
            title: 'Tagebuch-Test',
            event: 'Unit Test läuft',
            positiveReflections: 'Stolz',
            negativeReflections: 'Müde',
            lessonsLearned: 'Tests früh machen',
            date: '2024-09-17',
            picture: 'unit.jpg',
            caption: 'Test erfolgreich'
        }

        await addDiaryEntry(newEntry)
        const all = await getAllDiaryEntries()
        expect(all.length).toBe(1)
        expect(all[0].title).toBe('Tagebuch-Test')
    })
})
