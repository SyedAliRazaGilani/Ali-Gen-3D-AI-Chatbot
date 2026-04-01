/** Remove parenthetical segments that contain a year (typical date ranges) from work role text. */
export function workRoleWithoutDates(summary) {
  if (!summary?.trim()) return "";
  return summary
    .trim()
    .replace(/\s*\([^)]*\d{4}[^)]*\)/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
