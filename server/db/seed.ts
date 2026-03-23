/**
 * Hadith Gems - Database Seed Script
 * Bismillah Ar-Rahman Ar-Raheem
 * 
 * Seeds the database from AhmedBaset/hadith-json with real Hadith data.
 */

import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { mkdirSync, existsSync, unlinkSync } from 'fs';
import * as schema from './schema';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..', '..');
const dataDir = join(projectRoot, 'data');
const dbPath = join(dataDir, 'hadith_gems.db');

// Ensure data directory exists
if (!existsSync(dataDir)) {
    mkdirSync(dataDir, { recursive: true });
}

// Delete existing DB for clean seed
if (existsSync(dbPath)) {
    unlinkSync(dbPath);
    console.log('🗑️  Removed existing database for clean seed');
}

const sqlite = new Database(dbPath);
sqlite.pragma('journal_mode = WAL');
sqlite.pragma('foreign_keys = ON');

const db = drizzle(sqlite, { schema });

// GitHub raw URL base
const BASE_URL = 'https://raw.githubusercontent.com/AhmedBaset/hadith-json/main/db/by_book';

// Collection configs
interface CollectionConfig {
    fileName: string;
    category: string;
    slug: string;
    name: string;
    nameAr: string;
    author: string;
    authorAr: string;
    description: string;
    icon: string;
    color: string;
}

const COLLECTIONS: CollectionConfig[] = [
    {
        fileName: 'nawawi40.json',
        category: 'forties',
        slug: 'nawawi40',
        nameAr: 'الأربعون النووية',
        name: "An-Nawawi's 40 Hadith",
        authorAr: 'الإمام يحيى بن شرف النووي',
        author: 'Imam Yahya ibn Sharaf al-Nawawi',
        description: 'A collection of 42 hadiths covering essential principles of Islam.',
        icon: '🌟',
        color: '#C5A55A',
    },
    {
        fileName: 'bukhari.json',
        category: 'the_9_books',
        slug: 'sahih-bukhari',
        nameAr: 'صحيح البخاري',
        name: 'Sahih al-Bukhari',
        authorAr: 'الإمام محمد بن إسماعيل البخاري',
        author: 'Imam Muhammad ibn Ismail al-Bukhari',
        description: 'The most authentic collection of Hadith.',
        icon: '📖',
        color: '#10b981',
    },
    {
        fileName: 'muslim.json',
        category: 'the_9_books',
        slug: 'sahih-muslim',
        nameAr: 'صحيح مسلم',
        name: 'Sahih Muslim',
        authorAr: 'الإمام مسلم بن الحجاج',
        author: 'Imam Muslim ibn al-Hajjaj',
        description: 'The second most authentic Hadith collection.',
        icon: '📗',
        color: '#059669',
    },
    {
        fileName: 'tirmidhi.json',
        category: 'the_9_books',
        slug: 'jami-tirmidhi',
        nameAr: 'جامع الترمذي',
        name: "Jami' at-Tirmidhi",
        authorAr: 'الإمام أبو عيسى محمد الترمذي',
        author: 'Imam Abu Isa Muhammad at-Tirmidhi',
        description: "Known for its grading system.",
        icon: '📕',
        color: '#6366f1',
    },
    {
        fileName: 'abudawud.json',
        category: 'the_9_books',
        slug: 'sunan-abu-dawud',
        nameAr: 'سنن أبي داود',
        name: 'Sunan Abu Dawud',
        authorAr: 'الإمام أبو داود سليمان بن الأشعث',
        author: 'Imam Abu Dawud',
        description: 'Focused on hadiths of legal significance.',
        icon: '📘',
        color: '#3b82f6',
    },
    {
        fileName: 'nasai.json',
        category: 'the_9_books',
        slug: 'sunan-nasai',
        nameAr: 'سنن النسائي',
        name: "Sunan an-Nasa'i",
        authorAr: 'الإمام أحمد بن شعيب النسائي',
        author: "Imam an-Nasa'i",
        description: "Known for its rigorous chain analysis.",
        icon: '📙',
        color: '#f59e0b',
    },
    {
        fileName: 'ibnmajah.json',
        category: 'the_9_books',
        slug: 'sunan-ibn-majah',
        nameAr: 'سنن ابن ماجه',
        name: 'Sunan Ibn Majah',
        authorAr: 'الإمام محمد بن يزيد ابن ماجه',
        author: 'Imam Ibn Majah',
        description: "Contains unique hadiths not found in other collections.",
        icon: '📓',
        color: '#8b5cf6',
    },
    {
        fileName: 'riyad_assalihin.json',
        category: 'other_books',
        slug: 'riyad-assalihin',
        nameAr: 'رياض الصالحين',
        name: 'Riyad as-Salihin',
        authorAr: 'الإمام يحيى بن شرف النووي',
        author: 'Imam al-Nawawi',
        description: 'Gardens of the Righteous — a beloved collection.',
        icon: '🌿',
        color: '#22c55e',
    },
];

async function fetchJSON(url: string): Promise<any> {
    console.log(`   ⬇️  Fetching: ${url}`);
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
}

async function seedCollection(config: CollectionConfig, index: number): Promise<number> {
    const url = `${BASE_URL}/${config.category}/${config.fileName}`;
    console.log(`\n📚 [${index + 1}/${COLLECTIONS.length}] Seeding ${config.name}...`);

    let data: any;
    try {
        data = await fetchJSON(url);
    } catch (error: any) {
        console.log(`   ⚠️  Failed to fetch: ${error.message}`);
        console.log(`   ⏭️  Skipping ${config.name}`);
        return 0;
    }

    // Insert collection using raw SQL (matching schema column names)
    const collResult = sqlite.prepare(`
    INSERT INTO collections (slug, name, name_ar, author, author_ar, description, icon, color, total_hadiths, total_books, sort_order, is_active, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, datetime('now'), datetime('now'))
  `).run(
        config.slug, config.name, config.nameAr, config.author, config.authorAr,
        config.description, config.icon, config.color,
        data.hadiths?.length || 0,
        data.chapters?.length || 1,
        index
    );
    const collectionId = Number(collResult.lastInsertRowid);

    // Insert books from chapters
    const chapterIdMap = new Map<number, number>(); // source chapterId -> our bookId

    if (data.chapters && data.chapters.length > 0) {
        for (let i = 0; i < data.chapters.length; i++) {
            const chapter = data.chapters[i];
            const bookResult = sqlite.prepare(`
        INSERT INTO books (collection_id, book_number, name, name_ar, total_hadiths, sort_order)
        VALUES (?, ?, ?, ?, 0, ?)
      `).run(collectionId, i + 1, chapter.english || chapter.arabic || `Book ${i + 1}`, chapter.arabic || '', i);
            chapterIdMap.set(chapter.id, Number(bookResult.lastInsertRowid));
        }
    } else {
        const bookResult = sqlite.prepare(`
      INSERT INTO books (collection_id, book_number, name, name_ar, total_hadiths, sort_order)
      VALUES (?, 1, ?, ?, 0, 0)
    `).run(collectionId, config.name, config.nameAr);
        chapterIdMap.set(0, Number(bookResult.lastInsertRowid));
    }

    // Seed hadiths — limit large collections for fast seeding
    let hadithCount = 0;
    const bookHadithCounts = new Map<number, number>();
    const maxHadiths = 500;

    if (data.hadiths && data.hadiths.length > 0) {
        const hadithsToSeed = data.hadiths.slice(0, maxHadiths);

        // Use a transaction for performance
        const insertHadith = sqlite.prepare(`
      INSERT INTO hadiths (collection_id, book_id, hadith_number, hadith_number_in_book, text_ar, text_en, narrator, narrator_ar, grade, grade_ar, reference, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, '', '', ?, datetime('now'), datetime('now'))
    `);

        const insertWord = sqlite.prepare(`
      INSERT INTO hadith_words (hadith_id, word_index, word_ar, transliteration, root_ar, meaning_en)
      VALUES (?, ?, ?, '', '', '')
    `);

        const seedBatch = sqlite.transaction(() => {
            for (const hadith of hadithsToSeed) {
                const bookId = chapterIdMap.get(hadith.chapterId) ?? [...chapterIdMap.values()][0]!;
                const narrator = hadith.english?.narrator || '';
                const textEn = hadith.english?.text || '';
                const textAr = hadith.arabic || '';
                const hadithNum = hadith.idInBook || hadithCount + 1;

                const result = insertHadith.run(
                    collectionId, bookId, hadithNum, hadithNum, textAr, textEn,
                    narrator, '', // narrator_ar
                    `${config.name} ${hadithNum}`
                );
                const hadithId = Number(result.lastInsertRowid);

                // Generate word-by-word entries (first 15 words)
                if (textAr) {
                    const words = textAr.split(/\s+/).filter((w: string) => w.length > 0).slice(0, 15);
                    for (let i = 0; i < words.length; i++) {
                        insertWord.run(hadithId, i, words[i]);
                    }
                }

                hadithCount++;
                bookHadithCounts.set(bookId, (bookHadithCounts.get(bookId) || 0) + 1);
            }
        });

        seedBatch();

        if (data.hadiths.length > maxHadiths) {
            console.log(`   ℹ️  Seeded ${maxHadiths} of ${data.hadiths.length} hadiths (limited for speed)`);
        }
    }

    // Update counts
    for (const [bookId, count] of bookHadithCounts) {
        sqlite.prepare('UPDATE books SET total_hadiths = ? WHERE id = ?').run(count, bookId);
    }
    sqlite.prepare('UPDATE collections SET total_hadiths = ? WHERE id = ?').run(hadithCount, collectionId);

    console.log(`   ✅ Seeded ${hadithCount} hadiths across ${chapterIdMap.size} books`);
    return hadithCount;
}

async function main() {
    console.log('══════════════════════════════════════════════════');
    console.log('  بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ');
    console.log('  Hadith Gems - Database Seeding');
    console.log('══════════════════════════════════════════════════');

    // Create tables from Drizzle schema (using raw SQL that matches schema.ts)
    console.log('\n🔧 Creating database tables...');
    sqlite.exec(`
    CREATE TABLE IF NOT EXISTS languages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      native_name TEXT NOT NULL,
      direction TEXT NOT NULL DEFAULT 'ltr',
      is_active INTEGER NOT NULL DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS collections (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      name_ar TEXT,
      author TEXT,
      author_ar TEXT,
      description TEXT,
      description_ar TEXT,
      total_hadiths INTEGER DEFAULT 0,
      total_books INTEGER DEFAULT 0,
      icon TEXT,
      color TEXT,
      sort_order INTEGER DEFAULT 0,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS collection_translations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      collection_id INTEGER NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
      language_code TEXT NOT NULL,
      name TEXT NOT NULL,
      author TEXT,
      description TEXT
    );

    CREATE TABLE IF NOT EXISTS books (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      collection_id INTEGER NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
      book_number INTEGER NOT NULL,
      name TEXT NOT NULL,
      name_ar TEXT,
      total_hadiths INTEGER DEFAULT 0,
      sort_order INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS book_translations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      book_id INTEGER NOT NULL REFERENCES books(id) ON DELETE CASCADE,
      language_code TEXT NOT NULL,
      name TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS hadiths (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      collection_id INTEGER NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
      book_id INTEGER NOT NULL REFERENCES books(id) ON DELETE CASCADE,
      hadith_number INTEGER NOT NULL,
      hadith_number_in_book INTEGER,
      text_ar TEXT NOT NULL,
      text_en TEXT,
      narrator TEXT,
      narrator_ar TEXT,
      grade TEXT,
      grade_ar TEXT,
      reference TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS hadith_translations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      hadith_id INTEGER NOT NULL REFERENCES hadiths(id) ON DELETE CASCADE,
      language_code TEXT NOT NULL,
      text TEXT NOT NULL,
      narrator TEXT,
      grade TEXT
    );

    CREATE TABLE IF NOT EXISTS hadith_words (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      hadith_id INTEGER NOT NULL REFERENCES hadiths(id) ON DELETE CASCADE,
      word_index INTEGER NOT NULL,
      word_ar TEXT NOT NULL,
      transliteration TEXT,
      root_ar TEXT,
      root_transliteration TEXT,
      morphology_pos TEXT,
      morphology_form TEXT,
      morphology_details TEXT,
      meaning_en TEXT
    );

    CREATE TABLE IF NOT EXISTS word_translations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      word_id INTEGER NOT NULL REFERENCES hadith_words(id) ON DELETE CASCADE,
      language_code TEXT NOT NULL,
      meaning TEXT NOT NULL,
      transliteration TEXT
    );

    CREATE TABLE IF NOT EXISTS explanations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      hadith_id INTEGER NOT NULL REFERENCES hadiths(id) ON DELETE CASCADE,
      language_code TEXT NOT NULL DEFAULT 'en',
      title TEXT,
      content TEXT NOT NULL,
      source TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS narrators (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      name_ar TEXT,
      full_name TEXT,
      full_name_ar TEXT,
      tier TEXT,
      biography TEXT
    );

    CREATE TABLE IF NOT EXISTS hadith_narrators (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      hadith_id INTEGER NOT NULL REFERENCES hadiths(id) ON DELETE CASCADE,
      narrator_id INTEGER NOT NULL REFERENCES narrators(id) ON DELETE CASCADE,
      position INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS bookmarks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      hadith_id INTEGER NOT NULL REFERENCES hadiths(id) ON DELETE CASCADE,
      session_id TEXT NOT NULL,
      note TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      hadith_id INTEGER NOT NULL REFERENCES hadiths(id) ON DELETE CASCADE,
      session_id TEXT NOT NULL,
      content TEXT NOT NULL,
      color TEXT DEFAULT '#C5A55A',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS reading_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      hadith_id INTEGER NOT NULL REFERENCES hadiths(id) ON DELETE CASCADE,
      session_id TEXT NOT NULL,
      read_at TEXT NOT NULL
    );
  `);

    // Seed languages
    console.log('🌐 Seeding languages...');
    sqlite.prepare(`
    INSERT OR IGNORE INTO languages (code, name, native_name, direction) VALUES (?, ?, ?, ?)
  `).run('ar', 'Arabic', 'العربية', 'rtl');
    sqlite.prepare(`
    INSERT OR IGNORE INTO languages (code, name, native_name, direction) VALUES (?, ?, ?, ?)
  `).run('en', 'English', 'English', 'ltr');

    // Seed collections
    let totalHadiths = 0;
    for (let i = 0; i < COLLECTIONS.length; i++) {
        totalHadiths += await seedCollection(COLLECTIONS[i], i);
    }

    // Create indexes
    console.log('\n📊 Creating indexes...');
    sqlite.exec(`
    CREATE INDEX IF NOT EXISTS idx_hadiths_collection ON hadiths(collection_id);
    CREATE INDEX IF NOT EXISTS idx_hadiths_book ON hadiths(book_id);
    CREATE INDEX IF NOT EXISTS idx_hadith_words_hadith ON hadith_words(hadith_id);
    CREATE INDEX IF NOT EXISTS idx_books_collection ON books(collection_id);
    CREATE INDEX IF NOT EXISTS idx_bookmarks_session ON bookmarks(session_id);
    CREATE INDEX IF NOT EXISTS idx_bookmarks_hadith ON bookmarks(hadith_id);
  `);

    console.log('\n══════════════════════════════════════════════════');
    console.log(`✅ Database seeded successfully!`);
    console.log(`📊 Total hadiths: ${totalHadiths}`);
    console.log(`📁 Database: ${dbPath}`);
    console.log('══════════════════════════════════════════════════');

    sqlite.close();
}

main().catch(console.error);
