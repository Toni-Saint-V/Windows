const LEAD_STATUS_DEFINITIONS = {
  new: { code: "new", label: "Новый", actionLabel: "Новый" },
  accepted: { code: "accepted", label: "Принят", actionLabel: "Принять" },
  contacted: { code: "contacted", label: "Связались", actionLabel: "Связались" },
  survey: { code: "survey", label: "Замер", actionLabel: "Замер" },
  in_progress: { code: "in_progress", label: "В работу", actionLabel: "В работу" },
  completed: { code: "completed", label: "Завершено", actionLabel: "Завершено" },
  rejected: { code: "rejected", label: "Нецелевой", actionLabel: "Нецелевой" }
};

const STATUS_BUTTON_ORDER = ["accepted", "contacted", "survey", "in_progress", "completed", "rejected"];

function normalizeLeadStatus(input) {
  if (!input) {
    return null;
  }

  const normalized = String(input).trim().toLowerCase();
  const byCode = LEAD_STATUS_DEFINITIONS[normalized];
  if (byCode) {
    return byCode.code;
  }

  const byLabel = Object.values(LEAD_STATUS_DEFINITIONS).find(
    (status) => status.label.toLowerCase() === normalized || status.actionLabel.toLowerCase() === normalized
  );

  return byLabel ? byLabel.code : null;
}

function getLeadStatusMeta(status) {
  return LEAD_STATUS_DEFINITIONS[normalizeLeadStatus(status) || "new"] || LEAD_STATUS_DEFINITIONS.new;
}

function getLeadStatusLabel(status) {
  return getLeadStatusMeta(status).label;
}

module.exports = {
  LEAD_STATUS_DEFINITIONS,
  STATUS_BUTTON_ORDER,
  getLeadStatusLabel,
  getLeadStatusMeta,
  normalizeLeadStatus
};
