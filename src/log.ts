import { Composer } from "grammy"

export const log = new Composer<MyContext>()

log.use(async (c, next) => {
    console.log({ update: c.update })
    await next()
})
