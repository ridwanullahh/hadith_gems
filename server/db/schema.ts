import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core'

// ─── Languages ───
export const languages = sqliteTable('languages', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    code: text('code').notNull().unique(),        // 'en', 'ar', 'ur', 'fr', 'id', 'tr'
    name: text('name').notNull(),                 // 'English', 'العربية'
    nativeName: text('native_name').notNull(),
    direction: text('direction').notNull().default('ltr'), // 'ltr' or 'rtl'
    isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
})

// ─── Collections (Sahih Bukhari, Sahih Muslim, etc.) ───
export const collections = sqliteTable('collections', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    slug: text('slug').notNull().unique(),
    name: text('name').notNull(),                 // English name
    nameAr: text('name_ar'),                      // Arabic name
    author: text('author'),
    authorAr: text('author_ar'),
    description: text('description'),
    descriptionAr: text('description_ar'),
    totalHadiths: integer('total_hadiths').default(0),
    totalBooks: integer('total_books').default(0),
    icon: text('icon'),                           // emoji or icon identifier
    color: text('color'),                         // theme color hex
    sortOrder: integer('sort_order').default(0),
    isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
    createdAt: text('created_at').notNull().$defaultFn(() => new Date().toISOString()),
    updatedAt: text('updated_at').notNull().$defaultFn(() => new Date().toISOString()),
})

// ─── Collection Translations ───
export const collectionTranslations = sqliteTable('collection_translations', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    collectionId: integer('collection_id').notNull().references(() => collections.id, { onDelete: 'cascade' }),
    languageCode: text('language_code').notNull(),
    name: text('name').notNull(),
    author: text('author'),
    description: text('description'),
})

// ─── Books / Chapters within a collection ───
export const books = sqliteTable('books', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    collectionId: integer('collection_id').notNull().references(() => collections.id, { onDelete: 'cascade' }),
    bookNumber: integer('book_number').notNull(),
    name: text('name').notNull(),
    nameAr: text('name_ar'),
    totalHadiths: integer('total_hadiths').default(0),
    sortOrder: integer('sort_order').default(0),
})

// ─── Book Translations ───
export const bookTranslations = sqliteTable('book_translations', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    bookId: integer('book_id').notNull().references(() => books.id, { onDelete: 'cascade' }),
    languageCode: text('language_code').notNull(),
    name: text('name').notNull(),
})

// ─── Hadiths ───
export const hadiths = sqliteTable('hadiths', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    collectionId: integer('collection_id').notNull().references(() => collections.id, { onDelete: 'cascade' }),
    bookId: integer('book_id').notNull().references(() => books.id, { onDelete: 'cascade' }),
    hadithNumber: integer('hadith_number').notNull(),
    hadithNumberInBook: integer('hadith_number_in_book'),
    textAr: text('text_ar').notNull(),             // Original Arabic text
    textEn: text('text_en'),                       // English translation
    narrator: text('narrator'),                    // Primary narrator
    narratorAr: text('narrator_ar'),
    grade: text('grade'),                          // Sahih, Hasan, Da'if, etc.
    gradeAr: text('grade_ar'),
    reference: text('reference'),                  // e.g. "Sahih Bukhari 1"
    createdAt: text('created_at').notNull().$defaultFn(() => new Date().toISOString()),
    updatedAt: text('updated_at').notNull().$defaultFn(() => new Date().toISOString()),
})

// ─── Hadith Translations ───
export const hadithTranslations = sqliteTable('hadith_translations', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    hadithId: integer('hadith_id').notNull().references(() => hadiths.id, { onDelete: 'cascade' }),
    languageCode: text('language_code').notNull(),
    text: text('text').notNull(),
    narrator: text('narrator'),
    grade: text('grade'),
})

// ─── Hadith Words (word-by-word breakdown) ───
export const hadithWords = sqliteTable('hadith_words', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    hadithId: integer('hadith_id').notNull().references(() => hadiths.id, { onDelete: 'cascade' }),
    wordIndex: integer('word_index').notNull(),     // Position in the hadith
    wordAr: text('word_ar').notNull(),              // Arabic word
    transliteration: text('transliteration'),       // Transliteration
    rootAr: text('root_ar'),                        // Arabic root letters
    rootTransliteration: text('root_transliteration'),
    morphologyPos: text('morphology_pos'),          // Part of speech (noun, verb, particle)
    morphologyForm: text('morphology_form'),        // Verb form (I-X)
    morphologyDetails: text('morphology_details'),  // JSON with full morphology
    meaningEn: text('meaning_en'),                  // English meaning of word
})

// ─── Word Translations (multi-language) ───
export const wordTranslations = sqliteTable('word_translations', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    wordId: integer('word_id').notNull().references(() => hadithWords.id, { onDelete: 'cascade' }),
    languageCode: text('language_code').notNull(),
    meaning: text('meaning').notNull(),
    transliteration: text('transliteration'),
})

// ─── Explanations / Commentary ───
export const explanations = sqliteTable('explanations', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    hadithId: integer('hadith_id').notNull().references(() => hadiths.id, { onDelete: 'cascade' }),
    languageCode: text('language_code').notNull().default('en'),
    title: text('title'),
    content: text('content').notNull(),
    source: text('source'),                        // Scholar or book source
    createdAt: text('created_at').notNull().$defaultFn(() => new Date().toISOString()),
    updatedAt: text('updated_at').notNull().$defaultFn(() => new Date().toISOString()),
})

// ─── Narrators (for Isnad chain) ───
export const narrators = sqliteTable('narrators', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    nameAr: text('name_ar'),
    fullName: text('full_name'),
    fullNameAr: text('full_name_ar'),
    tier: text('tier'),                            // Sahabi, Tabi'i, etc.
    biography: text('biography'),
})

// ─── Hadith Narrator Chain ───
export const hadithNarrators = sqliteTable('hadith_narrators', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    hadithId: integer('hadith_id').notNull().references(() => hadiths.id, { onDelete: 'cascade' }),
    narratorId: integer('narrator_id').notNull().references(() => narrators.id, { onDelete: 'cascade' }),
    position: integer('position').notNull(),        // Order in chain
})

// ─── User Bookmarks ───
export const bookmarks = sqliteTable('bookmarks', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    hadithId: integer('hadith_id').notNull().references(() => hadiths.id, { onDelete: 'cascade' }),
    sessionId: text('session_id').notNull(),
    note: text('note'),
    createdAt: text('created_at').notNull().$defaultFn(() => new Date().toISOString()),
})

// ─── User Notes ───
export const notes = sqliteTable('notes', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    hadithId: integer('hadith_id').notNull().references(() => hadiths.id, { onDelete: 'cascade' }),
    sessionId: text('session_id').notNull(),
    content: text('content').notNull(),
    color: text('color').default('#C5A55A'),
    createdAt: text('created_at').notNull().$defaultFn(() => new Date().toISOString()),
    updatedAt: text('updated_at').notNull().$defaultFn(() => new Date().toISOString()),
})

// ─── Reading History ───
export const readingHistory = sqliteTable('reading_history', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    hadithId: integer('hadith_id').notNull().references(() => hadiths.id, { onDelete: 'cascade' }),
    sessionId: text('session_id').notNull(),
    readAt: text('read_at').notNull().$defaultFn(() => new Date().toISOString()),
})
