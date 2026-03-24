import { db, schema } from '~~/server/db'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
    const id = Number(getRouterParam(event, 'id'))

    const token = getHeader(event, 'authorization')?.replace('Bearer ', '')
    const config = useRuntimeConfig()
    if (token !== config.adminSecret) {
        throw createError({ statusCode: 401, message: 'Unauthorized' })
    }

    // Delete collection (cascade will remove books and hadiths)
    db.delete(schema.collections).where(eq(schema.collections.id, id)).run()
    return { success: true }
})
