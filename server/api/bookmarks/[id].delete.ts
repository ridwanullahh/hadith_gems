import { db, schema } from '~/server/db'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
    const id = Number(getRouterParam(event, 'id'))

    db.delete(schema.bookmarks).where(eq(schema.bookmarks.id, id)).run()
    return { success: true }
})
