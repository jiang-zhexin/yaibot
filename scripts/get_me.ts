import "dotenv/config"
import { Bot } from "grammy"

const bot = new Bot(process.env.BOT_TOKEN!)
await bot.init()
console.log(JSON.stringify(bot.botInfo))
