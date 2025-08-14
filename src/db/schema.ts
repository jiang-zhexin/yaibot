import { int, sqliteTable, text, index } from "drizzle-orm/sqlite-core"
import type { MessageEntity } from "@grammyjs/types"

export const inlines = sqliteTable(
    "inlines",
    {
        id: int().primaryKey({ autoIncrement: true }),
        type: text({ enum: ["article", "gif", "photo", "sticker", "audio"] }).notNull(),
        title: text(),
        description: text(),
        entities: text({ mode: "json" }).$type<MessageEntity[]>(),
        file_id: text(),
        mark: int({ mode: "boolean" }),
    },
    (table) => [index("mark_idx").on(table.mark), index("type_idx").on(table.type)]
)
