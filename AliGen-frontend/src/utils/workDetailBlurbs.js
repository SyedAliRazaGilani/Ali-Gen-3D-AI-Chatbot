/**
 * Detail lines for Work cards (not sent to the chat LLM). All entries are shown as bullets.
 * Matched by title substring from portfolio.md Work Experience lines.
 */
export function getWorkDetailBullets(title) {
  const t = (title || "").toLowerCase();

  if (t.includes("fioneer") || (t.includes("sap") && t.includes("fione"))) {
    return [
      "Driving technology consulting initiatives across enterprise finance workflows with a focus on scalable implementation and delivery quality.",
      "Partnering with business and engineering teams to translate complex requirements into practical, production-ready solutions.",
    ];
  }
  if (t.includes("brunel")) {
    return [
      "Conducted applied machine learning research, including model experimentation, evaluation, and comparative analysis for dissertation outcomes.",
      "Built reproducible research workflows with clear documentation of assumptions, metrics, and model behavior across experiments.",
    ];
  }
  if (t.includes("i2c")) {
    return [
      "Worked on product insights tooling to improve visibility into user behavior, performance trends, and decision-making metrics.",
      "Collaborated cross-functionally to ship reliable internal features supporting product and business analytics.",
    ];
  }
  if (t.includes("ragzon")) {
    return [
      "Built and maintained client-facing software features in a remote-first environment with fast iteration cycles.",
      "Improved delivery consistency through better code quality practices, communication loops, and release coordination.",
    ];
  }
  if (t.includes("sochtak") || t.includes("soch tak") || t.includes("sochtek")) {
    return [
      "Built and maintained client-facing software features in a remote-first environment with fast iteration cycles.",
      "Improved delivery consistency through better code quality practices, communication loops, and release coordination.",
    ];
  }

  return [];
}
