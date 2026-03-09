const fs = require("node:fs");
const path = require("node:path");
const Database = require("better-sqlite3");
const { getLeadStatusLabel } = require("./statuses");

function ensureDirectoryForFile(filePath) {
  if (!filePath || filePath === ":memory:") {
    return;
  }

  fs.mkdirSync(path.dirname(path.resolve(filePath)), { recursive: true });
}

function parseJson(value, fallback) {
  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function serializeJson(value) {
  return value ? JSON.stringify(value) : null;
}

function mapLeadRow(row) {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    objectType: row.object_type || "",
    comment: row.comment || "",
    source: row.source,
    calculatorData: parseJson(row.calculator_data, null),
    advisorData: parseJson(row.advisor_data, null),
    projectTitle: row.project_title || "",
    projectTags: parseJson(row.project_tags, []),
    status: row.status,
    statusLabel: getLeadStatusLabel(row.status),
    telegramChatId: row.telegram_chat_id || "",
    telegramMessageId: row.telegram_message_id || "",
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function createLeadStore({ databasePath }) {
  ensureDirectoryForFile(databasePath);
  const db = new Database(databasePath || ":memory:");
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  db.exec(`
    CREATE TABLE IF NOT EXISTS leads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      phone_normalized TEXT NOT NULL,
      object_type TEXT,
      comment TEXT,
      source TEXT NOT NULL DEFAULT 'site_form',
      calculator_data TEXT,
      advisor_data TEXT,
      project_title TEXT,
      project_tags TEXT,
      status TEXT NOT NULL DEFAULT 'new',
      telegram_chat_id TEXT,
      telegram_message_id TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
    CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_leads_phone ON leads(phone_normalized);
    CREATE INDEX IF NOT EXISTS idx_leads_name ON leads(name);

    CREATE TABLE IF NOT EXISTS lead_status_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      lead_id INTEGER NOT NULL,
      status TEXT NOT NULL,
      actor_type TEXT NOT NULL DEFAULT 'system',
      actor_id TEXT,
      actor_name TEXT,
      note TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_lead_status_history_lead_id
      ON lead_status_history(lead_id, created_at DESC);
  `);

  const insertLeadStatement = db.prepare(`
    INSERT INTO leads (
      name,
      phone,
      phone_normalized,
      object_type,
      comment,
      source,
      calculator_data,
      advisor_data,
      project_title,
      project_tags,
      status,
      created_at,
      updated_at
    ) VALUES (
      @name,
      @phone,
      @phoneNormalized,
      @objectType,
      @comment,
      @source,
      @calculatorData,
      @advisorData,
      @projectTitle,
      @projectTags,
      @status,
      @createdAt,
      @updatedAt
    )
  `);

  const insertStatusHistoryStatement = db.prepare(`
    INSERT INTO lead_status_history (
      lead_id,
      status,
      actor_type,
      actor_id,
      actor_name,
      note,
      created_at
    ) VALUES (
      @leadId,
      @status,
      @actorType,
      @actorId,
      @actorName,
      @note,
      @createdAt
    )
  `);

  const updateLeadStatusStatement = db.prepare(`
    UPDATE leads
    SET status = @status, updated_at = @updatedAt
    WHERE id = @id
  `);

  const attachTelegramMessageStatement = db.prepare(`
    UPDATE leads
    SET telegram_chat_id = @chatId,
        telegram_message_id = @messageId,
        updated_at = @updatedAt
    WHERE id = @id
  `);

  function getStatusHistory(leadId) {
    return db
      .prepare(`
        SELECT id, lead_id, status, actor_type, actor_id, actor_name, note, created_at
        FROM lead_status_history
        WHERE lead_id = ?
        ORDER BY created_at DESC, id DESC
      `)
      .all(leadId)
      .map((row) => ({
        id: row.id,
        leadId: row.lead_id,
        status: row.status,
        statusLabel: getLeadStatusLabel(row.status),
        actorType: row.actor_type,
        actorId: row.actor_id || "",
        actorName: row.actor_name || "",
        note: row.note || "",
        createdAt: row.created_at
      }));
  }

  function getLeadById(id) {
    const lead = mapLeadRow(
      db.prepare("SELECT * FROM leads WHERE id = ?").get(id)
    );

    if (!lead) {
      return null;
    }

    return {
      ...lead,
      statusHistory: getStatusHistory(id)
    };
  }

  function createLead(input) {
    const createdAt = new Date().toISOString();
    const payload = {
      ...input,
      phoneNormalized: input.phone.replace(/\D/g, ""),
      calculatorData: serializeJson(input.calculatorData),
      advisorData: serializeJson(input.advisorData),
      projectTags: serializeJson(input.projectTags),
      createdAt,
      updatedAt: createdAt
    };

    const transaction = db.transaction(() => {
      const result = insertLeadStatement.run(payload);
      insertStatusHistoryStatement.run({
        leadId: result.lastInsertRowid,
        status: input.status,
        actorType: "system",
        actorId: "",
        actorName: "system",
        note: "Lead created",
        createdAt
      });

      return Number(result.lastInsertRowid);
    });

    return getLeadById(transaction());
  }

  function listLeads({ status, source, query, limit = 50 } = {}) {
    const conditions = [];
    const values = {};

    if (status) {
      conditions.push("status = @status");
      values.status = status;
    }

    if (source) {
      conditions.push("source = @source");
      values.source = source;
    }

    if (query) {
      conditions.push("(name LIKE @query OR phone_normalized LIKE @digits)");
      values.query = `%${query.trim()}%`;
      values.digits = `%${query.replace(/\D/g, "")}%`;
    }

    values.limit = Math.max(1, Math.min(Number(limit) || 50, 200));

    const sql = `
      SELECT *
      FROM leads
      ${conditions.length ? `WHERE ${conditions.join(" AND ")}` : ""}
      ORDER BY created_at DESC, id DESC
      LIMIT @limit
    `;

    return db.prepare(sql).all(values).map(mapLeadRow);
  }

  function updateLeadStatus(id, update) {
    const currentLead = getLeadById(id);
    if (!currentLead) {
      return null;
    }

    if (currentLead.status === update.status) {
      return currentLead;
    }

    const updatedAt = new Date().toISOString();

    const transaction = db.transaction(() => {
      updateLeadStatusStatement.run({
        id,
        status: update.status,
        updatedAt
      });

      insertStatusHistoryStatement.run({
        leadId: id,
        status: update.status,
        actorType: update.actorType || "api",
        actorId: update.actorId || "",
        actorName: update.actorName || "",
        note: update.note || "",
        createdAt: updatedAt
      });
    });

    transaction();
    return getLeadById(id);
  }

  function attachTelegramMessage(id, { chatId, messageId }) {
    attachTelegramMessageStatement.run({
      id,
      chatId: String(chatId),
      messageId: String(messageId),
      updatedAt: new Date().toISOString()
    });

    return getLeadById(id);
  }

  function searchLeadsByPhone(phoneQuery, limit = 10) {
    const digits = String(phoneQuery || "").replace(/\D/g, "");
    if (!digits) {
      return [];
    }

    return db
      .prepare(`
        SELECT *
        FROM leads
        WHERE phone_normalized LIKE ?
        ORDER BY created_at DESC, id DESC
        LIMIT ?
      `)
      .all(`%${digits}%`, Math.max(1, Math.min(Number(limit) || 10, 50)))
      .map(mapLeadRow);
  }

  function searchLeadsByName(nameQuery, limit = 10) {
    const query = String(nameQuery || "").trim();
    if (!query) {
      return [];
    }

    return db
      .prepare(`
        SELECT *
        FROM leads
        WHERE name LIKE ?
        ORDER BY created_at DESC, id DESC
        LIMIT ?
      `)
      .all(`%${query}%`, Math.max(1, Math.min(Number(limit) || 10, 50)))
      .map(mapLeadRow);
  }

  function close() {
    db.close();
  }

  return {
    attachTelegramMessage,
    close,
    createLead,
    getLeadById,
    listLeads,
    searchLeadsByName,
    searchLeadsByPhone,
    updateLeadStatus
  };
}

module.exports = {
  createLeadStore
};
