const dotenv = require("dotenv");
const { createApp } = require("./app");
const { createTelegramBot } = require("./bot");
const { createLeadStore } = require("./db");

dotenv.config();

const port = Number(process.env.PORT) || 3000;
const databasePath = process.env.DATABASE_PATH || "./data/glavzaves.sqlite";
const adminUserIds = String(process.env.TELEGRAM_ADMIN_USER_IDS || "")
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);

const leadStore = createLeadStore({ databasePath });
const telegramBot = createTelegramBot({
  token: process.env.TELEGRAM_BOT_TOKEN,
  adminChatId: process.env.TELEGRAM_ADMIN_CHAT_ID,
  adminUserIds,
  leadStore
});
const app = createApp({ leadStore, telegramBot });

const server = app.listen(port, async () => {
  console.log(`Glavzaves server listening on http://localhost:${port}`);

  if (!telegramBot.enabled) {
    console.log("Telegram bot disabled: TELEGRAM_BOT_TOKEN is not set");
    return;
  }

  try {
    await telegramBot.start();
    console.log("Telegram bot started");
  } catch (error) {
    console.error("Telegram bot failed to start", error);
  }
});

function shutdown(signal) {
  console.log(`Received ${signal}, shutting down`);
  telegramBot.stop(signal);
  server.close(() => {
    leadStore.close();
    process.exit(0);
  });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
