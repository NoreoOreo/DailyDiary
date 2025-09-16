import { createTables, addDiaryEntry, getAllDiaryEntries } from '../database/diaryRepository'

const db = new Map<number, any>()

jest.mock('expo-sqlite', () => ({
    openDatabaseSync: () => ({
        execAsync: async (sql: string) => {
            if (sql.startsWith('INSERT INTO diary')) {
                if (sql.includes('NULL') || sql.includes("''")) {
                    throw new Error('Validation failed')
                }
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

describe('Invalid entry handling', () => {
    beforeEach(async () => {
        db.clear()
        await createTables()
    })

    it('rejects entries without a title', async () => {
        const broken = {
            title: '',
            event: 'Fehlversuch',
            positiveReflections: 'lol',
            negativeReflections: 'meh',
            lessonsLearned: '—',
            date: '2024-09-17',
            picture: 'x.jpg',
            caption: 'leer'
        }

        await expect(addDiaryEntry(broken as any)).rejects.toThrow()
        const all = await getAllDiaryEntries()
        expect(all).toHaveLength(0)
    })
})
