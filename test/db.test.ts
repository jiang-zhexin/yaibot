import { env } from "cloudflare:test"
import { describe, it } from "vitest"
import { drizzle } from "drizzle-orm/d1"
import { inlines } from "../src/db/schema/inlines"
import { eq, inArray, like, sql, and } from "drizzle-orm"

describe("db", () => {
    it("db insert", async () => {
        const inline = {
            type: "article",
            title: "aaaa",
            description: "bbbb",
            entities: null,
        } as const

        const db = drizzle(env.DB)
        let result = await db
            .update(inlines)
            .set({ mark: false, ...inline })
            .where(eq(inlines.mark, true))
            .limit(1)
            .returning({ id: inlines.id })
        if (result.length === 0) {
            result = await db
                .insert(inlines)
                .values({ mark: false, ...inline })
                .returning({ id: inlines.id })
        }
        const id = result[0].id
        console.log("插入" + id)
        await db.update(inlines).set({ mark: true }).where(eq(inlines.id, 2025))

        const r = await db.select().from(inlines).where(eq(inlines.mark, true))
        console.log(r[0])
    })

    it("db select", async () => {
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
                        .where(and(eq(inlines.type, "article"), like(inlines.title, "%唉%")))
                        .orderBy(sql`random()`)
                        .limit(10)
                )
            )
        console.log(rawResults)
    })
})
