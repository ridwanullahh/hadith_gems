import { db, schema } from '~/server/db'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
    const slug = getRouterParam(event, 'slug')
    if (!slug) throw createError({ statusCode: 400, message: 'Missing slug' })

    const collection = db.select().from(schema.collections).where(eq(schema.collections.slug, slug)).get()
    if (!collection) throw createError({ statusCode: 404, message: 'Collection not found' })

    const books = db.select().from(schema.books).where(eq(schema.books.collectionId, collection.id)).all()

    return { ...collection, books }
})
