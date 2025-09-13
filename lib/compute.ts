import type { Aggregates } from './parse';

export function totalsByTeamAcrossInvoices(ag: Aggregates, invoices: string[]) {
  const out: Record<string, number> = {};
  for (const inv of invoices) {
    const t = ag.byInvoiceTeam[inv] || {};
    for (const [team, val] of Object.entries(t)) {
      out[team] = (out[team] ?? 0) + (val ?? 0);
    }
  }
  return out;
}

export function tasksByTeamAcrossInvoices(ag: Aggregates, invoices: string[], teamFilter: string[]) {
  const out: Record<string, number> = {};
  for (const inv of invoices) {
    const perTeam = ag.byInvoiceTeamTask[inv] || {};
    for (const team of Object.keys(perTeam)) {
      if (teamFilter.length && !teamFilter.includes(team)) continue;
      const taskMap = perTeam[team] || {};
      for (const [task, val] of Object.entries(taskMap)) {
        out[task] = (out[task] ?? 0) + (val ?? 0);
      }
    }
  }
  return out;
}
