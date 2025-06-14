import { Bot, webhookCallback } from "grammy"

import { forward } from "./forward"
import { inlineQuery } from "./inline"
import { log } from "./log"
import { help } from "./help"

export default {
    async fetch(request, env, ctx): Promise<Response> {
        const bot = new Bot<MyContext>(env.BOT_TOKEN, { botInfo: env.BOT_INFO })

        bot.use(async (c, next) => {
            c.cf = { env: env, ctx: ctx }
            await next()
        })
        bot.use(log)
        bot.use(help)

        bot.use(forward)
        bot.use(inlineQuery)

        return webhookCallback(bot, "cloudflare-mod", { secretToken: env.SECRET_TOKEN })(request).catch((err) => {
            console.error(err)
            return new Response(null, { status: 200 })
        })
    },
} satisfies ExportedHandler<Env>
