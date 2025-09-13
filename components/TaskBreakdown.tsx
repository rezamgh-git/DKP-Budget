'use client';

import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { toCurrency, toPersianDigits } from '@/lib/format';

export function TaskBreakdown({ aggregates, invoices, teams }: { aggregates: any, invoices: string[], teams: string[] }) {
  const data = useMemo(() => {
    const map: Record<string, number> = {};
    for (const inv of invoices) {
      const perTeam = aggregates.byInvoiceTeamTask?.[inv] || {};
      for (const team of Object.keys(perTeam)) {
        if (teams.length && !teams.includes(team)) continue;
        for (const [task, val] of Object.entries(perTeam[team] || {})) {
          map[task] = (map[task] ?? 0) + (val as number);
        }
      }
    }
    const arr = Object.entries(map).map(([task, val]) => ({ task, val }));
    arr.sort((a,b)=>b.val - a.val);
    return arr;
  }, [aggregates, invoices, teams]);

  return (
    <div className="space-y-4">
      <div className="w-full" style={{height: 360}}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical">
            <XAxis type="number" tickFormatter={(v)=>String(v)} />
            <YAxis type="category" dataKey="task" width={120} />
            <Tooltip formatter={(v:any)=>toCurrency(Number(v))} />
            <Bar dataKey="val" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="overflow-auto">
        <table className="min-w-[480px] w-full text-sm">
          <thead className="sticky top-0 bg-slate-50">
            <tr>
              <th className="text-right p-2">کار</th>
              <th className="text-left p-2">مبلغ</th>
            </tr>
          </thead>
          <tbody>
            {data.map(row => (
              <tr key={row.task} className="odd:bg-white even:bg-slate-50/50">
                <td className="p-2">{row.task}</td>
                <td className="p-2">{toPersianDigits(toCurrency(row.val))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
