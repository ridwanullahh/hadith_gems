import { db, schema } from '~/server/db'
import { sql } from 'drizzle-orm'

export default defineEventHandler(async () => {
    const totalHadiths = db.select({ count: sql<number>`count(*)` }).from(schema.hadiths).get()
    const totalCollections = db.select({ count: sql<number>`count(*)` }).from(schema.collections).get()
    const totalBooks = db.select({ count: sql<number>`count(*)` }).from(schema.books).get()
    const totalWords = db.select({ count: sql<number>`count(*)` }).from(schema.hadithWords).get()
    const totalExplanations = db.select({ count: sql<number>`count(*)` }).from(schema.explanations).get()
    const totalBookmarks = db.select({ count: sql<number>`count(*)` }).from(schema.bookmarks).get()

    return {
        hadiths: totalHadiths?.count || 0,
        collections: totalCollections?.count || 0,
        books: totalBooks?.count || 0,
        words: totalWords?.count || 0,
        explanations: totalExplanations?.count || 0,
        bookmarks: totalBookmarks?.count || 0,
    }
})
