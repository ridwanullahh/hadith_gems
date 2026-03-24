import { db, schema } from '~~/server/db'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
    const hadithId = Number(getRouterParam(event, 'hadithId'))
    if (!hadithId) throw createError({ statusCode: 400, message: 'Missing hadithId' })

    const words = db.select().from(schema.hadithWords)
        .where(eq(schema.hadithWords.hadithId, hadithId))
        .all()

    return { words }
})
