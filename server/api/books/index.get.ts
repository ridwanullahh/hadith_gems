import { db, schema } from '~~/server/db'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const collectionId = query.collectionId ? Number(query.collectionId) : null

    if (collectionId) {
        return db.select().from(schema.books).where(eq(schema.books.collectionId, collectionId)).all()
    }

    return db.select().from(schema.books).all()
})
