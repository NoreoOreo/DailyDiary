import { createTables, addDiaryEntry, getAllDiaryEntries, deleteDiaryEntry } from '../database/diaryRepository'

const mockDb: any[] = []

jest.mock('expo-sqlite', () => {
    return {
        openDatabaseSync: () => ({
            execAsync: async (sql: string) => {
                if (sql.startsWith('INSERT INTO diary')) {
                    const match = sql.match(/\(([^)]+)\)\s+VALUES\s+\(([^)]+)\)/)
                    if (match) {
                        const columns = match[1].split(',').map(s => s.trim())
                        const values = match[2].split(',').map(s => s.trim().replace(/^'|'$/g, ''))
                        const entry: any = { id: mockDb.length + 1 }
                        columns.forEach((col: string, i: number) => (entry[col] = values[i] === 'NULL' ? null : values[i]))
                        mockDb.push(entry)
                    }
                }
            },
            getAllAsync: async () => [...mockDb],
            runAsync: async (sql: string, params: any[]) => {
                if (sql.startsWith('DELETE FROM diary')) {
                    const id = params[0]
                    const idx = mockDb.findIndex(e => e.id === id)
                    if (idx !== -1) mockDb.splice(idx, 1)
                }
            }
        })
    }
})

describe('Entry Positive Test', () => {
    beforeEach(async () => {
        mockDb.length = 0
        await createTables()
    })

    it('should create and retrieve a valid diary entry', async () => {
        const entry = {
            title: 'Mein Tag',
            event: 'Test Event',
            positiveReflections: 'Nice',
            negativeReflections: 'None',
            lessonsLearned: 'Gelernt!',
            date: '2024-09-16',
            picture: 'pic.jpg',
            caption: 'Caption'
        }

        await addDiaryEntry(entry)
        const entries = await getAllDiaryEntries()
        expect(entries.length).toBe(1)
        expect(entries[0]).toMatchObject(entry)
    })
})


