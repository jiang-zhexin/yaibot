import { Composer, InlineQueryResultBuilder } from "grammy"
import { drizzle } from "drizzle-orm/d1"
import { and, eq, like, inArray, sql } from "drizzle-orm"
import { env } from "cloudflare:workers"

import { inlines } from "./db/schema/inlines"

type SelectInline = typeof inlines.$inferSelect

export const inlineQuery = new Composer<MyContext>()

const limitInline = 10

inlineQuery.on("inline_query", async (c) => {
    const { type, keyword, username } = matchQuery(c.inlineQuery.query)

    const db = drizzle(env.DB)

    const rawResults = await db
        .select()
        .from(inlines)
        .where(
            inArray(
                inlines.id,
                db
                    .select({ id: inlines.id })
                    .from(inlines)
                    .where(
                        and(
                            eq(inlines.type, type ?? "article"),
                            keyword ? like(inlines.title, `%${keyword}%`) : undefined,
                            username ? like(inlines.description, `%${username}%`) : undefined
                        )
                    )
                    .orderBy(sql`random()`)
                    .limit(limitInline)
            )
        )

    const results = rawResults.map(resultTransformer)
    await c.answerInlineQuery(results, { cache_time: 1, button: { text: "我也加一条", start_parameter: "start" } })
})

export function matchQuery(query: string) {
    let match = query.match(/^(gif|photo|sticker|audio)?\s*(\S+?)?(\s*by\s+\S+)?$/)
    let type: SelectInline["type"] | undefined = match?.[1]?.trim() as SelectInline["type"]
    let keyword: string | undefined = match?.[2]?.trim()
    let username: string | undefined = match?.[3]?.trimStart()?.slice(2)?.trim()
    return { type, keyword, username }
}

function resultTransformer(rr: SelectInline) {
    const id = rr.id.toString()

    switch (rr.type) {
        case "article":
            return InlineQueryResultBuilder.article(id, rr.title as string, {
                description: `by ${rr.description}`,
            }).text(rr.title as string, {
                entities: rr.entities ?? undefined,
            })
    }

    if (!rr.file_id) throw "unreachable"

    switch (rr.type) {
        case "audio":
            return InlineQueryResultBuilder.audioCached(id, rr.file_id, {
                caption: rr.title ?? undefined,
                caption_entities: rr.entities ?? undefined,
            })
        case "photo":
            return InlineQueryResultBuilder.photoCached(id, rr.file_id, {
                caption: rr.title ?? undefined,
                caption_entities: rr.entities ?? undefined,
                description: `by ${rr.description}`,
            })
        case "gif":
            return InlineQueryResultBuilder.gifCached(id, rr.file_id, {
                caption: rr.title ?? undefined,
                caption_entities: rr.entities ?? undefined,
            })
        case "sticker":
            return InlineQueryResultBuilder.stickerCached(id, rr.file_id)
    }
}
