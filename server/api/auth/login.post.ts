export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const config = useRuntimeConfig()

    if (body.username === config.adminUsername && body.password === config.adminPassword) {
        return {
            success: true,
            token: config.adminSecret,
            user: { username: body.username, role: 'admin' }
        }
    }

    throw createError({ statusCode: 401, message: 'Invalid credentials' })
})
