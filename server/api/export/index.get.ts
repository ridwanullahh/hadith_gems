import { db, schema } from '~~/server/db'
import { eq, sql } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const collectionId = query.collectionId ? Number(query.collectionId) : null

    // Get collections
    let collections
    if (collectionId) {
        collections = db.select().from(schema.collections).where(eq(schema.collections.id, collectionId)).all()
    } else {
        collections = db.select().from(schema.collections).all()
    }

    const exportData: any = {
        exportedAt: new Date().toISOString(),
        source: 'Hadith Gems',
        collections: []
    }

    for (const coll of collections) {
        const books = db.select().from(schema.books).where(eq(schema.books.collectionId, coll.id)).all()

        const collectionExport: any = {
            ...coll,
            books: []
        }

        for (const book of books) {
            const hadiths = db.select().from(schema.hadiths).where(eq(schema.hadiths.bookId, book.id)).all()

            const hadithsWithWords: any[] = []
            for (const hadith of hadiths) {
                const words = db.select().from(schema.hadithWords).where(eq(schema.hadithWords.hadithId, hadith.id)).all()
                const explanations = db.select().from(schema.explanations).where(eq(schema.explanations.hadithId, hadith.id)).all()
                hadithsWithWords.push({ ...hadith, words, explanations })
            }

            collectionExport.books.push({ ...book, hadiths: hadithsWithWords })
        }

        exportData.collections.push(collectionExport)
    }

    // Set headers for download
    setHeader(event, 'Content-Type', 'application/json')
    setHeader(event, 'Content-Disposition', `attachment; filename="hadith_gems_export_${Date.now()}.json"`)

    return exportData
})
