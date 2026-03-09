const { getLeadStatusLabel } = require("./statuses");

const SOURCE_LABELS = {
  site_form: "Форма на сайте",
  calculator: "Калькулятор",
  advisor: "Подбор сценария",
  project_viewer: "CTA проекта"
};

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function formatSource(source) {
  return SOURCE_LABELS[source] || source || "Не указан";
}

function compactValue(value, fallback = "Не указано") {
  return value ? escapeHtml(value) : fallback;
}

function formatCalculatorSummary(calculatorData) {
  if (!calculatorData) {
    return "";
  }

  const estimate = calculatorData.estimate || calculatorData.result || {};
  const lines = [
    "<b>Калькулятор</b>",
    `• Объект: ${compactValue(calculatorData.objectType)}`,
    `• Размер: ${compactValue(calculatorData.size)}`,
    `• Сезонность: ${compactValue(calculatorData.seasonality)}`,
    `• Монтаж: ${compactValue(calculatorData.installation)}`,
    estimate.messageResult ? `• Итог: ${escapeHtml(estimate.messageResult)}` : "",
    estimate.title ? `• Заголовок: ${escapeHtml(estimate.title)}` : ""
  ].filter(Boolean);

  return lines.join("\n");
}

function formatAdvisorSummary(advisorData) {
  if (!advisorData) {
    return "";
  }

  const recommendation = advisorData.recommendation || {};
  const lines = [
    "<b>Подбор</b>",
    `• Объект: ${compactValue(advisorData.objectType)}`,
    `• Приоритет: ${compactValue(advisorData.priority)}`,
    `• Опции: ${advisorData.options?.length ? escapeHtml(advisorData.options.join(", ")) : "Без доп. пожеланий"}`,
    recommendation.title ? `• Сценарий: ${escapeHtml(recommendation.title)}` : "",
    recommendation.options?.length ? `• Рекомендации: ${escapeHtml(recommendation.options.join(", "))}` : ""
  ].filter(Boolean);

  return lines.join("\n");
}

function formatProjectSummary(lead) {
  if (!lead.projectTitle && !lead.projectTags?.length) {
    return "";
  }

  return [
    "<b>Проект</b>",
    lead.projectTitle ? `• Название: ${escapeHtml(lead.projectTitle)}` : "",
    lead.projectTags?.length ? `• Теги: ${escapeHtml(lead.projectTags.join(", "))}` : ""
  ].filter(Boolean).join("\n");
}

function formatLeadNotification(lead) {
  return [
    `<b>Новая заявка #${lead.id}</b>`,
    `<b>Статус:</b> ${escapeHtml(getLeadStatusLabel(lead.status))}`,
    `<b>Имя:</b> ${compactValue(lead.name)}`,
    `<b>Телефон:</b> ${compactValue(lead.phone)}`,
    `<b>Тип объекта:</b> ${compactValue(lead.objectType)}`,
    lead.comment ? `<b>Комментарий:</b> ${escapeHtml(lead.comment)}` : "",
    `<b>Источник:</b> ${escapeHtml(formatSource(lead.source))}`,
    formatCalculatorSummary(lead.calculatorData),
    formatAdvisorSummary(lead.advisorData),
    formatProjectSummary(lead),
    `<b>Создано:</b> ${escapeHtml(new Date(lead.createdAt).toLocaleString("ru-RU"))}`
  ].filter(Boolean).join("\n\n");
}

function formatLeadList(leads, title) {
  if (!leads.length) {
    return `${title}\n\nСовпадений нет.`;
  }

  return [
    title,
    "",
    ...leads.map((lead) => `#${lead.id} • ${lead.statusLabel} • ${lead.name} • ${lead.phone} • ${formatSource(lead.source)}`)
  ].join("\n");
}

module.exports = {
  formatLeadList,
  formatLeadNotification
};
