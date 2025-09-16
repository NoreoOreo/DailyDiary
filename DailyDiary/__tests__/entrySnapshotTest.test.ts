import { createTables, addDiaryEntry, getAllDiaryEntries } from '../database/diaryRepository'

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
            getAllAsync: async () => [...mockDb]
        })
    }
})

describe('Entry Snapshot Test', () => {
    beforeEach(async () => {
        mockDb.length = 0
        await createTables()
    })

    it('should match the snapshot of a diary entry', async () => {
        const entry = {
            title: 'Snapshot Titel',
            event: 'Snapshot Event',
            positiveReflections: 'Yay',
            negativeReflections: 'Nay',
            lessonsLearned: 'Snapshot Lesson',
            date: '2024-09-16',
            picture: 'snap.jpg',
            caption: 'Caption'
        }

        await addDiaryEntry(entry)
        const entries = await getAllDiaryEntries()
        expect(entries[0]).toMatchSnapshot()
    })
})
