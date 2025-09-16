import { createTables, addDiaryEntry, getAllDiaryEntries } from '../database/diaryRepository'

const mockDb: any[] = []

// Mock for expo-sqlite
// Simulates a simple in-memory database
// with basic execAsync, getAllAsync, getFirstAsync, and runAsync methods
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
                        columns.forEach((col: string, i: number) => entry[col] = values[i] === 'NULL' ? null : values[i])
                        mockDb.push(entry)
                    }
                }
            },
            getAllAsync: async () => {
                return [...mockDb]
            },
            getFirstAsync: async () => {
                return mockDb.length > 0 ? mockDb[0] : null
            },
            runAsync: async (sql: string, params: any[]) => {
                if (sql.startsWith('DELETE FROM diary')) {
                    const id = params[0]
                    const idx = mockDb.findIndex(e => e.id == id)
                    if (idx !== -1) mockDb.splice(idx, 1)
                }
            }
        })
    }
})

// Snapshot Test
// Tests that the structure of a diary entry remains consistent
describe('DiaryRepository snapshot test', () => {
    beforeEach(async () => {
        mockDb.length = 0
        await createTables()
    })

    it('should match the snapshot of a diary entry', async () => {
        const entry = {
            title: 'Snapshot Title',
            event: 'Snapshot Event',
            positiveReflections: 'Snapshot Positive',
            negativeReflections: 'Snapshot Negative',
            lessonsLearned: 'Snapshot Lesson',
            date: '2024-06-01',
            picture: 'snapshot.jpg',
            caption: 'Snapshot Caption'
        }
        await addDiaryEntry(entry)
        const entries = await getAllDiaryEntries()
        expect(entries[0]).toMatchSnapshot()
    })
})