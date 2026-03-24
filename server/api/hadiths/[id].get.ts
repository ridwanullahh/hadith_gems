import { db, schema } from '~~/server/db'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
    const id = Number(getRouterParam(event, 'id'))
    if (!id) throw createError({ statusCode: 400, message: 'Missing hadith id' })

    const hadith = db.select().from(schema.hadiths).where(eq(schema.hadiths.id, id)).get()
    if (!hadith) throw createError({ statusCode: 404, message: 'Hadith not found' })

    // Get collection info
    const collection = db.select().from(schema.collections).where(eq(schema.collections.id, hadith.collectionId)).get()

    // Get book info
    const book = db.select().from(schema.books).where(eq(schema.books.id, hadith.bookId)).get()

    // Get words for word-by-word
    const words = db.select().from(schema.hadithWords).where(eq(schema.hadithWords.hadithId, id)).all()

    // Get explanations
    const explanations = db.select().from(schema.explanations).where(eq(schema.explanations.hadithId, id)).all()

    return {
        ...hadith,
        collection,
        book,
        words,
        explanations,
    }
})
