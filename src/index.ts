import { env } from "cloudflare:workers";
import { Bot, webhookCallback } from "grammy";
import { forward } from "./forward.ts";
import { help } from "./help.ts";
import { inlineQuery } from "./inline.ts";
import { log } from "./log.ts";

const bot = new Bot<yaibContext>(env.BOT_TOKEN, { botInfo: env.BOT_INFO });

bot.use(log);
bot.use(help);

bot.use(forward);
bot.use(inlineQuery);

export default {
  async fetch(request, env, _ctx): Promise<Response> {
    return await webhookCallback(bot, "cloudflare-mod", {
      secretToken: env.SECRET_TOKEN,
    })(request).catch((err) => {
      console.error(err);
      return new Response(null, { status: 200 });
    });
  },
} satisfies ExportedHandler<Env>;
