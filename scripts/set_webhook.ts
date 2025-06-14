import "dotenv/config"
import { Bot } from "grammy"

const bot = new Bot(process.env.BOT_TOKEN!)
await bot.init()
bot.api.setWebhook(process.env.WEB_HOOK!, {
    secret_token: process.env.SECRET_TOKEN,
})
