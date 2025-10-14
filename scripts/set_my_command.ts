import "dotenv/config";
import { Bot } from "grammy";

const bot = new Bot(process.env.BOT_TOKEN!);
await bot.init();
await bot.api.setMyCommands([{ command: "help", description: "使用帮助" }]);
