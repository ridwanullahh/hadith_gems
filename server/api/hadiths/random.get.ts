import { db, schema } from '~/server/db'
import { sql } from 'drizzle-orm'

export default defineEventHandler(async () => {
    const hadith = db.select().from(schema.hadiths)
        .orderBy(sql`RANDOM()`)
        .limit(1)
        .get()

    if (!hadith) throw createError({ statusCode: 404, message: 'No hadiths found' })

    const collection = db.select().from(schema.collections)
        .where(sql`id = ${hadith.collectionId}`)
        .get()

    return {
        ...hadith,
        collectionName: collection?.name,
        collectionSlug: collection?.slug,
    }
})
