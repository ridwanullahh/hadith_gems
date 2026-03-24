import { db, schema } from '~~/server/db'

export default defineEventHandler(async () => {
    const collections = db.select().from(schema.collections).all()
    return collections
})
