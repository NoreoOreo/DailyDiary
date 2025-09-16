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
                        // Prüfe, ob ein Pflichtfeld fehlt
                        if (!columns.includes('title') || values[columns.indexOf('title')] === 'NULL') {
                            throw new Error('Missing required field: title')
                        }
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
                    const idx = mockDb.findIndex(e => e.id === id)
                    if (idx !== -1) mockDb.splice(idx, 1)
                }
            }
        })
    }
})

// Negative Test
// Tests for error scenarios like missing required fields
describe('DiaryRepository negative test', () => {
    beforeEach(async () => {
        mockDb.length = 0
        await createTables()
    })

    it('should throw when required fields are missing', async () => {
        const incompleteEntry = {
            // title fehlt!
            event: 'Test Event',
            positiveReflections: 'Positive',
            negativeReflections: 'Negative',
            lessonsLearned: 'Lesson',
            date: '2024-06-01',
            picture: 'pic.jpg',
            caption: 'Caption'
        }
        await expect(addDiaryEntry(incompleteEntry as any)).rejects.toThrow()
        const entries = await getAllDiaryEntries()
        expect(entries.length).toBe(0)
    })
})