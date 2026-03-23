import { db, schema } from '~/server/db'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
    const id = Number(getRouterParam(event, 'id'))
    const body = await readBody(event)

    const token = getHeader(event, 'authorization')?.replace('Bearer ', '')
    const config = useRuntimeConfig()
    if (token !== config.adminSecret) {
        throw createError({ statusCode: 401, message: 'Unauthorized' })
    }

    db.update(schema.hadiths).set({
        textAr: body.textAr,
        textEn: body.textEn,
        narrator: body.narrator,
        narratorAr: body.narratorAr,
        grade: body.grade,
        gradeAr: body.gradeAr,
        reference: body.reference,
        updatedAt: new Date().toISOString(),
    }).where(eq(schema.hadiths.id, id)).run()

    return { success: true }
})
