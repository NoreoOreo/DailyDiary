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
                        if (!columns.includes('title') || values[columns.indexOf('title')] === 'NULL') {
                            throw new Error('Missing required field: title')
                        }
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

describe('Entry Negative Test', () => {
    beforeEach(async () => {
        mockDb.length = 0
        await createTables()
    })

    it('should throw error when title is missing', async () => {
        const badEntry = {
            event: 'Fehler Event',
            positiveReflections: 'Positiv',
            negativeReflections: 'Negativ',
            lessonsLearned: 'Gelernt',
            date: '2024-09-16',
            picture: 'bild.jpg',
            caption: 'Fehlt Titel'
        }

        await expect(addDiaryEntry(badEntry as any)).rejects.toThrow()
        const entries = await getAllDiaryEntries()
        expect(entries.length).toBe(0)
    })
})
