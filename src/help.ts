import { Composer, InlineKeyboard } from "grammy"

export const help = new Composer<MyContext>()

const inlineKeyboard = new InlineKeyboard()
    .switchInline("选择一个 Chat 开始")
    .switchInlineCurrent("让我们开始")
    .row()
    .url("仓库地址", "https://github.com/jiang-zhexin/yaibot")

help.command(["start", "help"], async (c) => {
    await c.reply(
        `*使用帮助*

*如何添加语录到 inline bot？*
把消息转发给我即可

*支持的消息类型*
1\\.文本
2\\.一张\\(带描述的\\)图片/gif/贴纸

*如何发送 inline 消息？*
点击下方按钮

*如何搜索 inline 消息？*
使用以下格式搜索: \`@yet_another_inline_bot \`\\[ \\< gif \\| photo \\| sticker \\> \\< KEYWORD \\> by \\< USERNAME \\> \\]`,
        { parse_mode: "MarkdownV2", reply_markup: inlineKeyboard }
    )
})
