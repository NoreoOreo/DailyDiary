import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('diary.db');

export default db;