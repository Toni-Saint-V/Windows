const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");
const { createApp } = require("../server/app");
const { createLeadStore } = require("../server/db");

test("lead API stores and updates leads with history", async (t) => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "glavzaves-"));
  const databasePath = path.join(tmpDir, "test.sqlite");
  const leadStore = createLeadStore({ databasePath });
  const telegramBot = {
    notifyNewLead: async () => null,
    updateNotificationMessage: async () => null
  };
  const app = createApp({ leadStore, telegramBot, staticRoot: path.resolve(__dirname, "..") });

  t.after(() => {
    leadStore.close();
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  const createResponse = await request(app)
    .post("/api/leads")
    .send({
      name: "Иван",
      phone: "+7 (991) 809-71-34",
      objectType: "Веранда",
      comment: "Тестовая заявка",
      source: "calculator",
      calculatorData: {
        objectType: "Веранда",
        size: "3x4 м",
        seasonality: "Круглый год",
        installation: "Да",
        estimate: {
          title: "Ориентир",
          messageResult: "100 000 - 140 000 ₽"
        }
      },
      projectTitle: "Панорамная терраса",
      projectTags: ["Терраса", "Панорама"]
    })
    .expect(201);

  const createdPayload = createResponse.body;
  assert.equal(createdPayload.lead.name, "Иван");
  assert.equal(createdPayload.lead.status, "new");
  assert.equal(createdPayload.lead.projectTitle, "Панорамная терраса");

  const updateResponse = await request(app)
    .patch(`/api/leads/${createdPayload.lead.id}/status`)
    .send({
      status: "completed",
      actorType: "test",
      actorName: "node:test"
    })
    .expect(200);

  const updatedPayload = updateResponse.body;
  assert.equal(updatedPayload.lead.status, "completed");

  const getResponse = await request(app)
    .get(`/api/leads/${createdPayload.lead.id}`)
    .expect(200);
  const leadPayload = getResponse.body;

  assert.equal(leadPayload.lead.statusHistory.length, 2);
  assert.equal(leadPayload.lead.statusHistory[0].status, "completed");
  assert.equal(leadPayload.lead.statusHistory[1].status, "new");

  const listResponse = await request(app)
    .get("/api/leads?status=completed")
    .expect(200);
  const listPayload = listResponse.body;
  assert.equal(listPayload.leads.length, 1);
});
