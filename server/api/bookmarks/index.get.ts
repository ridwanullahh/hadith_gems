import { db, schema } from '~/server/db'
import { eq, and } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const sessionId = String(query.sessionId || '')
    if (!sessionId) return { data: [] }

    const bookmarkedHadiths = db.select({
        bookmark: schema.bookmarks,
        hadith: schema.hadiths,
    })
        .from(schema.bookmarks)
        .innerJoin(schema.hadiths, eq(schema.bookmarks.hadithId, schema.hadiths.id))
        .where(eq(schema.bookmarks.sessionId, sessionId))
        .all()

    return {
        data: bookmarkedHadiths.map(bh => ({
            ...bh.hadith,
            bookmarkId: bh.bookmark.id,
            bookmarkNote: bh.bookmark.note,
            bookmarkedAt: bh.bookmark.createdAt,
        }))
    }
})
