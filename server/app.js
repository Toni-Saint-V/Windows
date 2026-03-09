const path = require("node:path");
const express = require("express");
const { normalizeLeadStatus } = require("./statuses");
const { ValidationError, validateLeadPayload, validateStatusUpdate } = require("./validation");

function createApp({ leadStore, telegramBot, staticRoot = path.resolve(__dirname, "..") }) {
  const app = express();

  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: false }));

  app.post("/api/leads", async (req, res, next) => {
    try {
      let lead = leadStore.createLead(validateLeadPayload(req.body));

      if (telegramBot?.notifyNewLead) {
        try {
          lead = await telegramBot.notifyNewLead(lead) || lead;
        } catch (error) {
          console.warn("Failed to notify Telegram about new lead", error.message);
        }
      }

      res.status(201).json({ lead });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/leads", (req, res, next) => {
    try {
      const leads = leadStore.listLeads({
        status: req.query.status ? normalizeLeadStatus(String(req.query.status)) || undefined : undefined,
        source: req.query.source ? String(req.query.source) : undefined,
        query: req.query.query ? String(req.query.query) : undefined,
        limit: req.query.limit ? Number(req.query.limit) : undefined
      });

      res.json({ leads });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/leads/:id", (req, res, next) => {
    try {
      const lead = leadStore.getLeadById(Number(req.params.id));
      if (!lead) {
        res.status(404).json({ error: "Lead not found" });
        return;
      }

      res.json({ lead });
    } catch (error) {
      next(error);
    }
  });

  app.patch("/api/leads/:id/status", async (req, res, next) => {
    try {
      const lead = leadStore.updateLeadStatus(Number(req.params.id), validateStatusUpdate(req.body));
      if (!lead) {
        res.status(404).json({ error: "Lead not found" });
        return;
      }

      if (telegramBot?.updateNotificationMessage) {
        try {
          await telegramBot.updateNotificationMessage(lead);
        } catch (error) {
          console.warn("Failed to sync Telegram message after status update", error.message);
        }
      }

      res.json({ lead });
    } catch (error) {
      next(error);
    }
  });

  app.use("/assets", express.static(path.join(staticRoot, "assets")));
  app.get("/", (req, res) => res.sendFile(path.join(staticRoot, "index.html")));
  app.get("/index.html", (req, res) => res.sendFile(path.join(staticRoot, "index.html")));

  app.use((error, req, res, next) => {
    if (error instanceof ValidationError) {
      res.status(400).json({
        error: error.message,
        details: error.details
      });
      return;
    }

    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  });

  return app;
}

module.exports = {
  createApp
};
