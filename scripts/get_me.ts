import "dotenv/config";
import { Bot } from "grammy";
import { readFile, writeFile } from "node:fs/promises";
import { applyEdits, modify } from "jsonc-parser";

const bot = new Bot(process.env.BOT_TOKEN!);
await bot.init();

const path = "wrangler.jsonc";

const content = await readFile(path, "utf8");

const edits = modify(
  content,
  ["vars", "BOT_INFO"],
  bot.botInfo,
  { formattingOptions: { insertSpaces: true, tabSize: 2 } },
);

const updated = applyEdits(content, edits);

await writeFile(path, updated);
