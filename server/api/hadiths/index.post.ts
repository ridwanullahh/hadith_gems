import { db, schema } from '~~/server/db'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    const token = getHeader(event, 'authorization')?.replace('Bearer ', '')
    const config = useRuntimeConfig()
    if (token !== config.adminSecret) {
        throw createError({ statusCode: 401, message: 'Unauthorized' })
    }

    const now = new Date().toISOString()
    const result = db.insert(schema.hadiths).values({
        collectionId: body.collectionId,
        bookId: body.bookId,
        hadithNumber: body.hadithNumber,
        hadithNumberInBook: body.hadithNumberInBook,
        textAr: body.textAr,
        textEn: body.textEn || null,
        narrator: body.narrator || null,
        narratorAr: body.narratorAr || null,
        grade: body.grade || null,
        gradeAr: body.gradeAr || null,
        reference: body.reference || null,
        createdAt: now,
        updatedAt: now,
    }).run()

    const hadithId = Number(result.lastInsertRowid)

    // Generate word-by-word breakdown from Arabic text
    if (body.textAr) {
        const words = body.textAr.split(/\s+/).filter((w: string) => w.trim())
        for (let i = 0; i < words.length; i++) {
            db.insert(schema.hadithWords).values({
                hadithId,
                wordIndex: i,
                wordAr: words[i],
            }).run()
        }
    }

    return { id: hadithId, success: true }
})
