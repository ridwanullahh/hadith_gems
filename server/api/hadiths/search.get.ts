import { db, schema } from '~~/server/db'
import { like, or, sql } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const q = String(query.q || '').trim()
    const page = Number(query.page) || 1
    const limit = Math.min(Number(query.limit) || 20, 100)
    const offset = (page - 1) * limit

    if (!q) {
        return { data: [], pagination: { page, limit, total: 0, totalPages: 0 } }
    }

    const searchPattern = `%${q}%`
    const whereClause = or(
        like(schema.hadiths.textAr, searchPattern),
        like(schema.hadiths.textEn, searchPattern),
        like(schema.hadiths.narrator, searchPattern),
        like(schema.hadiths.reference, searchPattern),
    )

    const hadiths = db.select({
        id: schema.hadiths.id,
        hadithNumber: schema.hadiths.hadithNumber,
        textAr: schema.hadiths.textAr,
        textEn: schema.hadiths.textEn,
        narrator: schema.hadiths.narrator,
        grade: schema.hadiths.grade,
        reference: schema.hadiths.reference,
        collectionId: schema.hadiths.collectionId,
        bookId: schema.hadiths.bookId,
    })
        .from(schema.hadiths)
        .where(whereClause)
        .limit(limit)
        .offset(offset)
        .all()

    const countResult = db.select({ count: sql<number>`count(*)` })
        .from(schema.hadiths)
        .where(whereClause)
        .get()

    return {
        data: hadiths,
        pagination: {
            page,
            limit,
            total: countResult?.count || 0,
            totalPages: Math.ceil((countResult?.count || 0) / limit),
        }
    }
})
