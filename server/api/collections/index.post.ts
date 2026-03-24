import { db, schema } from '~~/server/db'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    // Simple auth check
    const token = getHeader(event, 'authorization')?.replace('Bearer ', '')
    const config = useRuntimeConfig()
    if (token !== config.adminSecret) {
        throw createError({ statusCode: 401, message: 'Unauthorized' })
    }

    const now = new Date().toISOString()
    const result = db.insert(schema.collections).values({
        slug: body.slug,
        name: body.name,
        nameAr: body.nameAr || null,
        author: body.author || null,
        authorAr: body.authorAr || null,
        description: body.description || null,
        descriptionAr: body.descriptionAr || null,
        icon: body.icon || '📚',
        color: body.color || '#059669',
        sortOrder: body.sortOrder || 0,
        isActive: true,
        createdAt: now,
        updatedAt: now,
    }).run()

    return { id: Number(result.lastInsertRowid), success: true }
})
