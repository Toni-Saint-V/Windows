const { Markup, Telegraf } = require("telegraf");
const { formatLeadList, formatLeadNotification } = require("./formatter");
const { STATUS_BUTTON_ORDER, getLeadStatusMeta, normalizeLeadStatus } = require("./statuses");

const SITE_URL = "https://glavzaves-okna.ru";
const CLIENT_REPLY_BUTTONS = [
  ["📐 Рассчитать стоимость", "🏡 Подобрать решение"],
  ["📷 Отправить фото объекта", "☎️ Связаться с менеджером"]
];

function parseCommandArgument(text = "") {
  const parts = text.trim().split(/\s+/);
  parts.shift();
  return parts.join(" ").trim();
}

function createStatusKeyboard(leadId, currentStatus) {
  return Markup.inlineKeyboard(
    STATUS_BUTTON_ORDER.map((statusCode) => {
      const meta = getLeadStatusMeta(statusCode);
      const isActive = currentStatus === meta.code;
      return Markup.button.callback(
        `${isActive ? "• " : ""}${meta.actionLabel}`,
        `lead_status:${leadId}:${meta.code}`
      );
    }),
    { columns: 2 }
  );
}

function createClientReplyKeyboard() {
  return Markup.keyboard(CLIENT_REPLY_BUTTONS).resize();
}

function createTelegramBot({ token, adminChatId, adminUserIds, leadStore, logger = console }) {
  const enabled = Boolean(token);
  const admins = new Set((adminUserIds || []).map((value) => String(value)));

  if (!enabled) {
    return {
      enabled: false,
      notifyNewLead: async () => null,
      start: async () => false,
      stop: () => {}
    };
  }

  const bot = new Telegraf(token);

  function isAdminContext(ctx) {
    const userId = ctx.from?.id ? String(ctx.from.id) : "";
    const chatId = ctx.chat?.id
      ? String(ctx.chat.id)
      : ctx.callbackQuery?.message?.chat?.id
        ? String(ctx.callbackQuery.message.chat.id)
        : "";

    if (admins.size) {
      return admins.has(userId);
    }

    if (adminChatId) {
      return chatId === String(adminChatId);
    }

    return false;
  }

  function adminOnly(handler) {
    return async (ctx) => {
      if (!isAdminContext(ctx)) {
        if ("answerCbQuery" in ctx) {
          await ctx.answerCbQuery("Доступ только для администраторов", { show_alert: true });
          return;
        }

        await ctx.reply("Доступ только для администраторов.");
        return;
      }

      return handler(ctx);
    };
  }

  async function replyWithClientKeyboard(ctx, text) {
    await ctx.reply(text, createClientReplyKeyboard());
  }

  async function replyWithLead(ctx, lead) {
    if (!lead) {
      await ctx.reply("Заявка не найдена.");
      return;
    }

    await ctx.replyWithHTML(formatLeadNotification(lead), {
      reply_markup: createStatusKeyboard(lead.id, lead.status).reply_markup
    });
  }

  async function updateNotificationMessage(lead, currentMessageRef) {
    const markup = createStatusKeyboard(lead.id, lead.status).reply_markup;
    const text = formatLeadNotification(lead);
    const targets = [];

    if (lead.telegramChatId && lead.telegramMessageId) {
      targets.push({
        chatId: lead.telegramChatId,
        messageId: lead.telegramMessageId
      });
    }

    if (currentMessageRef) {
      const isDuplicate = targets.some(
        (target) =>
          String(target.chatId) === String(currentMessageRef.chatId) &&
          String(target.messageId) === String(currentMessageRef.messageId)
      );

      if (!isDuplicate) {
        targets.push(currentMessageRef);
      }
    }

    for (const target of targets) {
      try {
        await bot.telegram.editMessageText(target.chatId, target.messageId, undefined, text, {
          parse_mode: "HTML",
          reply_markup: markup
        });
      } catch (error) {
        logger.warn("Failed to update Telegram message", {
          leadId: lead.id,
          chatId: target.chatId,
          messageId: target.messageId,
          error: error.message
        });
      }
    }
  }

  bot.start(async (ctx) => {
    if (isAdminContext(ctx)) {
      await ctx.reply("Glavzaves lead bot активен. /help покажет доступные команды.");
      return;
    }

    await replyWithClientKeyboard(
      ctx,
      [
        "Glavzaves на связи.",
        "Выберите действие на клавиатуре ниже, и я подскажу следующий шаг."
      ].join("\n")
    );
  });

  bot.help(async (ctx) => {
    if (isAdminContext(ctx)) {
      await ctx.reply([
        "Команды:",
        "/leads - последние заявки",
        "/new - новые заявки",
        "/lead_123 - открыть заявку по ID",
        "/search_phone 7991 - поиск по телефону",
        "/search_name Иван - поиск по имени"
      ].join("\n"));
      return;
    }

    await replyWithClientKeyboard(
      ctx,
      "Доступные действия показаны на клавиатуре ниже. Для расчета, подбора и заявки с сайта используйте кнопки или формы на лендинге."
    );
  });

  bot.command("leads", adminOnly(async (ctx) => {
    const arg = parseCommandArgument(ctx.message.text);
    const status = normalizeLeadStatus(arg);
    const leads = leadStore.listLeads({ status: status || undefined, limit: 10 });
    await ctx.reply(formatLeadList(leads, status ? `Последние заявки со статусом ${getLeadStatusMeta(status).label}` : "Последние заявки"));
  }));

  bot.command("new", adminOnly(async (ctx) => {
    const leads = leadStore.listLeads({ status: "new", limit: 10 });
    await ctx.reply(formatLeadList(leads, "Новые заявки"));
  }));

  bot.command("search_phone", adminOnly(async (ctx) => {
    const query = parseCommandArgument(ctx.message.text);
    if (!query) {
      await ctx.reply("Использование: /search_phone 79918097134");
      return;
    }

    const leads = leadStore.searchLeadsByPhone(query, 10);
    await ctx.reply(formatLeadList(leads, `Поиск по телефону: ${query}`));
  }));

  bot.command("search_name", adminOnly(async (ctx) => {
    const query = parseCommandArgument(ctx.message.text);
    if (!query) {
      await ctx.reply("Использование: /search_name Иван");
      return;
    }

    const leads = leadStore.searchLeadsByName(query, 10);
    await ctx.reply(formatLeadList(leads, `Поиск по имени: ${query}`));
  }));

  bot.hears(/^\/lead_(\d+)(?:@[\w_]+)?$/i, adminOnly(async (ctx) => {
    const leadId = Number(ctx.match[1]);
    const lead = leadStore.getLeadById(leadId);
    await replyWithLead(ctx, lead);
  }));

  bot.hears("📐 Рассчитать стоимость", async (ctx) => {
    if (isAdminContext(ctx)) {
      await ctx.reply("Для списка лидов используйте /leads или /new.");
      return;
    }

    await replyWithClientKeyboard(
      ctx,
      `Откройте калькулятор на сайте: ${SITE_URL}/#smart-calculator\nЕсли расчет не отправится в backend, сайт сохранит fallback в Telegram share.`
    );
  });

  bot.hears("🏡 Подобрать решение", async (ctx) => {
    if (isAdminContext(ctx)) {
      await ctx.reply("Для поиска лидов используйте /search_name или /search_phone.");
      return;
    }

    await replyWithClientKeyboard(
      ctx,
      `Подбор сценария доступен на сайте: ${SITE_URL}/#smart-object-advisor\nПосле отправки сайт передаст lead менеджеру.`
    );
  });

  bot.hears("📷 Отправить фото объекта", async (ctx) => {
    if (isAdminContext(ctx)) {
      await ctx.reply("Inline-статусы меняются кнопками под карточкой лида.");
      return;
    }

    await replyWithClientKeyboard(
      ctx,
      "Пришлите фото объекта следующим сообщением и добавьте телефон в подписи или отдельным сообщением. Менеджер сможет уточнить детали после просмотра."
    );
  });

  bot.hears("☎️ Связаться с менеджером", async (ctx) => {
    if (isAdminContext(ctx)) {
      await ctx.reply("Открыть конкретную заявку: /lead_123");
      return;
    }

    await replyWithClientKeyboard(
      ctx,
      `Оставьте имя и телефон на сайте: ${SITE_URL}/#lead-form\nЕсли удобнее, сразу отправьте сюда номер и короткое описание объекта.`
    );
  });

  bot.on("photo", async (ctx, next) => {
    if (isAdminContext(ctx)) {
      await next();
      return;
    }

    if (adminChatId) {
      try {
        await bot.telegram.sendMessage(
          String(adminChatId),
          [
            "Новый Telegram-запрос с фото.",
            `Пользователь: ${ctx.from?.first_name || ""} ${ctx.from?.last_name || ""}`.trim(),
            ctx.from?.username ? `Username: @${ctx.from.username}` : "",
            ctx.from?.id ? `User ID: ${ctx.from.id}` : ""
          ].filter(Boolean).join("\n")
        );
        await bot.telegram.forwardMessage(String(adminChatId), ctx.chat.id, ctx.message.message_id);
      } catch (error) {
        logger.warn("Failed to forward client photo", { error: error.message });
      }
    }

    await replyWithClientKeyboard(
      ctx,
      "Фото получили. Добавьте адрес, размеры или телефон следующим сообщением, чтобы менеджер быстрее подготовил ответ."
    );
  });

  bot.action(/^lead_status:(\d+):([a-z_]+)$/i, adminOnly(async (ctx) => {
    const leadId = Number(ctx.match[1]);
    const status = normalizeLeadStatus(ctx.match[2]);

    if (!status) {
      await ctx.answerCbQuery("Некорректный статус", { show_alert: true });
      return;
    }

    const lead = leadStore.updateLeadStatus(leadId, {
      status,
      actorType: "telegram",
      actorId: String(ctx.from.id),
      actorName: [ctx.from.first_name, ctx.from.last_name].filter(Boolean).join(" ") || ctx.from.username || "telegram-admin",
      note: "Updated from Telegram inline action"
    });

    if (!lead) {
      await ctx.answerCbQuery("Заявка не найдена", { show_alert: true });
      return;
    }

    await updateNotificationMessage(lead, {
      chatId: ctx.callbackQuery.message.chat.id,
      messageId: ctx.callbackQuery.message.message_id
    });
    await ctx.answerCbQuery(`Статус: ${lead.statusLabel}`);
  }));

  async function notifyNewLead(lead) {
    if (!adminChatId) {
      return null;
    }

    const sent = await bot.telegram.sendMessage(String(adminChatId), formatLeadNotification(lead), {
      parse_mode: "HTML",
      reply_markup: createStatusKeyboard(lead.id, lead.status).reply_markup
    });

    return leadStore.attachTelegramMessage(lead.id, {
      chatId: sent.chat.id,
      messageId: sent.message_id
    });
  }

  async function start() {
    await bot.launch();
    return true;
  }

  function stop(reason) {
    bot.stop(reason);
  }

  return {
    enabled: true,
    notifyNewLead,
    start,
    stop,
    updateNotificationMessage
  };
}

module.exports = {
  createTelegramBot
};
