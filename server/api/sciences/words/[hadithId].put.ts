import { db, schema } from '~~/server/db'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    const token = getHeader(event, 'authorization')?.replace('Bearer ', '')
    const config = useRuntimeConfig()
    if (token !== config.adminSecret) {
        throw createError({ statusCode: 401, message: 'Unauthorized' })
    }

    // Update multiple words at once
    if (body.words && Array.isArray(body.words)) {
        for (const word of body.words) {
            db.update(schema.hadithWords).set({
                transliteration: word.transliteration,
                rootAr: word.rootAr,
                rootTransliteration: word.rootTransliteration,
                morphologyPos: word.morphologyPos,
                morphologyForm: word.morphologyForm,
                morphologyDetails: word.morphologyDetails,
                meaningEn: word.meaningEn,
            }).where(eq(schema.hadithWords.id, word.id)).run()
        }
    }

    return { success: true }
})
