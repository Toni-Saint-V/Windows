const { normalizeLeadStatus } = require("./statuses");

class ValidationError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = "ValidationError";
    this.details = details;
  }
}

function normalizeText(value, { maxLength = 5000 } = {}) {
  if (value === undefined || value === null) {
    return "";
  }

  return String(value).trim().slice(0, maxLength);
}

function normalizePhone(value) {
  const phone = normalizeText(value, { maxLength: 40 });
  const digits = phone.replace(/\D/g, "");

  if (digits.length < 10 || digits.length > 15) {
    throw new ValidationError("Некорректный телефон", { field: "phone" });
  }

  if (digits.length === 11 && digits.startsWith("8")) {
    return `+7${digits.slice(1)}`;
  }

  return `+${digits}`;
}

function validateName(value) {
  const name = normalizeText(value, { maxLength: 120 });
  if (name.length < 2) {
    throw new ValidationError("Имя обязательно", { field: "name" });
  }
  return name;
}

function normalizeStringArray(value, { maxLength = 50, itemMaxLength = 80 } = {}) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => normalizeText(item, { maxLength: itemMaxLength }))
    .filter(Boolean)
    .slice(0, maxLength);
}

function normalizeJsonObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : null;
}

function validateLeadPayload(payload = {}) {
  return {
    name: validateName(payload.name),
    phone: normalizePhone(payload.phone),
    objectType: normalizeText(payload.objectType, { maxLength: 120 }),
    comment: normalizeText(payload.comment, { maxLength: 2000 }),
    source: normalizeText(payload.source || "site_form", { maxLength: 64 }) || "site_form",
    calculatorData: normalizeJsonObject(payload.calculatorData),
    advisorData: normalizeJsonObject(payload.advisorData),
    projectTitle: normalizeText(payload.projectTitle, { maxLength: 180 }),
    projectTags: normalizeStringArray(payload.projectTags),
    status: normalizeLeadStatus(payload.status) || "new"
  };
}

function validateStatusUpdate(payload = {}) {
  const status = normalizeLeadStatus(payload.status);
  if (!status) {
    throw new ValidationError("Некорректный статус", { field: "status" });
  }

  return {
    status,
    actorType: normalizeText(payload.actorType || "api", { maxLength: 40 }) || "api",
    actorId: normalizeText(payload.actorId, { maxLength: 80 }),
    actorName: normalizeText(payload.actorName, { maxLength: 120 }),
    note: normalizeText(payload.note, { maxLength: 500 })
  };
}

module.exports = {
  ValidationError,
  normalizePhone,
  validateLeadPayload,
  validateStatusUpdate
};
