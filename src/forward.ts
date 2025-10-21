import { Composer } from "grammy";
import type {
  MessageOriginChannel,
  MessageOriginChat,
  MessageOriginHiddenUser,
  MessageOriginUser,
} from "grammy/types";
import { Menu } from "@grammyjs/menu";
import { eq } from "drizzle-orm";

import { inlines } from "./db/schema";
import { db } from "./db/db";

type InsertInline = typeof inlines.$inferInsert;

export const forward = new Composer<MyContext>();

const menu = new Menu<MyContext>("delete inline").text(
  {
    text: "我手滑了，删除它",
    payload: (c) => c.payload,
  },
  async (c) => {
    await db
      .update(inlines)
      .set({ mark: true })
      .where(eq(inlines.id, parseInt(c.match)));
    await c.deleteMessage();
  },
);

forward.use(menu);

forward.on("msg:forward_origin", async (c) => {
  if (c.chat.type !== "private") return;

  if (c.msg.from?.id === c.me.id) {
    await c.reply("禁止套娃!");
    return;
  }
  const inline: InsertInline = (() => {
    if (c.msg.text) {
      return {
        type: "article",
        title: c.msg.text,
        description: getUserInfo(c.msg.forward_origin),
        entities: c.msg.entities,
        mark: false,
      };
    } else if (c.msg.photo) {
      return {
        type: "photo",
        title: c.msg.caption,
        description: getUserInfo(c.msg.forward_origin),
        entities: c.msg.caption_entities,
        file_id: c.msg.photo.pop()?.file_id,
        mark: false,
      };
    } else if (c.msg.animation) {
      return {
        type: "gif",
        title: c.msg.caption,
        description: getUserInfo(c.msg.forward_origin),
        entities: c.msg.caption_entities,
        file_id: c.msg.animation.file_id,
        mark: false,
      };
    } else if (c.msg.audio) {
      return {
        type: "audio",
        title: c.msg.caption,
        description: getUserInfo(c.msg.forward_origin),
        entities: c.msg.caption_entities,
        file_id: c.msg.audio.file_id,
        mark: false,
      };
    } else if (c.msg.sticker) {
      return {
        type: "sticker",
        description: getUserInfo(c.msg.forward_origin),
        file_id: c.msg.sticker.file_id,
        mark: false,
      };
    }
    throw "unspport type message";
  })();

  let result = await db
    .update(inlines)
    .set(inline)
    .where(eq(inlines.mark, true))
    .limit(1)
    .returning({ id: inlines.id });

  if (result.length === 0) {
    result = await db
      .insert(inlines)
      .values(inline).returning({ id: inlines.id });
  }

  c.payload = result.at(0)?.id.toString()!;

  await c.reply(
    `${inline.title || inline.type}\n—— ${inline.description}\n\n已添加`,
    {
      entities: inline.entities ?? undefined,
      reply_markup: menu,
    },
  );
});

function getUserInfo(
  forward_origin:
    | MessageOriginUser
    | MessageOriginHiddenUser
    | MessageOriginChat
    | MessageOriginChannel,
): string {
  switch (forward_origin.type) {
    case "hidden_user":
      return forward_origin.sender_user_name;
    case "user":
      return forward_origin.sender_user.first_name +
        (forward_origin.sender_user.last_name || "");
    case "chat":
      switch (forward_origin.sender_chat.type) {
        case "supergroup":
        case "group":
        case "channel":
          return forward_origin.sender_chat.title;
        case "private":
          return forward_origin.sender_chat.first_name +
            (forward_origin.sender_chat.last_name || "");
      }
    case "channel":
      return forward_origin.chat.title;
  }
}
