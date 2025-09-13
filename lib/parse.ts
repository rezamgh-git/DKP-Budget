export type Aggregates = {
  invoices: string[];
  teams: string[];
  lastUpdated: string;
  byInvoiceTeam: Record<string, Record<string, number>>;
  byInvoiceTeamTask: Record<string, Record<string, Record<string, number>>>;
  payoutsByInvoice: Record<string, number>;
  deductionsByInvoice: Record<string, number>;
  receivablesByInvoice: Record<string, number>;
};

function sumNumeric(arr: (string | number | undefined)[]): number {
  let s = 0;
  for (const v of arr) {
    const n = Number(String(v ?? '').replaceAll(',', '').trim());
    if (!Number.isNaN(n)) s += n;
  }
  return s;
}

export function detectTaskRange(values: any[][]) {
  const header0 = values[0] ?? [];
  const header1 = values[1] ?? [];
  const start = 15; // P
  let end = Math.max(header0.length, header1.length) - 1;
  for (let i = end; i >= start; i--) {
    const h0 = String(header0[i] ?? '').trim();
    const h1 = String(header1[i] ?? '').trim();
    if (h0 || h1) { end = i; break; }
  }
  return { start, end };
}

export function buildHeaderMaps(values: any[][], start: number, end: number) {
  const header0 = values[0] ?? [];
  const header1 = values[1] ?? [];
  const colToTeam = new Map<number, string>();
  const colToTask = new Map<number, string>();
  const teamsSet = new Set<string>();

  for (let c = start; c <= end; c++) {
    const team = String(header0[c] ?? '').trim() || 'نامشخص';
    const task = String(header1[c] ?? '').trim() || `کار ${c - start + 1}`;
    colToTeam.set(c, team);
    colToTask.set(c, task);
    teamsSet.add(team);
  }
  return { colToTeam, colToTask, teams: Array.from(teamsSet) };
}

export function parseSheet(values: any[][], lastUpdated: string, includeDeductions = false, includeReceivables = false): Aggregates {
  if (!values || values.length < 3) {
    return {
      invoices: [], teams: [], lastUpdated,
      byInvoiceTeam: {}, byInvoiceTeamTask: {},
      payoutsByInvoice: {}, deductionsByInvoice: {}, receivablesByInvoice: {}
    };
  }
  const { start, end } = detectTaskRange(values);
  const { colToTeam, colToTask, teams } = buildHeaderMaps(values, start, end);

  const byInvoiceTeam: Aggregates['byInvoiceTeam'] = {};
  const byInvoiceTeamTask: Aggregates['byInvoiceTeamTask'] = {};
  const payoutsByInvoice: Aggregates['payoutsByInvoice'] = {};
  const deductionsByInvoice: Aggregates['deductionsByInvoice'] = {};
  const receivablesByInvoice: Aggregates['receivablesByInvoice'] = {};
  const invoicesSet = new Set<string>();

  for (let r = 2; r < values.length; r += 2) {
    const rowA = values[r] ?? [];
    const rowB = values[r + 1] ?? [];
    const invA = String(rowA[6] ?? '').trim();
    const invB = String(rowB[6] ?? '').trim();
    const invoice = invA || invB || `ردیف-${r}`;
    invoicesSet.add(invoice);

    const tasksSliceA = rowA.slice(start, end + 1);
    const tasksSliceB = rowB.slice(start, end + 1);
    const sumA = sumNumeric(tasksSliceA);
    const sumB = sumNumeric(tasksSliceB);

    const taskRow = sumA >= sumB ? rowA : rowB;
    const payoutRow = sumA >= sumB ? rowB : rowA;

    for (let c = start; c <= end; c++) {
      const raw = taskRow[c];
      const n = Number(String(raw ?? '').replaceAll(',', '').trim());
      if (Number.isFinite(n) && n !== 0) {
        const team = colToTeam.get(c)!;
        const task = colToTask.get(c)!;
        byInvoiceTeam[invoice] = byInvoiceTeam[invoice] || {};
        byInvoiceTeam[invoice][team] = (byInvoiceTeam[invoice][team] ?? 0) + n;

        byInvoiceTeamTask[invoice] = byInvoiceTeamTask[invoice] || {};
        byInvoiceTeamTask[invoice][team] = byInvoiceTeamTask[invoice][team] || {};
        byInvoiceTeamTask[invoice][team][task] = (byInvoiceTeamTask[invoice][team][task] ?? 0) + n;
      }
    }

    const payout = Number(String(payoutRow[9] ?? '').replaceAll(',', '').trim());
    if (!Number.isNaN(payout)) {
      payoutsByInvoice[invoice] = (payoutsByInvoice[invoice] ?? 0) + payout;
    }

    const ded = sumNumeric([payoutRow[11], payoutRow[12], payoutRow[13]]);
    if (!Number.isNaN(ded)) {
      deductionsByInvoice[invoice] = (deductionsByInvoice[invoice] ?? 0) + ded;
    }

    const rec = Number(String(payoutRow[14] ?? '').replaceAll(',', '').trim());
    if (!Number.isNaN(rec)) {
      receivablesByInvoice[invoice] = (receivablesByInvoice[invoice] ?? 0) + rec;
    }
  }

  if (includeDeductions) {
    for (const inv of Object.keys(deductionsByInvoice)) {
      const total = deductionsByInvoice[inv];
      if (total && total !== 0) {
        byInvoiceTeam[inv] = byInvoiceTeam[inv] || {};
        byInvoiceTeam[inv]['کسورات'] = (byInvoiceTeam[inv]['کسورات'] ?? 0) + total;
      }
    }
  }
  if (includeReceivables) {
    for (const inv of Object.keys(receivablesByInvoice)) {
      const total = receivablesByInvoice[inv];
      if (total && total !== 0) {
        byInvoiceTeam[inv] = byInvoiceTeam[inv] || {};
        byInvoiceTeam[inv]['بدهی‌ها'] = (byInvoiceTeam[inv]['بدهی‌ها'] ?? 0) + total;
      }
    }
  }

  return {
    invoices: Array.from(invoicesSet),
    teams,
    lastUpdated,
    byInvoiceTeam,
    byInvoiceTeamTask,
    payoutsByInvoice,
    deductionsByInvoice,
    receivablesByInvoice
  };
}
