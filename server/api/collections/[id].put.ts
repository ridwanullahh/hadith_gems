import { db, schema } from '~~/server/db'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
    const id = Number(getRouterParam(event, 'id'))
    const body = await readBody(event)

    const token = getHeader(event, 'authorization')?.replace('Bearer ', '')
    const config = useRuntimeConfig()
    if (token !== config.adminSecret) {
        throw createError({ statusCode: 401, message: 'Unauthorized' })
    }

    db.update(schema.collections).set({
        name: body.name,
        nameAr: body.nameAr,
        author: body.author,
        authorAr: body.authorAr,
        description: body.description,
        descriptionAr: body.descriptionAr,
        icon: body.icon,
        color: body.color,
        sortOrder: body.sortOrder,
        updatedAt: new Date().toISOString(),
    }).where(eq(schema.collections.id, id)).run()

    return { success: true }
})
