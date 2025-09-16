import { createTables, addDiaryEntry, getAllDiaryEntries, deleteDiaryEntry } from '../database/diaryRepository'

const mockDb: any[] = []

// Mock for expo-sqlite
// Simulates a simple in-memory database
// with basic execAsync, getAllAsync, getFirstAsync, and runAsync methods
jest.mock('expo-sqlite', () => {
    return {
        openDatabaseSync: () => ({
            execAsync: async (sql: string) => {
                // Simuliere CREATE TABLE und INSERT
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
                // Simuliere DELETE
                if (sql.startsWith('DELETE FROM diary')) {
                    const id = params[0]
                    const idx = mockDb.findIndex(e => e.id === id)
                    if (idx !== -1) mockDb.splice(idx, 1)
                }
            }
        })
    }
})

// Helper-function to clear the diary table before each test
async function clearDiaryTable() {
    const entries = await getAllDiaryEntries()
    for (const entry of entries) {
        await deleteDiaryEntry(entry.id)
    }
}

// Positive Test
// Tests for successful operations like adding and retrieving entries
describe('DiaryRepository positive test', () => {
    beforeEach(async () => {
        mockDb.length = 0
        await createTables()
        await clearDiaryTable()
    })

    it('should create and retrieve a diary entry', async () => {
        const entry = {
            title: 'Test Title',
            event: 'Test Event',
            positiveReflections: 'Positive',
            negativeReflections: 'Negative',
            lessonsLearned: 'Lesson',
            date: '2024-06-01',
            picture: 'pic.jpg',
            caption: 'Caption'
        }
        await addDiaryEntry(entry)
        const entries = await getAllDiaryEntries()
        expect(entries.length).toBe(1)
        expect(entries[0]).toMatchObject(entry)
    })
})