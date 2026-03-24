import { db, schema } from '~~/server/db'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
    const id = Number(getRouterParam(event, 'id'))

    const token = getHeader(event, 'authorization')?.replace('Bearer ', '')
    const config = useRuntimeConfig()
    if (token !== config.adminSecret) {
        throw createError({ statusCode: 401, message: 'Unauthorized' })
    }

    db.delete(schema.hadiths).where(eq(schema.hadiths.id, id)).run()
    return { success: true }
})
