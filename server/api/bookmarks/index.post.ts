import { db, schema } from '~~/server/db'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    const result = db.insert(schema.bookmarks).values({
        hadithId: body.hadithId,
        sessionId: body.sessionId,
        note: body.note || null,
        createdAt: new Date().toISOString(),
    }).run()

    return { id: Number(result.lastInsertRowid), success: true }
})
