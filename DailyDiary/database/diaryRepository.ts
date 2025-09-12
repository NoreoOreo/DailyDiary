import * as SQLite from 'expo-sqlite'

const db = SQLite.openDatabaseSync('diary.db')

export interface DiaryTable {
    id: number
    title: string
    event: string
    positiveReflections: string
    negativeReflections: string
    lessonsLearned: string
    date: string
    picture?: string
    caption?: string
}

export const createTables = async () => {
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS diary
        (
            id
            INTEGER
            PRIMARY
            KEY
            AUTOINCREMENT,
            title
            TEXT
            NOT
            NULL,
            event
            TEXT
            NOT
            NULL,
            positiveReflections
            TEXT
            NOT
            NULL,
            negativeReflections
            TEXT
            NOT
            NULL,
            lessonsLearned
            TEXT
            NOT
            NULL,
            date
            TEXT
            NOT
            NULL,
            picture
            TEXT,
            caption
            TEXT
        );
    `)
}

const escape = (val: string | null | undefined) =>
    val === undefined || val === null ? 'NULL' : `'${String(val).replace(/'/g, "''")}'`

export async function addDiaryEntry(entry: Omit<DiaryTable, 'id'>): Promise<void> {
    await db.execAsync(
        `INSERT INTO diary (title, event, positiveReflections, negativeReflections, lessonsLearned, date, picture,
                            caption)
         VALUES (${escape(entry.title)},
                 ${escape(entry.event)},
                 ${escape(entry.positiveReflections)},
                 ${escape(entry.negativeReflections)},
                 ${escape(entry.lessonsLearned)},
                 ${escape(entry.date)},
                 ${escape(entry.picture)},
                 ${escape(entry.caption)});`
    )
}

export async function getAllDiaryEntries(): Promise<DiaryTable[]> {
    return await db.getAllAsync<DiaryTable>(`SELECT *
                                             FROM diary;`)
}

export async function getDiaryEntryById(id: number): Promise<DiaryTable | undefined> {
    const result = await db.getFirstAsync<DiaryTable>(`SELECT *
                                                       FROM diary
                                                       WHERE id = ${id};`)
    return result === null ? undefined : result
}

export async function updateDiaryEntry(id: number, entry: Partial<Omit<DiaryTable, 'id'>>): Promise<void> {
    await db.execAsync(
        `UPDATE diary
         SET title               = ${escape(entry.title)},
             event               = ${escape(entry.event)},
             positiveReflections = ${escape(entry.positiveReflections)},
             negativeReflections = ${escape(entry.negativeReflections)},
             lessonsLearned      = ${escape(entry.lessonsLearned)},
             date                = ${escape(entry.date)},
             picture             = ${escape(entry.picture)},
             caption             = ${escape(entry.caption)}
         WHERE id = ${id};`
    )
}

export async function deleteDiaryEntry(id: number): Promise<void> {
    await db.runAsync(`DELETE FROM diary WHERE id = ?;`, [id]);
}

