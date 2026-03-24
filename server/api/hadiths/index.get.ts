import { db, schema } from '~~/server/db'
import { eq, and, like, sql } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const page = Number(query.page) || 1
    const limit = Math.min(Number(query.limit) || 20, 100)
    const offset = (page - 1) * limit
    const collectionId = query.collectionId ? Number(query.collectionId) : null
    const bookId = query.bookId ? Number(query.bookId) : null

    let conditions: any[] = []
    if (collectionId) conditions.push(eq(schema.hadiths.collectionId, collectionId))
    if (bookId) conditions.push(eq(schema.hadiths.bookId, bookId))

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined

    const hadiths = db.select().from(schema.hadiths)
        .where(whereClause)
        .limit(limit)
        .offset(offset)
        .all()

    const countResult = db.select({ count: sql<number>`count(*)` }).from(schema.hadiths).where(whereClause).get()
    const total = countResult?.count || 0

    return {
        data: hadiths,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        }
    }
})
