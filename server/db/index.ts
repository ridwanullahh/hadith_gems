import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import * as schema from './schema'
import { existsSync, mkdirSync } from 'fs'
import { resolve } from 'path'

const DB_PATH = resolve(process.cwd(), 'data', 'hadith_gems.db')

// Ensure data directory exists
const dataDir = resolve(process.cwd(), 'data')
if (!existsSync(dataDir)) {
    mkdirSync(dataDir, { recursive: true })
}

const sqlite = new Database(DB_PATH)

// Enable WAL mode for better concurrency
sqlite.pragma('journal_mode = WAL')
sqlite.pragma('foreign_keys = ON')

export const db = drizzle(sqlite, { schema })
export { schema }
export default db
