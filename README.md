# Yet Another Inline Bot

快速体验 [@yet_another_inline_bot](https://t.me/yet_another_inline_bot)

## 部署

在 `.env` 中写入如下内容：

```env
BOT_TOKEN = ""
WEB_HOOK = "https://your-web-hook"
SECRET_TOKEN = "your-web-hook-token"
```

创建你的 d1 数据库，name 为 inline，并复制 database_id 到 `wrangler.jsonc` 对应位置。

随后运行：

```bash
# set bot
npm run scripts/get_me.ts
npm run scripts/set_webhook.ts
npm run scripts/set_my_command.ts

npm run types
npm run deploy
```

## 开发指南

### db

如果你修改了 `./src/db/schema.ts`，则需运行：

```bash
npm run generate
```

以迁移数据库。

### wrangler

如果你修改了 `wrangler.jsonc` / `.env` 或者升级了 wrangler 的版本，则需运行：

```bash
npm run types
```
