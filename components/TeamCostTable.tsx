'use client';

import { useMemo } from 'react';
import { toCurrency, toPersianDigits } from '@/lib/format';

export function TeamCostTable({ aggregates, invoices }: { aggregates: any, invoices: string[] }) {
  const teams = useMemo(() => {
    const s = new Set<string>();
    for (const inv of invoices) {
      const m = aggregates.byInvoiceTeam?.[inv] || {};
      Object.keys(m).forEach(t => s.add(t));
    }
    return Array.from(s);
  }, [aggregates, invoices]);

  const rows = teams.map(team => {
    const obj: any = { team, total: 0 };
    for (const inv of invoices) {
      const val = aggregates.byInvoiceTeam?.[inv]?.[team] ?? 0;
      obj[inv] = val;
      obj.total += val;
    }
    return obj;
  }).sort((a:any,b:any)=>b.total - a.total);

  const totalsRow = rows.reduce((acc:any, r:any) => {
    for (const inv of invoices) {
      acc[inv] = (acc[inv] ?? 0) + (r[inv] ?? 0);
    }
    acc.total = (acc.total ?? 0) + r.total;
    return acc;
  }, {});

  return (
    <div className="overflow-auto">
      <table className="min-w-[720px] w-full text-sm">
        <thead className="sticky top-0 bg-slate-50">
          <tr>
            <th className="text-right p-2">تیم</th>
            {invoices.map(inv => <th key={inv} className="text-left p-2">{inv}</th>)}
            <th className="text-left p-2">مجموع</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.team} className="odd:bg-white even:bg-slate-50/50">
              <td className="p-2 font-medium">{r.team}</td>
              {invoices.map(inv => <td key={inv} className="p-2">{toPersianDigits(toCurrency(r[inv]))}</td>)}
              <td className="p-2 font-semibold">{toPersianDigits(toCurrency(r.total))}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="bg-slate-100 font-semibold">
            <td className="p-2">جمع کل</td>
            {invoices.map(inv => <td key={inv} className="p-2">{toPersianDigits(toCurrency(totalsRow[inv] ?? 0))}</td>)}
            <td className="p-2">{toPersianDigits(toCurrency(totalsRow.total ?? 0))}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
